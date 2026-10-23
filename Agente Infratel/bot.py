"""Automacao de login no INFRATEL (Claro Brasil) - Versao Aprimorada (fill_all_ok).

Fluxo:
  1) abre o Chromium visivel na pagina REAL de login do INFRATEL;
  2) preenche Usuario e Senha a partir do .env;
  3) PAUSA e espera VOCE digitar a chave do Authenticator (#otp_code) na janela;
  4) ao detectar 6 digitos, clica em "Entrar";
  5) entra no CONSOLE interativo multi-guia (painel de botoes em cada aba; varias
     guias podem ser preenchidas em paralelo com a mesma sessao).

Comandos Especiais:
  fill_qdcc: preenche Valores Medidos e Med. A do QDCC.
  fill_mt:   preenche identificacao (se vazia), Valores Medidos e situacoes OK da aba MT.
  fill_ok:   marca "OK" em todos os radio buttons de inspecao/situacao em QUALQUER tela.
"""

from __future__ import annotations

import json
import math
import os
import queue
import random
import re
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote

from dotenv import load_dotenv, set_key, unset_key
from playwright.sync_api import BrowserContext, Page, TimeoutError as PlaywrightTimeoutError, sync_playwright

LOGIN_URL = "https://infratel.claro.com.br/infratel/public/index.php/user"
NAV_TIMEOUT_MS = 30_000
SETTLE_MS = 2_000

# 0 significa SEM limite de tempo.
OTP_WAIT_SECONDS = int(os.getenv("OTP_WAIT_SECONDS", "0"))
HOLD_OPEN_SECONDS = int(os.getenv("HOLD_OPEN_SECONDS", "0"))

# ---------------------------------------------------------------------------
# Raiz de arquivos externos (.env, hubs.json, discovery/, .playwright-browsers):
# em execucao normal e a pasta deste script; no .exe PORTABLE (PyInstaller) e a
# pasta do proprio .exe — assim o pacote e movido junto com .env e hubs.json.
# ---------------------------------------------------------------------------
if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).resolve().parent
DISCOVERY_DIR = BASE_DIR / "discovery"

# Chromium do Playwright: aponta para a pasta .playwright-browsers ao lado do
# .exe (mesma logica do rodar_bot.bat). So define se o usuario nao definiu.
if "PLAYWRIGHT_BROWSERS_PATH" not in os.environ:
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(BASE_DIR / ".playwright-browsers")

# ---------------------------------------------------------------------------
# Banco de dados de peculiaridades por hub: hubs.json (ao lado deste arquivo).
# Guarda faixas de tensoes e constantes que VARIAM de site para site (ex.:
# UPS de hub 127V vs 220V). O bot le o arquivo na inicializacao; chaves que
# comecam com "_" sao comentarios/observacoes e sao ignoradas. Cada secao tem
# um "_padrao" que vale para QUALQUER hub; cadastrar a sigla do site cria um
# override parcial (so o que difere). Edite o JSON e reinicie o bot — ou rode
# 'hubs' no console para conferir o que esta carregado.
# ---------------------------------------------------------------------------
HUBS_PATH = BASE_DIR / "hubs.json"

def _carregar_hubs() -> dict:
    """Le hubs.json e devolve o dict completo (vazio se o arquivo nao existir)."""
    try:
        with open(HUBS_PATH, encoding="utf-8") as f:
            dados = json.load(f)
        print(f"[hubs] Carregado {HUBS_PATH.name}: "
              f"UPS={list((dados.get('UPS') or {}).keys())} "
              f"QDCA={list((dados.get('QDCA') or {}).keys())}")
        return dados
    except FileNotFoundError:
        print(f"  [aviso] {HUBS_PATH.name} nao encontrado — usando padroes internos.")
        return {}
    except Exception as e:
        print(f"  [erro] Falha ao ler {HUBS_PATH.name}: {e} — usando padroes internos.")
        return {}

HUBS = _carregar_hubs()

def _hub_cfg(secao: str, site: str) -> dict:
    """Devolve a config da secao para o site: _padrao + override do hub.

    Chaves que comecam com "_" (observacoes) sao removidas. Se a secao ou o
    _padrao nao existirem no JSON, devolve dict vazio (o chamador decide).
    """
    bloco = HUBS.get(secao) or {}
    cfg = {k: v for k, v in (bloco.get("_padrao") or {}).items() if not k.startswith("_")}
    override = {k: v for k, v in (bloco.get(site) or {}).items() if not k.startswith("_")}
    cfg.update(override)
    return cfg

# ---------------------------------------------------------------------------
# Mapeamento da aba MT (extraido do comando 'scan').
# ATENCAO: os valores de identificacao abaixo sao REFERENCIA do site JAIDTC.
# Sao aplicados apenas em campos VAZIOS e editaveis (nunca sobrescrevem).
# ---------------------------------------------------------------------------
MT_IDENTIFICACAO = {
    "#txt_concessionaria_mt": "CPFL",
    "#txt_telefone_mt": "(19) 3754-7628",
    "#txt_cod_consumidor_mt": "2026247429",
    "#txt_num_medidor_mt": "40191898",
    "#txt_padrao_entrada_energia_mt": "SIMPLIFICADA POSTE C/ TRAFO",
}

# Valores Medidos (tensoes, correntes, temperaturas).
# ATENCAO: as tensoes do bloco "Tensao (VCA)" dependem do SISTEMA do hub e
# sao recalculadas em fill_mt por _vca_mt_valores() (le a tensao FF da propria
# pagina). Aqui ficam os valores de REFERENCIA para um sistema 220V.
MT_MEDIDOS = {
    "#txt_tensao_rn_mt": "127.0", "#txt_tensao_sn_mt": "127.2", "#txt_tensao_tn_mt": "127.8",
    "#txt_tensao_rs_mt": "220.0", "#txt_tensao_st_mt": "221.3", "#txt_tensao_tr_mt": "220.9",
    "#txt_corrente_r_mt": "0", "#txt_corrente_s_mt": "0", "#txt_corrente_t_mt": "0",
    "#txt_temperatura_r_mt": "20", "#txt_temperatura_s_mt": "20", "#txt_temperatura_t_mt": "20",
    "#potenciaConsumida_mt": "142.86", "#percentoUtilizacao_mt": "47.62",
}

MT_SELECTS = {"#cmb_estado_funcionamento_mt": "OK"}

def _vca_mt_valores(page: Page) -> dict[str, str]:
    """Valores do bloco 'Tensao (VCA)' da aba MT, conforme a tensao do SISTEMA.

    O proprio formulario informa a tensao FF em #txt_tensao_mt (rotulo
    'Tensao FF (V)'): 220 num sistema 220V, 380 num sistema 380V. Com isso:
      - sistema 220V: RN/SN/TN = 127.x (fase-neutra)  e RS/ST/TR = 220.x (fase-fase)
      - sistema 380V: RN/SN/TN = 220.x (fase-neutra)  e RS/ST/TR = 380.x (fase-fase)

    Importante: preencher 127/220 num sistema 380V faz o SITE ZERAR o campo
    (validacao client-side) e mostrar 'Obrigatorio.' — foi o que aconteceu no
    hub OCOJMA (380V). Por isso os valores sao derivados, nunca fixos.
    """
    ff = 0.0
    for sel in ("#txt_tensao_mt", "#txt_tensao_bt"):
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                continue
            bruto = (loc.input_value() or "").strip().replace(",", ".")
            if bruto:
                ff = float(bruto)
                break
        except Exception:
            continue
    if ff >= 300:
        fn, fase_fase = 220.0, 380.0
    else:
        fn, fase_fase = 127.0, 220.0
    print(f"[mt] Tensao FF do sistema: {ff:g}V -> VCA fase-neutra {fn:g}V / fase-fase {fase_fase:g}V")
    return {
        "rn": f"{fn:.1f}", "sn": f"{fn + 0.2:.1f}", "tn": f"{fn + 0.8:.1f}",
        "rs": f"{fase_fase:.1f}", "st": f"{fase_fase + 1.3:.1f}", "tr": f"{fase_fase + 0.9:.1f}",
    }

# ---------------------------------------------------------------------------
# Mapeamento da aba UPS. As tensoes AC variam por HUB: o Infratel exibe
# 'ATENCAO' e recusa o salvamento se o valor estiver fora da faixa esperada
# para o site. As faixas vivem no banco hubs.json (secao UPS): _padrao vale
# para qualquer hub; cadastre a sigla do site (ex.: "JAIDTC") para sobrescrever
# so o que difere. NOVA REGRA (22/10/2026, tecnico): o _padrao e 127/220
# (FN 127.0-130.3 / FF 220.0-224.3); os hubs 380V estao cadastrados com
# FN 220.0-224.3 / FF 380.0-384.3. Fallback abaixo e usado apenas se o
# hubs.json nao existir.
# ---------------------------------------------------------------------------
UPS_PADRAO_FALLBACK = {
    # (min, max) em V — valores sorteados dentro da faixa a cada preenchimento
    "ent_fn": (127.0, 130.3),   # Tensao Ent. AC FN (V) - RN/SN/TN
    "ent_ff": (220.0, 224.3),   # Tensao Ent. AC FF (V) - RS/ST/TR
    "sai_fn": (127.0, 130.3),   # Tensao Sai. AC FN (V) - RN/SN/TN (1 casa)
    "sai_ff": (220.0, 224.3),   # Tensao Sai. AC FF (V) - RS/ST/TR (1 casa)
    "corr_ent": 30,             # Corr. de Ent. AC (A) - R/S/T
    "corr_sai": 10,             # Corr. de Sai. AC (A) - R/S/T
    "freq": 60,                 # Frequencia (Hz) - R/S/T
    "temp_ent": 20,             # Temp. Ent. UPS (C)
    "temp_sai": 21,             # Temp. Sai. UPS (C)
    "corr_recarga": 0,          # Corrente de Recarga Banco de Bat (A) — sempre 0
    "autonomia": 100,           # Autonomia - Display (min) — Obrigatorio
}

# ---------------------------------------------------------------------------
# Fallback das tensoes AC da UPS: em alguns hubs (ex.: SPOPIR) os IDs
# #txt_tensao_*_ent_ups NAO existem e os campos ficam vazios apesar do
# preenchimento por ID ter "dados certo" no terminal. Aqui as linhas sao
# localizadas pelo ROTULO visivel ('Tensao Ent. AC FN' etc.).
# ATENCAO (dump real): no Infratel o rotulo NAO e um <label> — e um <input>
# (id lbl_tensao_ent_ups) com o texto no .VALUE, entao a busca precisa casar
# textContent E value. Os inputs da linha (a direita do rotulo, mesma tr ou
# faixa-Y) sao MARCADOS com data-bot-rot e preenchidos via Playwright.
# ---------------------------------------------------------------------------
_JS_UPS_TENSAO_POR_ROTULO = r"""
(pares) => {
  const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const texto = (el) => norm(el.tagName === 'INPUT' ? (el.value || '') : (el.textContent || ''));
  const entradas = [...document.querySelectorAll('input')].filter((el) =>
    el.type !== 'hidden' && el.type !== 'radio' && el.type !== 'checkbox' && vis(el));
  const diag = [];
  for (const [chave, rotulo, n] of pares) {
    const alvo = norm(rotulo);
    const cands = [...document.querySelectorAll('label, legend, th, td, div, span, p, input')]
      .filter((el) => {
        const t = texto(el);
        return t.includes(alvo) && t.length < 80 && vis(el);
      })
      .sort((a, b) => texto(a).length - texto(b).length);
    if (!cands.length) { diag.push(chave + ': rotulo nao encontrado'); continue; }
    const rot = cands[0];
    const rb = rot.getBoundingClientRect();
    const trRot = rot.closest ? rot.closest('tr') : null;
    const linha = entradas.filter((el) => {
      if (el === rot) return false;
      if (el.id && el.id.indexOf('lbl_') === 0) return false;
      const b = el.getBoundingClientRect();
      if (b.left < rb.left - 2) return false;
      if (trRot) return el.closest('tr') === trRot;
      const cy = b.top + b.height / 2, ry = rb.top + rb.height / 2;
      return Math.abs(cy - ry) <= Math.max(rb.height, 30);
    }).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    if (linha.length < n) {
      diag.push(chave + ': so ' + linha.length + ' input(s) na linha do rotulo');
      continue;
    }
    for (let i = 0; i < n; i++) linha[i].setAttribute('data-bot-rot', chave + ':' + i);
    diag.push(chave + ': rotulo ok, ' + linha.length + ' inputs na linha, ' + n + ' marcados');
  }
  return diag;
}
"""


# ---------------------------------------------------------------------------
# Fallback do bloco "Tensao (VCA)" da aba MT/BT: em alguns hubs os IDs das
# tensoes NAO batem (nem #txt_tensao_rn_mt nem #txt_tensao_rn_bt existem) e o
# bloco fica vazio, com "Obrigatorio." no site. Aqui o bloco e localizado pelo
# ROTULO visivel ("Tensao (VCA)") e pelos LIMITES geometricos (vai ate o
# proximo rotulo, "Corrente"), os 6 inputs (RN, SN, TN, RS, ST, TR) sao
# marcados com data-bot-mt e preenchidos via Playwright.
# ---------------------------------------------------------------------------
_JS_MT_VCA_POR_ROTULO = r"""
() => {
  const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
  // versao "so letras": tolera acento perdido, espaco, parenteses e pontuacao
  const chave = (s) => norm(s).replace(/[^a-z0-9]/g, '');
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const texto = (el) => norm(el.tagName === 'INPUT' ? (el.value || '') : (el.textContent || ''));
  const diag = [];
  const els = [...document.querySelectorAll(
    'label, legend, th, td, div, span, p, strong, b, h1, h2, h3, h4, h5, h6, input')];
  const cab = els.filter((el) => vis(el) && chave(texto(el)).includes('tensaovca')
    && chave(texto(el)).length < 40)
    .sort((a, b) => chave(texto(a)).length - chave(texto(b)).length);
  if (!cab.length) { diag.push('rotulo "Tensao (VCA)" nao encontrado'); return diag; }
  const titulo = cab[0];
  const tr = titulo.getBoundingClientRect();
  // proximo titulo abaixo ("Corrente (A)") delimita o fim do bloco
  const prox = els.filter((el) => vis(el) && chave(texto(el)).startsWith('corrente')
    && chave(texto(el)).length < 40)
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.top > tr.top)
    .sort((a, b) => a.top - b.top)[0];
  const limite = prox ? prox.top : tr.bottom + 500;
  const brutos = [...document.querySelectorAll('input')].filter((el) => {
    if (el.type === 'hidden' || el.type === 'radio' || el.type === 'checkbox') return false;
    if (!vis(el)) return false;
    const b = el.getBoundingClientRect();
    return b.top >= tr.bottom - 8 && b.top < limite;
  }).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  // Agrupa em LINHAS pela sobreposição vertical real (nao por distancia fixa):
  // dois campos estao na mesma linha quando as caixas se sobrepoem verticalmente.
  const linhas = [];
  for (const el of brutos) {
    const b = el.getBoundingClientRect();
    let entrou = false;
    for (const l of linhas) {
      const ref = l.els[0].getBoundingClientRect();
      const sobrep = Math.min(b.bottom, ref.bottom) - Math.max(b.top, ref.top);
      const menor = Math.min(b.height, ref.height) || 1;
      if (sobrep / menor > 0.5) { l.els.push(el); entrou = true; break; }
    }
    if (!entrou) linhas.push({ els: [el] });
  }
  const inputs = [];
  for (const l of linhas) {
    l.els.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    inputs.push(...l.els);
  }
  if (inputs.length < 6) {
    diag.push('bloco achou ' + inputs.length + ' input(s) (esperado 6)');
    return diag;
  }
  inputs.slice(0, 6).forEach((el, i) => el.setAttribute('data-bot-mt', String(i)));
  diag.push('bloco "Tensao (VCA)": 6 inputs marcados');
  return diag;
}
"""


def _cfg_ups(site: str) -> dict:
    """Config UPS do site: hubs.json (UPS._padrao + UPS[site]) ou fallback."""
    cfg = _hub_cfg("UPS", site)
    if not cfg:
        print("  [aviso] hubs.json sem secao UPS — usando padrao interno.")
        cfg = dict(UPS_PADRAO_FALLBACK)
    return cfg

def _vsorteada(faixa, casas: int = 0) -> str:
    """Sorteia um valor aleatorio dentro de (min, max).

    casas=0 -> inteiro (ex.: 221); casas=1 -> 1 casa decimal (ex.: 378.9).
    Aceita tupla (min, max) ou lista [min, max] (vinda do hubs.json).
    """
    lo, hi = float(faixa[0]), float(faixa[1])
    if casas <= 0:
        return str(random.randint(int(lo), int(hi)))
    return f"{random.uniform(lo, hi):.{casas}f}"

def _vsorteadas_grupo(faixa, n: int = 3, casas: int = 0) -> list[str]:
    """Sorteia N valores PROXIMOS entre si dentro da faixa (min, max).

    Sortear cada fase isoladamente espalha os numeros pela faixa toda
    (ex.: RN 139 / SN 129 / TN 109) e denuncia preenchimento generico.
    Aqui uma base e sorteada uma unica vez e cada valor desvia dela no
    maximo 'desvio' (limitado ao 1/4 da largura da faixa, minimo 1 unidade
    da precisao), mantendo tudo dentro de (min, max) e os N campos coerentes
    entre si — parecem medicoes reais do mesmo quadro.

    casas=0 -> inteiro; casas=1 -> 1 casa decimal. Devolve lista de strings.
    """
    lo, hi = float(faixa[0]), float(faixa[1])
    largura = hi - lo
    passo_min = 10 ** (-casas) if casas > 0 else 1.0
    # desvio: ate 1/4 da faixa, nunca menos que 1 unidade minima da precisao
    desvio = max(largura / 4, passo_min)
    # base com folga para nao estourar os extremos apos o desvio
    base = random.uniform(lo + min(desvio, largura / 2), hi - min(desvio, largura / 2))
    # extremos ja arredondados (inteiros NUNCA saem fora da faixa, ex.: 131.8 -> 131)
    i_lo, i_hi = math.ceil(lo), math.floor(hi)
    if i_lo > i_hi:
        i_lo = i_hi = int(round(lo))
    valores: list[str] = []
    for _ in range(n):
        v = min(max(base + random.uniform(-desvio, desvio), lo), hi)
        if casas <= 0:
            valores.append(str(min(max(int(round(v)), i_lo), i_hi)))
        else:
            valores.append(f"{v:.{casas}f}")
    return valores

def _gerar_ups_medidos(site: str) -> dict[str, str]:
    """Monta o mapa seletor->valor da aba UPS (vale para qualquer hub).

    Tensoes sorteadas em GRUPOS PROXIMOS (as 3 fases de cada linha saem de
    uma mesma base, sem defazagem estranha entre R/S/T) dentro das faixas do
    hubs.json (padrao + override do hub); corrente de recarga e autonomia
    fixos.
    """
    cfg = _cfg_ups(site)
    ent_fn = _vsorteadas_grupo(cfg["ent_fn"], 3, 0)
    ent_ff = _vsorteadas_grupo(cfg["ent_ff"], 3, 0)
    sai_fn = _vsorteadas_grupo(cfg["sai_fn"], 3, 1)
    sai_ff = _vsorteadas_grupo(cfg["sai_ff"], 3, 1)
    return {
        "#txt_temp_ent_ups": str(cfg["temp_ent"]),
        "#txt_temp_sai_ups": str(cfg["temp_sai"]),
        "#txt_tensao_rn_ent_ups": ent_fn[0],
        "#txt_tensao_sn_ent_ups": ent_fn[1],
        "#txt_tensao_tn_ent_ups": ent_fn[2],
        "#txt_tensao_rs_ent_ups": ent_ff[0],
        "#txt_tensao_st_ent_ups": ent_ff[1],
        "#txt_tensao_tr_ent_ups": ent_ff[2],
        "#txt_corrente_r_ent_ups": str(cfg["corr_ent"]),
        "#txt_corrente_s_ent_ups": str(cfg["corr_ent"]),
        "#txt_corrente_t_ent_ups": str(cfg["corr_ent"]),
        "#txt_tensao_rn_sai_ups": sai_fn[0],
        "#txt_tensao_sn_sai_ups": sai_fn[1],
        "#txt_tensao_tn_sai_ups": sai_fn[2],
        "#txt_tensao_rs_sai_ups": sai_ff[0],
        "#txt_tensao_st_sai_ups": sai_ff[1],
        "#txt_tensao_tr_sai_ups": sai_ff[2],
        "#txt_corrente_r_sai_ups": str(cfg["corr_sai"]),
        "#txt_corrente_s_sai_ups": str(cfg["corr_sai"]),
        "#txt_corrente_t_sai_ups": str(cfg["corr_sai"]),
        "#txt_frequencia_r_ups": str(cfg["freq"]),
        "#txt_frequencia_s_ups": str(cfg["freq"]),
        "#txt_frequencia_t_ups": str(cfg["freq"]),
        "#txt_corrente_recarga_ups": str(cfg["corr_recarga"]),
        "#txt_autonomia_ups": str(cfg["autonomia"]),
    }

# ---------------------------------------------------------------------------
# Painel flutuante de botoes injetado na pagina controlada.
# Os botoes apenas empilham o comando em window.__botQueue; o Python le a fila
# via page.evaluate (polling) e executa, sem precisar do terminal.
# ---------------------------------------------------------------------------
PANEL_JS = r"""
(() => {
  window.__botQueue = window.__botQueue || [];
  window.__botStatus = window.__botStatus || 'Pronto.';

  const render = () => {
    const s = document.getElementById('__bot_status');
    if (s) s.textContent = window.__botStatus;
  };
  window.__botRender = render;

  const build = () => {
    if (document.getElementById('__bot_panel')) { render(); return; }

    const box = document.createElement('div');
    box.id = '__bot_panel';
    box.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:2147483647;'
      + 'background:#0f172a;color:#e2e8f0;font:12px/1.45 system-ui,Segoe UI,sans-serif;'
      + 'border:1px solid #334155;border-radius:10px;padding:8px;width:196px;'
      + 'box-shadow:0 10px 30px rgba(0,0,0,.45);cursor:default;';

    const head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;'
      + 'font-weight:600;margin-bottom:6px;cursor:move;user-select:none;padding:4px;'
      + 'background:#1e293b;border-radius:6px 6px 0 0;margin:-8px -8px 8px -8px;';
    const title = document.createElement('span');
    title.style.marginLeft = '8px';
    title.textContent = ':: Bot Infratel';
    const toggle = document.createElement('button');
    toggle.textContent = '_';
    toggle.style.cssText = 'cursor:pointer;background:transparent;border:0;color:#94a3b8;'
      + 'font:inherit;padding:0 8px;';
    head.appendChild(title);
    head.appendChild(toggle);

    // Lógica para arrastar (Drag and Drop)
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    head.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = box.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      box.style.transition = 'none';
      box.style.right = 'auto';
      box.style.bottom = 'auto';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      box.style.left = (startLeft + dx) + 'px';
      box.style.top = (startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    const body = document.createElement('div');

    const botoes = [
      ['MT completo', 'fill_mt'],
      ['FCC completo', 'fill_fcc_tudo'],
      ['Diag FCC', 'diag_fcc'],
      ['UPS completo', 'fill_ups_tudo'],
      ['QDCA completo', 'fill_qdca'],
      ['QDCC completo', 'fill_qdcc'],
      ['Dados QDCC', 'dados'],
      ['Nova guia', 'nova']
    ];
    botoes.forEach(function (par) {
      const b = document.createElement('button');
      b.className = '__bot_btn';
      b.textContent = par[0];
      b.style.cssText = 'display:block;width:100%;margin-bottom:4px;cursor:pointer;'
        + 'border:1px solid #334155;border-radius:6px;background:#1e293b;color:#e2e8f0;'
        + 'padding:6px 8px;font:inherit;text-align:left;';
      b.addEventListener('click', function () {
        window.__botQueue.push(par[1]);
        window.__botStatus = 'Executando: ' + par[0];
        render();
      });
      body.appendChild(b);
    });

    const status = document.createElement('div');
    status.id = '__bot_status';
    status.style.cssText = 'margin-top:6px;font-size:11px;color:#93c5fd;max-height:70px;'
      + 'overflow:auto;white-space:pre-wrap;border-top:1px solid #1e293b;padding-top:6px;';
    body.appendChild(status);

    toggle.addEventListener('click', function () {
      const oculto = body.style.display === 'none';
      body.style.display = oculto ? 'block' : 'none';
      toggle.textContent = oculto ? '_' : '+';
    });

    box.appendChild(head);
    box.appendChild(body);
    document.documentElement.appendChild(box);
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
"""

# ---------------------------------------------------------------------------
# Mapeamento da aba FCC — NOVA REGRA (22/10/2026): as tensoes AC do FCC
# seguem a MESMA regra por hub da UPS (hubs.json, secao FCC): _padrao 127/220
# (FN 127.0-130.3 / FF 220.0-224.3); hubs 380V cadastrados com FN 220.0-224.3
# / FF 380.0-384.3. O formulario do FCC so tem campos FF (txt_tensao_rs/st/tr
# _fcc); a faixa 'fn' fica guardada para o caso de o formulario passar a ter
# RN/SN/TN. Fallback abaixo e usado apenas se o hubs.json nao existir.
# ---------------------------------------------------------------------------
FCC_PADRAO_FALLBACK = {
    "fn": (127.0, 130.3),   # Tensao FN (V) - RN/SN/TN (campos ainda nao existem no form)
    "ff": (220.0, 224.3),   # Tensao FF (V) - RS/ST/TR
}
# Campos FN do FCC que NEM TODO formulario tem — sumir deles nao e erro.
FCC_TENSAO_FN_OPTS = ("#txt_tensao_rn_fcc", "#txt_tensao_sn_fcc", "#txt_tensao_tn_fcc")

def _cfg_fcc(site: str) -> dict:
    """Config FCC do site: hubs.json (FCC._padrao + FCC[site]) ou fallback."""
    cfg = _hub_cfg("FCC", site)
    if not cfg:
        print("  [aviso] hubs.json sem secao FCC — usando padrao interno.")
        cfg = dict(FCC_PADRAO_FALLBACK)
    return cfg

def _gerar_fcc_medidos(site: str) -> dict[str, str]:
    """Monta o mapa seletor->valor da aba FCC (tensoes por hub, resto fixo).

    Tensoes FF (RS/ST/TR) sorteadas em GRUPO PROXIMO dentro da faixa FCC do
    hubs.json; FN (RN/SN/TN) tambem sorteadas, mas so sao aplicadas se o
    formulario tiver esses campos (hoje so existem os FF). Correntes 0,
    tensao de carga 53.4, consumo DC 0 e corrente de flutuacao 0 seguem
    fixos (regra anterior do tecnico, inalterada).
    """
    cfg = _cfg_fcc(site)
    ff = _vsorteadas_grupo(cfg["ff"], 3, 1)
    fn = _vsorteadas_grupo(cfg["fn"], 3, 1)
    return {
        "#txt_tensao_rs_fcc": ff[0], "#txt_tensao_st_fcc": ff[1], "#txt_tensao_tr_fcc": ff[2],
        "#txt_tensao_rn_fcc": fn[0], "#txt_tensao_sn_fcc": fn[1], "#txt_tensao_tn_fcc": fn[2],
        "#txt_corrente_r_fcc": "0", "#txt_corrente_s_fcc": "0", "#txt_corrente_t_fcc": "0",
        "#txt_tensao_carga_fcc": "53.4", "#txt_consumo_dc_fcc": "0", "#txt_corrente_flut_fcc": "0",
    }

HELP = """
Comandos do console (a sessao autenticada e preservada):
  ls                     lista elementos interativos da pagina atual
  scan                   lista campos e seus VALORES atuais (copie e cole aqui)
  scanv                  lista TODOS os campos visiveis, inclusive os VAZIOS (com id)
  dados                  diagnostico do export de QDF/QDCC (dados medidos do app)
  dump [arquivo]         salva a estrutura da pagina em JSON (pasta discovery/)
  shot [arquivo]         salva um screenshot PNG (pasta discovery/)
  fill_qdcc              preenche Valores Medidos e Med. A do QDCC
  fill_mt                preenche identificacao (se vazia), Valores Medidos e OKs da aba MT
  fill_fcc               preenche Valores Medidos e OKs da aba FCC (tensoes FF
                          SORTEADAS por hub na secao FCC do hubs.json — mesma
                          regra 127/220 vs 380V do UPS; correntes 0, carga 53.4)
  fill_fcc_bat           clica nos botoes 'Carregar medicoes' (se visiveis) e preenche
                         tabelas de Baterias da aba FCC por perfil de tensao
                         (le Tensao VDC de cada banco: 12V -> 13.5-13.7/12.2-12.8/4.0-7.8
                           com 1 casa decimal (ex.: 6.1);
                           2V -> 2.20/2.00/1.39-1.98 com 2 casas decimais (ex.: 6.43);
                           temperatura 20; condutancia e densidade 0)
  fill_fcc_tudo          o mesmo que o botao 'FCC completo' do painel: carrega as
                          medicoes ('Carregar medicoes'), preenche Valores Medidos e
                          depois as Baterias — tudo em um clique
  fill_ups               preenche ticket + Valores Medidos da aba UPS de QUALQUER
                          hub com tensoes SORTEADAS nas faixas do banco hubs.json
                          (secao UPS: _padrao + override do hub) + situacoes OK
  fill_ups_bat           clica 'Carregar medicoes' e preenche tabelas de Baterias
                          da UPS (sufixo _ups; mesmos perfis 12V/2V da FCC)
  fill_ups_tudo          o mesmo que o botao 'UPS completo': medicoes + UPS + baterias
  fill_qdca              preenche a aba QDCA (PDT/QGBT) de QUALQUER hub: ticket +
                          Valores Medidos com tensoes VCA SORTEADAS (FN 128.2-132 /
                          FF 219-224.3), corrente/temp/fase/balanceamento 0,
                          seletividade L/S/I/T1/T2 = NAO SE APLICA, disjuntores
                          Med R/S/T = 0, situacoes OK
  hubs                   mostra o conteudo do banco de peculiaridades hubs.json
                          (faixas de tensao por hub — UPS, QDCA, ...)
  diag_fcc               diagnostico: matriz banco x elemento com estado de cada campo (vazio/disabled/readonly/radio)
  guia [n]               lista as guias abertas (* = alvo do terminal) ou troca o alvo p/ guia <n>
  nova [url]             abre nova guia JA LOGADA na mesma janela (padrao: clona a guia atual)
  fechar [n]             fecha a guia <n> (padrao: a ativa; a ultima guia nao pode ser fechada)
  fill_ok [aba|tudo]     marca "OK" nos radios (padrao: pagina toda; 'aba' = so a aba aberta)
  goto <url>             navega para a URL
  click <seletor>        clica no elemento
  fill <seletor> <valor> preenche o campo
  text <seletor>         imprime o texto do elemento
  url / title            mostra URL ou Titulo
  help                   mostra esta ajuda
  exit                   encerra
""".strip()

@dataclass(frozen=True)
class Credentials:
    user: str
    password: str
    ticket: str = ""
    def __repr__(self) -> str:
        return f"Credentials(user={self.user!r}, password='***', ticket={self.ticket!r})"

def load_credentials() -> Credentials:
    # So carrega o .env como PREFILL da tela de login local (login.html);
    # nao sai mais do processo se faltar — a tela pede o que faltar.
    load_dotenv(BASE_DIR / ".env")
    user = os.getenv("INFRATEL_USER", "")
    password = os.getenv("INFRATEL_PASS", "")
    ticket = os.getenv("INFRATEL_TICKET", "")
    if not user or not password:
        print("[aviso] Credenciais nao encontradas no .env. Serao solicitadas na tela de login.")
    return Credentials(user=user, password=password, ticket=ticket)

def salvar_credenciais_no_env(user: str, password: str, ticket: str, salvar: bool,
                              env_path: Path | None = None) -> None:
    # A persistencia REAL entre execucoes e o .env: o contexto do Playwright e
    # efemero (o localStorage do login.html morre ao fechar o navegador) e o
    # .env ja e a fonte de credenciais do projeto (.gitignore).
    env_path = env_path or (BASE_DIR / ".env")
    try:
        if not env_path.exists():
            env_path.touch()
        if salvar:
            set_key(str(env_path), "INFRATEL_USER", user)
            set_key(str(env_path), "INFRATEL_PASS", password)
            set_key(str(env_path), "INFRATEL_TICKET", ticket)
            print(f"[login] Credenciais gravadas em {env_path.name} (proxima execucao ja vem pre-preenchida).")
        else:
            unset_key(str(env_path), "INFRATEL_USER")
            unset_key(str(env_path), "INFRATEL_PASS")
            unset_key(str(env_path), "INFRATEL_TICKET")
            print(f"[login] 'Salvar login' desmarcado: credenciais removidas de {env_path.name}.")
    except Exception as e:
        print(f"[aviso] Nao foi possivel atualizar o .env: {e}")

def collect_interactive(page: Page) -> dict[str, list[dict]]:
    return page.evaluate("""() => {
        const toSelector = (el) => {
            if (el.id) return '#' + CSS.escape(el.id);
            if (el.name) return el.tagName.toLowerCase() + '[name="' + el.name + '"]';
            return null;
        };
        const label = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').trim().slice(0, 60);
        const visible = (el) => !!(el.offsetWidth || el.offsetHeight);
        const fields = [...document.querySelectorAll('input, select, textarea')].map((el) => ({
            tag: el.tagName.toLowerCase(),
            type: el.type || '',
            id: el.id || '',
            name: el.name || '',
            placeholder: el.placeholder || '',
            selector: toSelector(el),
            visible: visible(el),
            disabled: el.disabled || false,
            readonly: el.readOnly || false,
            value: el.value || '',
            checked: el.checked || false
        }));
        const buttons = [...document.querySelectorAll('button, input[type=submit], a.btn')].map((el) => ({
            text: label(el), selector: toSelector(el), visible: visible(el)
        }));
        const links = [...document.querySelectorAll('a[href]')].slice(0, 40).map((el) => ({
            text: label(el), href: el.getAttribute('href')
        }));
        return { url: location.href, title: document.title, fields, buttons, links };
    }""")

def print_interactive(page: Page) -> None:
    data = collect_interactive(page)
    print(f"\n[dump] URL: {data['url']}\n[dump] Titulo: {data['title']!r}")
    print(f"\n[dump] Campos ({len(data['fields'])}):")
    for f in data["fields"]:
        if f["visible"]: 
            print(f"  - {f['selector'] or '(sem id)'} | type={f['type']} | ph={f['placeholder']}")

def print_scan(page: Page) -> None:
    data = collect_interactive(page)
    print(f"\n[scan] Analisando valores preenchidos na pagina...")
    print(f"[scan] URL: {data['url']}")
    print(f"\n--- DADOS DA PAGINA (COPIE ABAIXO) ---")
    for f in data["fields"]:
        if not f["visible"]: continue
        if f["type"] in ("radio", "checkbox"):
            if f["checked"]:
                print(f"MARCADO: {f['selector']} | id={f['id']} | name={f['name']}")
        elif f["value"]:
            print(f"VALOR: {f['selector']} -> '{f['value']}' | id={f['id']}")
    print(f"--- FIM DO SCAN ---")
    print(f"\n[dump] Botoes ({len(data['buttons'])}):")
    for b in data["buttons"]:
        if b["visible"]: print(f"  - {b['selector'] or '(sem id)'} | {b['text']!r}")

def print_scan_vazio(page: Page) -> None:
    """Lista TODOS os campos visiveis, inclusive os VAZIOS, com id/nome/tipo.

    O 'scan' so mostra campos com valor — por isso nao dava para ver os IDs
    dos campos que ficaram vazios (ex.: o bloco 'Tensao (VCA)' da aba MT).
    Este comando mostra tudo, para colar e conferir os IDs reais do site.
    """
    data = collect_interactive(page)
    print(f"\n[scanv] URL: {data['url']}")
    print(f"\n--- TODOS OS CAMPOS VISIVEIS (inclusive vazios) ---")
    for f in data["fields"]:
        if not f["visible"]:
            continue
        print(f"  - id={f['id']!r} | name={f['name']!r} | type={f['type']} | val={f['value']!r}")
    print("--- FIM DO SCANV ---")

def _discovery_path(kind: str, name: str | None, ext: str) -> Path:
    DISCOVERY_DIR.mkdir(exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return DISCOVERY_DIR / (name or f"{kind}-{stamp}.{ext}")

def save_dump(page: Page, name: str | None = None) -> Path:
    path = _discovery_path("pagina", name, "json")
    path.write_text(json.dumps(collect_interactive(page), ensure_ascii=False, indent=2), "utf-8")
    return path

def save_shot(page: Page, name: str | None = None) -> Path:
    path = _discovery_path("pagina", name, "png")
    page.screenshot(path=str(path), full_page=True)
    return path

def fill_ok(page: Page, somente_visiveis: bool = False) -> None:
    """Marca 'OK' em todos os radio buttons de situacao detectados na pagina.

    Reconhece tres padroes (qualquer um marca o radio):
      - id terminando em '_ok'  -> ex.: status_insp_01_inicial_0_ok (Inspecao/Situacao);
      - id terminando em '_0'   -> ex.: optradioMedicaoMTF1_0 (opcoes de medicao);
      - label associado com texto 'OK'/'BOM'.

    somente_visiveis=True restringe a marcação aos radios da ABA ABERTA
    (as demais abas ficam em divs ocultas na mesma pagina).
    Usa click() via DOM, que ignora sobreposicao de elementos (comum no Infratel).
    """
    escopo = "aba aberta" if somente_visiveis else "pagina toda"
    print(f"[bot] Iniciando preenchimento de 'OK' ({escopo})...")

    stats = page.evaluate("""(somenteVisiveis) => {
        const results = { count: 0, skipped: 0, failed: [] };
        const radios = document.querySelectorAll('input[type="radio"]');
        const visivel = (el) => el.checkVisibility
            ? el.checkVisibility()
            : (el.getClientRects().length > 0);

        radios.forEach(radio => {
            if (somenteVisiveis && !visivel(radio)) return;

            const id = (radio.id || '').toLowerCase();
            const label = document.querySelector(`label[for="${radio.id}"]`);
            const labelText = label ? label.innerText.trim().toUpperCase() : '';
            const isOk = /_ok$/.test(id) || id.endsWith('_0')
                       || labelText === 'OK' || labelText === 'BOM';

            if (!isOk) return;
            if (radio.checked) { results.skipped++; return; }

            radio.click();
            if (radio.checked) results.count++;
            else results.failed.push((radio.id || radio.name || '(sem id)') + (radio.disabled ? '|disabled' : ''));
        });
        return results;
    }""", somente_visiveis)

    falhas = stats["failed"]
    print(f"[bot] Concluido: {stats['count']} marcados como OK, "
          f"{stats['skipped']} ja estavam OK, {len(falhas)} nao puderam ser marcados.")
    for fid in falhas[:20]:
        fid, _, bloqueio = fid.partition("|")
        motivo = "DISABLED pelo site (linha incompleta ou travada)" if bloqueio else "clique nao aplicado"
        print(f"  [falha] {fid} ({motivo})")

# ---------------------------------------------------------------------------
# DADOS REAIS DE QDF/QDCC — export do app "Preventivas Eletricas".
#
# O tecnico exporta as medicoes do app e copia o .json para a pasta de dados
# (BASE_DIR/dados QDF_QDCC/); o bot usa esses valores REAIS em vez dos fixos.
#
# Formato do export: {version, exportedAt, appName, recordCount, records: [...]}
# Cada record: site{sigla,name,cat}, tipo (QDF|QDCC), tipoComplemento,
# ticket, data, tensaoAC, tensaoDC, temperatura, medicaoCorrente{geral,viaA,viaB},
# circuitos[{n, viaA, viaB}], observacao.
#
# Chave de ligacao com o formulario do Infratel:
#   - site:  sigla do app normalizada (SM-MOO62 -> SMMOO62) == ?site= do Infratel
#   - tag:   txt_tag_qdcc do formulario ("QDF 1", "QDCC 01") == tipo + complemento
# ---------------------------------------------------------------------------
DADOS_DIR_NOMES = ("dados QDF_QDCC", "dados_qdf_qdcc", "dados")
_DADOS_CACHE: dict | None = None

def _dir_dados() -> Path | None:
    """Pasta de dados do export (BASE_DIR/dados QDF_QDCC e variantes)."""
    for nome in DADOS_DIR_NOMES:
        p = BASE_DIR / nome
        if p.is_dir():
            return p
    return None

def _arquivo_dados() -> Path | None:
    """Export .json MAIS RECENTE da pasta de dados (o tecnico vai sobrescrevendo)."""
    pasta = _dir_dados()
    if pasta is None:
        return None
    arquivos = sorted(pasta.glob("*.json"), key=lambda f: f.stat().st_mtime, reverse=True)
    return arquivos[0] if arquivos else None

def _num(v) -> float | None:
    """'54,1' -> 54.1 (o export usa virgula em parte dos valores). None se vazio."""
    if v is None:
        return None
    s = str(v).strip().replace(",", ".")
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None

def _norm_txt(s: str) -> str:
    """Normaliza texto: maiusculas, sem acento, so letras/digitos, sem zeros
    a esquerda dos numeros. 'QDF 01' -> 'QDF1'; 'QDCC 01' -> 'QDCC1'."""
    base = (s or "").upper()
    base = "".join(c for c in base if not (0xC0 <= ord(c) <= 0x24F))
    base = re.sub(r"[^A-Z0-9]+", " ", base).strip()
    # tira zeros a esquerda de cada numero: 01 -> 1, 10B -> 10B
    base = re.sub(r"\b0+(\d)", r"\1", base)
    return base.replace(" ", "")

def _chave_tag(rec: dict) -> str:
    """Chave da tag do registro: 'QDF' + '01' -> 'QDF1'; se o complemento ja
    comeca com o tipo ('QDF 01'), usa so o complemento."""
    tipo = _norm_txt(rec.get("tipo", ""))
    compl = rec.get("tipoComplemento") or ""
    compl_norm = _norm_txt(compl)
    if compl_norm and compl_norm.startswith(tipo):
        return compl_norm
    return _norm_txt(f"{tipo} {compl}")

def _carregar_dados() -> dict:
    """Le o export de QDF/QDCC e monta o indice (site, tag) -> registro."""
    global _DADOS_CACHE
    if _DADOS_CACHE is not None:
        return _DADOS_CACHE
    vazio = {"arquivo": None, "registros": {}, "total": 0, "erro": None, "colisoes": []}
    arquivo = _arquivo_dados()
    if arquivo is None:
        _DADOS_CACHE = vazio
        return _DADOS_CACHE
    try:
        bruto = json.loads(arquivo.read_text(encoding="utf-8"))
        records = bruto.get("records") or []
        indice: dict[tuple[str, str], dict] = {}
        colisoes: list[str] = []
        for rec in records:
            site = _norm_txt((rec.get("site") or {}).get("sigla", ""))
            tag = _chave_tag(rec)
            if not site or not tag:
                continue
            chave = (site, tag)
            antigo = indice.get(chave)
            if antigo is not None:
                # Mesmo site+tag medido mais de uma vez (datas diferentes):
                # fica a medicao MAIS RECENTE (data e, em empate, atualizadoEm).
                colisoes.append(f"{site}/{tag}")
                if str(rec.get("data") or "") <= str(antigo.get("data") or ""):
                    continue
            indice[chave] = rec
        _DADOS_CACHE = {"arquivo": arquivo, "registros": indice, "total": len(records),
                        "erro": None, "colisoes": colisoes}
    except Exception as e:
        _DADOS_CACHE = {**vazio, "arquivo": arquivo, "erro": str(e), "colisoes": []}
    return _DADOS_CACHE

def _dados_do_site(site: str, tag: str) -> dict | None:
    """Registro do export que casa com (site do Infratel, tag do formulario).

    1) sigla normalizada igual (app 'SM-MOO62' -> 'SMMOO62' == ?site=);
    2) override explicito no hubs.json (secao SITES): {"OCOJMA": "JMA"} — para
       os hubs em que a sigla do Infratel NAO e a sigla do app.
    Sem site/tag nao ha casamento (nunca casar 'o primeiro registro').
    """
    dados = _carregar_dados()
    if not dados["registros"]:
        return None
    if not site or not tag:
        return None
    alvo = _norm_txt(site)
    registro = dados["registros"].get((alvo, _norm_txt(tag)))
    if registro:
        return registro
    # override do hubs.json: {sigla_infratel: sigla_do_app}
    overrides = (HUBS.get("SITES") or {}) if isinstance(HUBS, dict) else {}
    apelido = overrides.get(site) or overrides.get(alvo)
    if apelido:
        return dados["registros"].get((_norm_txt(apelido), _norm_txt(tag)))
    return None

def _circuitos_por_numero(rec: dict) -> dict[int, dict]:
    """circuitos[] do export indexados pelo numero do circuito (n)."""
    saida: dict[int, dict] = {}
    for c in rec.get("circuitos") or []:
        try:
            saida[int(c.get("n"))] = c
        except (TypeError, ValueError):
            continue
    return saida

def _linhas_medicao_qdcc(page: Page) -> list[tuple[int, int]]:
    """Lista (linha, numero_do_circuito) da tabela 'Med. A' do formulario.

    A tabela pode ter VARIOS blocos (o site agrupa QDCC e QDF do mesmo hub);
    o numero do circuito reinicia em cada bloco. Por isso devolvemos todos os
    pares e quem decide o bloco e o codigo do preenchimento.
    """
    linhas: list[tuple[int, int]] = []
    i = 1
    while True:
        loc = page.locator(f"#txt_circuito_medicao_qdcc_{i}")
        if loc.count() == 0:
            break
        try:
            val = loc.first.input_value().strip()
        except Exception:
            break
        if not val:
            i += 1
            continue
        try:
            linhas.append((i, int(float(val.replace(",", ".")))))
        except ValueError:
            pass
        i += 1
    return linhas

def fill_qdcc(page: Page) -> str:
    """Preenche a secao 'Valores Medidos' e 'Med. A' do QDCC/QDF.

    Usa os valores REAIS do export do app "Preventivas Eletricas" (pasta de
    dados) quando o registro casa com o site+tag do formulario; caso contrario
    cai nos valores de REFERENCIA (VCC 54.1 / corrente 0 / temperatura 20).

    Regras de seguranca (valem para os dois caminhos):
      - campo com 'readonly' e ignorado;
      - campo que JA possui valor e ignorado (nunca sobrescreve);
      - apenas campos VAZIOS e editaveis recebem valor.

    Devolve um resumo curto (aparece no painel do bot).
    """
    print("[qdcc] Preenchendo Valores Medidos...")
    site = _site_da_url(page)
    tag = ""
    try:
        loc_tag = page.locator("#txt_tag_qdcc").first
        if loc_tag.count() > 0:
            tag = (loc_tag.input_value() or "").strip()
    except Exception:
        pass

    dados = _carregar_dados()
    registro = _dados_do_site(site, tag) if tag else None
    if registro:
        print(f"  [dados] export: {dados['arquivo'].name if dados['arquivo'] else '-'}")
        print(f"  [dados] site={site} tag='{tag}' -> registro encontrado "
              f"(ticket {registro.get('ticket')}, {len(registro.get('circuitos') or [])} circuitos)")
    else:
        if dados["erro"]:
            print(f"  [aviso] Falha ao ler o export de dados: {dados['erro']}")
        elif not dados["arquivo"]:
            print("  [aviso] Nenhum export de QDF/QDCC encontrado "
                  f"(pasta '{DADOS_DIR_NOMES[0]}') — usando valores de referencia.")
        else:
            print(f"  [aviso] Sem registro para site={site} tag='{tag}' no export "
                  f"({dados['arquivo'].name}) — usando valores de referencia.")

    # --- ticket: o do site (o export tem o ticket historico da medicao) -------
    # #txt_ticket_qdcc e type=number: so aceita ticket NUMERICO.
    ticket = os.getenv("INFRATEL_TICKET", "").strip()
    if ticket and _num(ticket) is None:
        print(f"  [aviso] Ticket '{ticket}' nao e numerico e #txt_ticket_qdcc e campo "
              f"numerico — nao preenchido (use so digitos).")
        ticket = ""
    if ticket:
        try:
            loc = page.locator("#txt_ticket_qdcc").first
            if loc.count() > 0 and not loc.get_attribute("readonly") and not loc.input_value().strip():
                loc.fill(ticket)
                print(f"  [ok] #txt_ticket_qdcc -> {ticket}")
        except Exception as e:
            print(f"  [erro] #txt_ticket_qdcc: {e}")

    # --- valores medidos (reais do export, senao referencia) ------------------
    if registro:
        mc = registro.get("medicaoCorrente") or {}
        vcc = _num(registro.get("tensaoAC"))
        temp = _num(registro.get("temperatura"))
        via_a = _num(mc.get("viaA"))
        via_b = _num(mc.get("viaB"))
        geral = _num(mc.get("geral"))
        dados_campos = {
            "#txt_tensao_vcc_a_qdcc": f"{vcc:.1f}" if vcc is not None else None,
            "#txt_tensao_vcc_b_qdcc": f"{vcc:.1f}" if vcc is not None else None,
            "#txt_corrente_a_qdcc": f"{via_a:.1f}" if via_a is not None else "0",
            "#txt_corrente_b_qdcc": f"{via_b:.1f}" if via_b is not None else "0",
            "#txt_temp_plus_a_qdcc": f"{temp:g}" if temp is not None else None,
            "#txt_temp_plus_minus_a_qdcc": f"{temp:g}" if temp is not None else None,
            "#txt_temp_plus_b_qdcc": f"{temp:g}" if temp is not None else None,
            "#txt_temp_plus_minus_b_qdcc": f"{temp:g}" if temp is not None else None,
        }
    else:
        dados_campos = {
            "#txt_tensao_vcc_a_qdcc": "54.1", "#txt_corrente_a_qdcc": "0",
            "#txt_temp_plus_a_qdcc": "20", "#txt_temp_plus_minus_a_qdcc": "20",
            "#txt_tensao_vcc_b_qdcc": "54.1", "#txt_corrente_b_qdcc": "0",
            "#txt_temp_plus_b_qdcc": "20", "#txt_temp_plus_minus_b_qdcc": "20",
        }

    for sel, val in dados_campos.items():
        if val is None:
            continue
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                continue
            if loc.get_attribute("readonly") is not None:
                continue
            if loc.input_value().strip():
                continue
            loc.fill(val)
            print(f"  [ok] {sel} -> {val}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

    # --- observacao do export (vai para o comentario) ------------------------
    if registro:
        obs = (registro.get("observacao") or "").replace("\t", " ").strip()
        obs = re.sub(r"\s*\n\s*", " | ", obs)
        if obs:
            try:
                loc = page.locator("#txt_comentario_qdcc").first
                if loc.count() > 0 and not loc.get_attribute("readonly") and not loc.input_value().strip():
                    loc.fill(obs)
                    print(f"  [ok] #txt_comentario_qdcc -> {obs[:60]}")
            except Exception as e:
                print(f"  [erro] #txt_comentario_qdcc: {e}")

    # --- Med. A (corrente por circuito) --------------------------------------
    print("[qdcc] Preenchendo Med. A (Circuitos)...")
    linhas = _linhas_medicao_qdcc(page)
    if not registro:
        # Sem dados: preenche 0 em TODAS as linhas existentes (sem limite fixo).
        for linha, _circ in linhas:
            try:
                loc = page.locator(f"#txt_r_medicao_qdcc_{linha}").first
                if loc.count() > 0 and not loc.get_attribute("readonly") and not loc.input_value().strip():
                    loc.fill("0")
            except Exception:
                pass
        print(f"  [med] {len(linhas)} linha(s) preenchidas com 0 (valores de referencia).")
        resumo = (f"QDCC: {len(linhas)} linha(s) com valor de REFERENCIA "
                  f"(sem registro do export para site {site} / tag '{tag}')")
    else:
        circuitos = _circuitos_por_numero(registro)
        n_esp = len(circuitos)
        # Escolhe o bloco: sequencia contigua de circuitos 1..N (o numero do
        # circuito reinicia a cada bloco do formulario).
        escolhidas: list[tuple[int, int]] = []
        for ini in range(len(linhas)):
            bloco = linhas[ini:ini + n_esp]
            if len(bloco) < n_esp:
                break
            if [c for _l, c in bloco] == list(range(1, n_esp + 1)):
                escolhidas = bloco
                break
        if not escolhidas:
            print(f"  [aviso] Nao encontrei um bloco de {n_esp} circuitos consecutivos "
                  f"na tabela (linhas: {len(linhas)}) — Med. A mantida como esta.")
            resumo = (f"QDCC: registro do export nao casou com a tabela "
                      f"({len(linhas)} linhas x {n_esp} circuitos) — Med. A mantida")
        else:
            # AVISO: tabela com mais linhas que o registro (ex.: export antigo
            # x preventiva nova) — o preenchimento fica PARCIAL.
            if len(linhas) > n_esp:
                print(f"  [aviso] A tabela tem {len(linhas)} linhas e o registro tem "
                      f"{n_esp} circuitos: as {len(linhas) - n_esp} linha(s) fora do bloco "
                      f"ficaram VAZIAS. Se a preventiva e nova, exporte os dados de hoje "
                      f"no app antes de usar.")
            # viaA ou viaB? o export diz qual via foi medida.
            via_sel = (registro.get("viaSelecionada") or "").strip().upper()
            usar_b = via_sel == "B"
            if via_sel in ("A", "B"):
                print(f"  [med] via selecionada = {via_sel} (Med. A recebe via{via_sel})")
            else:
                print(f"  [med] via selecionada = '{via_sel or 'ambas'}' (Med. A recebe viaA)")

            preenchidos = 0
            # 1) Preenche o bloco casado (circuitos 1..N do registro)
            for linha, circ in escolhidas:
                c = circuitos.get(circ)
                if not c:
                    continue
                val = _num(c.get("viaB" if usar_b else "viaA"))
                if val is None:
                    val = 0.0
                try:
                    loc = page.locator(f"#txt_r_medicao_qdcc_{linha}").first
                    if loc.count() == 0 or loc.get_attribute("readonly") is not None:
                        continue
                    if loc.input_value().strip():
                        continue
                    loc.fill(f"{val:g}")
                    preenchidos += 1
                except Exception:
                    pass

            # 2) Preenche com 0 as linhas FORA do bloco casado (ex.: tabela tem 144 linhas, export tem 60)
            for linha, _circ in linhas:
                if any(l == linha for l, _c in escolhidas):
                    continue  # já processado no bloco casado
                try:
                    loc = page.locator(f"#txt_r_medicao_qdcc_{linha}").first
                    if loc.count() == 0 or loc.get_attribute("readonly") is not None:
                        continue
                    if loc.input_value().strip():
                        continue
                    loc.fill("0")
                except Exception:
                    pass

            print(f"  [med] {preenchidos}/{n_esp} circuitos do export preenchidos; "
                  f"{len(linhas) - preenchidos} linha(s) completadas com 0.")
            resumo = (f"QDCC: {preenchidos}/{n_esp} circuitos do export "
                      f"(site {site}, tag '{tag}')")
            if len(linhas) > n_esp:
                resumo += f" — {len(linhas) - preenchidos} linha(s) completadas com 0"

    # Chama o fill_ok para as situacoes
    fill_ok(page)
    return resumo

# ---------------------------------------------------------------------------
# Mapeamento da aba QDCA (PDT). Todos os quadros QDCA sao iguais entre hubs
# (confirmado em OCOJMA, SPOVMN e JAIDTC), entao o _padrao do hubs.json
# (secao QDCA) vale para qualquer site. Se algum hub exigir valores
# diferentes, cadastre a sigla no hubs.json que ele sobrepoe o padrao
# (ex.: "NOVOHUB": {"fn": [130, 135], "ff": [220, 225]}).
# Fallback abaixo e usado apenas se o hubs.json nao existir.
# ---------------------------------------------------------------------------
QDCA_PADRAO_FALLBACK = {
    # (min, max) em V — sorteados a cada preenchimento
    "fn": (128.2, 132.0),       # Tensao VCA RN/SN/TN (1 casa)
    "ff": (219.0, 224.3),       # Tensao VCA RS/ST/TR (1 casa)
}

def _cfg_qdca(site: str) -> dict:
    """Config QDCA do site: hubs.json (QDCA._padrao + QDCA[site]) ou fallback."""
    cfg = _hub_cfg("QDCA", site)
    if not cfg:
        print("  [aviso] hubs.json sem secao QDCA — usando padrao interno.")
        cfg = dict(QDCA_PADRAO_FALLBACK)
    return cfg

def _gerar_qdca_medidos(site: str) -> dict[str, str]:
    """Monta o mapa seletor->valor da aba QDCA (vale para qualquer hub).

    Tensoes VCA sorteadas dentro das faixas do hubs.json (padrao + override
    do hub); corrente, temperatura, fase e balanceamento fixos em
    0 (medicoes reais de PDT desenergizado ou sem carga — regra do tecnico).
    """
    cfg = _cfg_qdca(site)
    fn = _vsorteadas_grupo(cfg["fn"], 3, 1)
    ff = _vsorteadas_grupo(cfg["ff"], 3, 1)
    return {
        "#num_tensao_rn_qdca": fn[0],
        "#num_tensao_sn_qdca": fn[1],
        "#num_tensao_tn_qdca": fn[2],
        "#txt_tensao_rs_qdca": ff[0],
        "#txt_tensao_st_qdca": ff[1],
        "#txt_tensao_tr_qdca": ff[2],
        "#txt_corrente_r_qdca": "0", "#txt_corrente_s_qdca": "0", "#txt_corrente_t_qdca": "0",
        "#txt_temperatura_r_qdca": "0", "#txt_temperatura_s_qdca": "0", "#txt_temperatura_t_qdca": "0",
        "#txt_fase_r_qdca": "0", "#txt_fase_s_qdca": "0", "#txt_fase_t_qdca": "0",
        "#txt_balanceamento_qdca": "0.00",
    }

# Selects de seletividade da QDCA: L(Ir)-PSC, S(Is)-PCR, I(Ii)-PCI, T1, T2
# sempre 'NAO SE APLICA' (regra do tecnico para PDT sem curvas aplicaveis).
QDCA_SELETIVIDADE = (
    "#txt_seletividade_i1_qdca",
    "#txt_seletividade_i2_qdca",
    "#txt_seletividade_i3_qdca",
    "#txt_seletividade_t1_qdca",
    "#txt_seletividade_t2_qdca",
)

def _preencher_seletividade_qdca(page: Page) -> None:
    """Seleciona 'NAO SE APLICA' nos 5 selects de seletividade da QDCA.

    O valor exato da option pode variar ('NÃO SE APLICA', 'NAO SE APLICA',
    ou um codigo); o Playwright aceita select_option(label=...) que casa pelo
    TEXTO visivel. Se o label nao for encontrado, tenta por value e registra
    falha — nada e silencioso.
    """
    print("[qdca] Seletividade (L/S/I/T1/T2) -> NAO SE APLICA...")
    for sel in QDCA_SELETIVIDADE:
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                print(f"  [miss] {sel} nao encontrado")
                continue
            atual = loc.input_value().strip()
            if atual and "APLICA" in atual.upper():
                print(f"  [skip] {sel} ja esta: '{atual}'")
                continue
            # Tenta pelo label (texto visivel da option)
            ok = False
            for kwargs in ({"label": "NÃO SE APLICA"}, {"label": "NAO SE APLICA"},
                           {"value": "NÃO SE APLICA"}, {"value": "NAO SE APLICA"}):
                try:
                    loc.select_option(**kwargs)
                    ok = True
                    print(f"  [ok] {sel} -> NAO SE APLICA")
                    break
                except Exception:
                    continue
            if not ok:
                # Ultimo recurso: lista as options e escolhe a que contem 'APLICA'
                opts = loc.locator("option").all_text_contents()
                alvo = next((o for o in opts if "APLICA" in o.upper()), None)
                if alvo:
                    loc.select_option(label=alvo)
                    print(f"  [ok] {sel} -> {alvo!r}")
                else:
                    print(f"  [falha] {sel}: nenhuma option 'APLICA' encontrada. "
                          f"Options: {opts[:8]}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

def _preencher_disjuntores_qdca(page: Page) -> None:
    """Preenche Med. R/S/T (A) de todos os disjuntores da QDCA com 0.

    Ids confirmados (OCOJMA, SPOVMN e JAIDTC — padrao identico em todos):
        txt_r_medicao_qdca_N, txt_s_medicao_qdca_N, txt_t_medicao_qdca_N
    A quantidade de linhas varia por quadro (64, 72, ate 160+), entao a
    varredura e feita por prefixo de id no DOM (sem limite fixo).
    Preenche apenas campos VAZIOS e editaveis; fill_ok marca os radios.
    """
    print("[qdca] Disjuntores: preenchendo Med. R/S/T com 0...")
    stats = page.evaluate("""() => {
        const visivel = (el) => el.checkVisibility
            ? el.checkVisibility()
            : !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        const res = { preenchidos: 0, ja: 0, readonly: 0, disabled: 0, invisiveis: 0,
                      linhas: new Set(), exemplos: [] };
        const campos = document.querySelectorAll('input[id^="txt_r_medicao_qdca_"],'
            + 'input[id^="txt_s_medicao_qdca_"],input[id^="txt_t_medicao_qdca_"]');
        for (const el of campos) {
            res.linhas.add(el.id.replace(/^txt_[rst]_medicao_qdca_/, ''));
            if (el.readOnly || el.disabled) {
                if (el.disabled) res.disabled++; else res.readonly++;
                continue;
            }
            if (el.value.trim()) { res.ja++; continue; }
            if (!visivel(el)) { res.invisiveis++; continue; }
            el.value = '0';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            res.preenchidos++;
            if (res.exemplos.length < 6) res.exemplos.push(el.id);
        }
        res.total = campos.length;
        res.nLinhas = res.linhas.size;
        return res;
    }""")
    print(f"  [disj] {stats['nLinhas']} linhas, {stats['total']} campos R/S/T: "
          f"{stats['preenchidos']} preenchidos com 0, {stats['ja']} ja tinham valor, "
          f"{stats['readonly']} readonly, {stats['disabled']} disabled, "
          f"{stats['invisiveis']} invisiveis.")
    for eid in stats["exemplos"]:
        print(f"    [ok] #{eid} -> 0")
    if stats["total"] == 0:
        print("  [aviso] Nenhum campo Med R/S/T de disjuntor encontrado no DOM.")
        print("          Verifique se a secao 'Disjuntores de Distribuicao' esta expandida.")

def fill_qdca(page: Page) -> None:
    """Preenche a aba QDCA (PDT/QGBT): Valores Medidos, seletividade e disjuntores.

    Vale para QUALQUER hub (todos os QDCA sao iguais). Regras do tecnico:
      - Tensao VCA FN (RN/SN/TN): sorteada entre 128.2 e 132.0 V;
      - Tensao VCA FF (RS/ST/TR): sorteada entre 219.0 e 224.3 V;
      - Corrente, Temperatura Cabos, Fase e Balanceamento: 0;
      - Seletividade L(Ir)/S(Is)/I(Ii)/T1/T2: NAO SE APLICA;
      - Disjuntores: Med. R/S/T (A) = 0 em todos os circuitos;
      - Todos os radios Situacao marcados OK (fill_ok).

    Faixas de tensao vem do banco hubs.json (secao QDCA: _padrao + override
    do hub). Campos ja preenchidos ou bloqueados (readonly/disabled) sao respeitados.
    """
    site = _site_da_url(page)
    print(f"[qdca] Iniciando preenchimento da aba QDCA (site: {site or '(sem ?site=)'})...")

    # N° Ticket: obrigatorio para salvar. Vem do .env (INFRATEL_TICKET).
    ticket = os.getenv("INFRATEL_TICKET", "").strip()
    try:
        loc_ticket = page.locator("#txt_ticket_qdca").first
        if loc_ticket.count() > 0 and not loc_ticket.input_value().strip():
            if ticket:
                loc_ticket.fill(ticket)
                print(f"  [ok] #txt_ticket_qdca -> {ticket}")
            else:
                print("  [aviso] #txt_ticket_qdca VAZIO: o site vai bloquear o salvamento.")
                print("          Informe o ticket na tela de login do bot (ou defina INFRATEL_TICKET no .env).")
    except Exception as e:
        print(f"  [erro] #txt_ticket_qdca: {e}")

    dados = _gerar_qdca_medidos(site)
    faixas = _cfg_qdca(site)
    origem = f"hub {site}" if site and site in (HUBS.get("QDCA") or {}) else "padrao"
    print(f"[qdca] Bloco: valores medidos (faixas: {origem})")
    print(f"  [faixa] FN {float(faixas['fn'][0]):g}-{float(faixas['fn'][1]):g}V | "
          f"FF {float(faixas['ff'][0]):g}-{float(faixas['ff'][1]):g}V")
    for sel, val in dados.items():
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                print(f"  [miss] {sel} nao encontrado")
                continue
            if loc.get_attribute("readonly") is not None:
                print(f"  [readonly] {sel} (calculado/bloqueado pelo sistema)")
                continue
            atual = loc.input_value().strip()
            if atual:
                print(f"  [skip] {sel} ja possui: '{atual}'")
                continue
            loc.fill(val, force=True)
            print(f"  [ok] {sel} -> {val}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

    _preencher_seletividade_qdca(page)
    _preencher_disjuntores_qdca(page)

    # Marca as situacoes/inspecoes como OK somente na aba QDCA (aba aberta)
    fill_ok(page, somente_visiveis=True)
    print("[qdca] Concluido: valores preenchidos e situacoes marcadas como OK.")

def fill_mt(page: Page) -> None:
    """Preenche a aba MT: identificacao (se vazia), Valores Medidos e situacoes OK.

    MT e 'Concessionaria (BT)' sao o MESMO formulario — em alguns hubs os IDs
    usam sufixo _mt, em outros _bt. O bot tenta AMBOS os sufixos para cada
    campo e preenche o conjunto de IDs que existir na pagina (sem trocar uma
    aba pela outra: so o que estiver vazio na pagina atual recebe valor).

    Regras de seguranca:
      - campo com atributo 'readonly' (calculado/bloqueado pelo sistema) e ignorado;
      - campo que JA possui valor e ignorado (nunca sobrescreve);
      - apenas campos VAZIOS e editaveis recebem o valor de referencia.
    """
    print("[mt] Iniciando preenchimento da aba MT...")

    def _variantes(sel: str) -> list[tuple[str, "object"]]:
        """Lista (seletor_usado, locator) que existem: o proprio _mt e o _bt."""
        saida = []
        loc = page.locator(sel).first
        if loc.count() > 0:
            saida.append((sel, loc))
        if sel.endswith("_mt"):
            alt_sel = sel[:-3] + "_bt"
            alt = page.locator(alt_sel).first
            if alt.count() > 0:
                saida.append((alt_sel, alt))
        return saida

    # Tensoes do bloco "Tensao (VCA)" conforme a tensao do SISTEMA (220V/380V),
    # lida da propria pagina: em sistema 380V, 127/220 e invalido e o site zera
    # o campo. Os valores abaixo substituem os de referencia do MT_MEDIDOS.
    vca = _vca_mt_valores(page)
    medidos = dict(MT_MEDIDOS)
    for fase, val in vca.items():
        medidos[f"#txt_tensao_{fase}_mt"] = val

    for bloco, campos in (("identificacao", MT_IDENTIFICACAO), ("valores medidos", medidos)):
        print(f"[mt] Bloco: {bloco}")
        for sel, val in campos.items():
            try:
                pares = _variantes(sel)
                if not pares:
                    print(f"  [miss] {sel} (nem _mt nem _bt) nao encontrado")
                    continue
                for usado, loc in pares:
                    if loc.get_attribute("readonly") is not None:
                        print(f"  [readonly] {usado} (calculado/bloqueado pelo sistema)")
                        continue
                    atual = loc.input_value().strip()
                    if atual:
                        print(f"  [skip] {usado} ja possui: '{atual}'")
                        continue
                    loc.fill(val)
                    print(f"  [ok] {usado} -> {val}")
            except Exception as e:
                print(f"  [erro] {sel}: {e}")

    print("[mt] Bloco: selects")
    for sel, val in MT_SELECTS.items():
        try:
            pares = _variantes(sel)
            if not pares:
                print(f"  [miss] {sel} (nem _mt nem _bt) nao encontrado")
                continue
            for usado, loc in pares:
                atual = loc.input_value().strip()
                if atual:
                    print(f"  [skip] {usado} ja possui: '{atual}'")
                    continue
                loc.select_option(val)
                print(f"  [ok] {usado} -> {val}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

    # Fallback do bloco "Tensao (VCA)": se os IDs das tensoes nao existem
    # neste hub (nem _mt nem _bt), localiza o bloco pelo rotulo visivel e
    # preenche os 6 campos (RN, SN, TN, RS, ST, TR) com os mesmos valores de
    # referencia — apenas os vazios.
    try:
        page.evaluate("() => document.querySelectorAll('[data-bot-mt]').forEach(e => e.removeAttribute('data-bot-mt'))")
        diag = page.evaluate(_JS_MT_VCA_POR_ROTULO)
        for d in diag:
            print(f"  [rotulo-mt] {d}")
        valores_vca = [vca[f] for f in ("rn", "sn", "tn", "rs", "st", "tr")]
        for i, val in enumerate(valores_vca):
            loc = page.locator(f'[data-bot-mt="{i}"]').first
            if loc.count() == 0:
                continue
            try:
                if loc.get_attribute("readonly") is not None:
                    print(f"  [readonly] tensao VCA #{i} (bloqueado pelo sistema)")
                    continue
                if loc.input_value().strip():
                    continue
                loc.fill(val)
                print(f"  [ok-rotulo-mt] tensao VCA #{i} -> {val}")
            except Exception as e:
                print(f"  [erro-rotulo-mt] tensao VCA #{i}: {e}")
        page.evaluate("() => document.querySelectorAll('[data-bot-mt]').forEach(e => e.removeAttribute('data-bot-mt'))")
    except Exception as e:
        print(f"  [erro] fallback MT por rotulo: {e}")

    # Marca as situacoes/inspecoes como OK somente na aba MT (aba aberta)
    fill_ok(page, somente_visiveis=True)
    print("[mt] Concluido: valores preenchidos e situacoes marcadas como OK.")

def fill_fcc(page: Page) -> None:
    """Preenche a aba FCC: Valores Medidos e situacoes OK.

    Regras de seguranca:
      - campo com atributo 'readonly' e ignorado;
      - campo que JA possui valor e ignorado;
      - apenas campos VAZIOS e editaveis recebem o valor de referencia.
    """
    print("[fcc] Iniciando preenchimento da aba FCC...")

    # N° Ticket: obrigatorio para salvar. Vem do .env (INFRATEL_TICKET).
    ticket = os.getenv("INFRATEL_TICKET", "").strip()
    try:
        loc_ticket = page.locator("#txt_ticket_fcc").first
        if loc_ticket.count() > 0 and not loc_ticket.input_value().strip():
            if ticket:
                loc_ticket.fill(ticket)
                print(f"  [ok] #txt_ticket_fcc -> {ticket}")
            else:
                print("  [aviso] #txt_ticket_fcc VAZIO: o site vai bloquear o salvamento.")
                print("          Informe o ticket na tela de login do bot (ou defina INFRATEL_TICKET no .env).")
    except Exception as e:
        print(f"  [erro] #txt_ticket_fcc: {e}")

    print("[fcc] Bloco: valores medidos")
    site = _site_da_url(page)
    cfg_fcc = _cfg_fcc(site)
    print(f"  [faixa] FCC site={site}: FN {cfg_fcc['fn'][0]}-{cfg_fcc['fn'][1]}V | "
          f"FF {cfg_fcc['ff'][0]}-{cfg_fcc['ff'][1]}V")
    for sel, val in _gerar_fcc_medidos(site).items():
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                if sel in FCC_TENSAO_FN_OPTS:
                    continue  # formulario sem campos FN — normal, nao e erro
                print(f"  [miss] {sel} nao encontrado")
                continue
            if loc.get_attribute("readonly") is not None:
                print(f"  [readonly] {sel} (calculado/bloqueado pelo sistema)")
                continue
            atual = loc.input_value().strip()
            if atual:
                print(f"  [skip] {sel} ja possui: '{atual}'")
                continue
            loc.fill(val)
            print(f"  [ok] {sel} -> {val}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

    # LVD: se ativo=SIM e tensao LVD vazia, o site bloqueia o salvamento e o
    # radio "final" fica desabilitado. O valor e uma MEDICAO e nao e inventado
    # pelo bot — apenas alerta para o tecnico preencher.
    try:
        lvd = page.evaluate("""() => {
            const ativo = document.querySelector('input[name="optradioFccLvdAtivo"]:checked');
            const t = document.getElementById('txt_tensao_lvd_fcc');
            return { ativo: ativo ? ativo.value : '', tensao: t ? t.value : '',
                     disabled: !!(t && t.disabled) };
        }""")
        if lvd["ativo"] == "SIM" and not lvd["tensao"].strip():
            print("  [aviso] LVD Ativo=SIM com 'Tensão LVD' VAZIA: o salvamento sera bloqueado.")
            print("          Preencha #txt_tensao_lvd_fcc manualmente com o valor medido no site.")
    except Exception:
        pass

    # Marca as situacoes/inspecoes como OK somente na aba FCC (aba aberta)
    fill_ok(page, somente_visiveis=True)
    print("[fcc] Concluido: valores preenchidos e situacoes marcadas como OK.")

def fill_ups(page: Page) -> None:
    """Preenche a aba UPS: ticket, Valores Medidos e situacoes OK.

    As tensoes AC sao SORTEADAS dentro das faixas do banco hubs.json
    (secao UPS: _padrao + override do hub da URL, ex.: JAIDTC 127V com FN
    109-140) — o Infratel recusa o salvamento com 'ATENCAO' quando o valor
    fica fora da faixa do site. Os demais campos fixos (temps, correntes,
    frequencia, corrente de recarga) tambem vem do cadastro do hub.

    Regras de seguranca:
      - campo com atributo 'readonly' e ignorado;
      - campo que JA possui valor e ignorado (nunca sobrescreve);
      - apenas campos VAZIOS e editaveis recebem o valor.
    """
    site = _site_da_url(page)
    print(f"[ups] Iniciando preenchimento da aba UPS (site: {site or '(sem ?site=)'})...")

    # N° Ticket: obrigatorio para salvar. Vem do .env (INFRATEL_TICKET).
    ticket = os.getenv("INFRATEL_TICKET", "").strip()
    try:
        loc_ticket = page.locator("#txt_ticket_ups").first
        if loc_ticket.count() > 0 and not loc_ticket.input_value().strip():
            if ticket:
                loc_ticket.fill(ticket)
                print(f"  [ok] #txt_ticket_ups -> {ticket}")
            else:
                print("  [aviso] #txt_ticket_ups VAZIO: o site vai bloquear o salvamento.")
                print("          Informe o ticket na tela de login do bot (ou defina INFRATEL_TICKET no .env).")
    except Exception as e:
        print(f"  [erro] #txt_ticket_ups: {e}")

    dados = _gerar_ups_medidos(site)
    faixas = _cfg_ups(site)
    origem = f"hub {site}" if site and site in (HUBS.get("UPS") or {}) else "padrao"
    print(f"[ups] Bloco: valores medidos (faixas: {origem})")
    print(f"  [faixa] Ent FN {float(faixas['ent_fn'][0]):g}-{float(faixas['ent_fn'][1]):g}V | "
          f"Ent FF {float(faixas['ent_ff'][0]):g}-{float(faixas['ent_ff'][1]):g}V | "
          f"Sai FN {float(faixas['sai_fn'][0]):g}-{float(faixas['sai_fn'][1]):g}V | "
          f"Sai FF {float(faixas['sai_ff'][0]):g}-{float(faixas['sai_ff'][1]):g}V")
    for sel, val in dados.items():
        try:
            loc = page.locator(sel).first
            if loc.count() == 0:
                print(f"  [miss] {sel} nao encontrado")
                continue
            if loc.get_attribute("readonly") is not None:
                print(f"  [readonly] {sel} (calculado/bloqueado pelo sistema)")
                continue
            atual = loc.input_value().strip()
            if atual:
                print(f"  [skip] {sel} ja possui: '{atual}'")
                continue
            loc.fill(val, force=True)
            print(f"  [ok] {sel} -> {val}")
        except Exception as e:
            print(f"  [erro] {sel}: {e}")

    # Fallback por rotulo: se os IDs das tensoes nao existirem neste hub
    # (ex.: SPOPIR), localiza as linhas pelo rotulo visivel (que no site e um
    # <input id=lbl_*> com o texto no .value), MARCA os inputs com data-bot-rot
    # e preenche via Playwright com os MESMOS valores ja sorteados — campos
    # vazios apenas; nunca sobrescreve.
    pares = [
        ["ent_fn", "Tensao Ent. AC FN", 3],
        ["ent_ff", "Tensao Ent. AC FF", 3],
        ["sai_fn", "Tensao Sai. AC FN", 3],
        ["sai_ff", "Tensao Sai. AC FF", 3],
    ]
    valores = {
        "ent_fn": [dados["#txt_tensao_rn_ent_ups"],
                   dados["#txt_tensao_sn_ent_ups"],
                   dados["#txt_tensao_tn_ent_ups"]],
        "ent_ff": [dados["#txt_tensao_rs_ent_ups"],
                   dados["#txt_tensao_st_ent_ups"],
                   dados["#txt_tensao_tr_ent_ups"]],
        "sai_fn": [dados["#txt_tensao_rn_sai_ups"],
                   dados["#txt_tensao_sn_sai_ups"],
                   dados["#txt_tensao_tn_sai_ups"]],
        "sai_ff": [dados["#txt_tensao_rs_sai_ups"],
                   dados["#txt_tensao_st_sai_ups"],
                   dados["#txt_tensao_tr_sai_ups"]],
    }
    feitos = 0
    try:
        page.evaluate("() => document.querySelectorAll('[data-bot-rot]').forEach(e => e.removeAttribute('data-bot-rot'))")
        diag = page.evaluate(_JS_UPS_TENSAO_POR_ROTULO, pares)
        for d in diag:
            print(f"  [rotulo] {d}")
        for chave, _r, n in pares:
            for i, val in enumerate(valores[chave]):
                loc = page.locator(f'[data-bot-rot="{chave}:{i}"]').first
                if loc.count() == 0:
                    continue
                try:
                    if loc.get_attribute("readonly") is not None:
                        continue
                    if loc.input_value().strip():
                        continue
                    loc.fill(val, force=True)
                    feitos += 1
                    print(f"  [ok-rotulo] {chave} fase{i} -> {val}")
                except Exception as e:
                    print(f"  [erro-rotulo] {chave} fase{i}: {e}")
        page.evaluate("() => document.querySelectorAll('[data-bot-rot]').forEach(e => e.removeAttribute('data-bot-rot'))")
        if feitos == 0:
            print("  [rotulo] nenhuma tensao extra preenchida por rotulo "
                  "(IDs ja cobriram tudo, ou rotulos nao encontrados).")
    except Exception as e:
        print(f"  [erro] fallback por rotulo: {e}")

    # Marca as situacoes/inspecoes como OK somente na aba UPS (aba aberta)
    fill_ok(page, somente_visiveis=True)
    print("[ups] Concluido: valores preenchidos e situacoes marcadas como OK.")

# Tabelas de baterias da aba FCC: (rotulo, prefixo do id, chave do perfil).
# Chaves "temp" e "zero" tem valor fixo (20 e 0) em qualquer perfil; as demais
# valem o que o perfil de tensao do banco definir (ver _perfil_bateria).
FCC_BAT_TABELAS = (
    ("flut/tensao", "txt_tensao_equal_fcc_", "flut_t"),
    ("flut/temp", "txt_temperatura_equal_fcc_", "temp"),
    ("desc/tensao", "txt_tensao_descarga_fcc_", "desc_t"),
    ("desc/temp", "txt_temperatura_descarga_fcc_", "temp"),
    ("cond/valor", "txt_elemento_condutancia_fcc_", "zero"),
    ("cond/resis", "txt_resistencia_condutancia_fcc_", "resis"),
    ("cond/dens", "txt_densidade_condutancia_fcc_", "dens"),
)

# Hubs (siglas lidas do parametro ?site= da URL, ex.: .../consultar?site=SCNPER)
# que seguem regras especiais de preenchimento da FCC:
#   1) densidade FIXA em 1220 SOMENTE nos bancos de 2V (bancos 12V ficam com 0).
#      O site so aceita 'Situacao Final = OK' na Condutancia com densidade
#      <= 1220 (valores 1221/1222 sao recusados com o clique revertido) — por
#      isso nao ha sorteio 1220-1222;
#   2) ANTES de preencher, a 'Situacao Final' por elemento (Equal/Descarga/
#      Condutancia) e marcada como NOK, senao o site bloqueia o preenchimento
#      com alertas de 'ATENCAO' (condutancia/resistencia pendente); ao final o
#      fill_ok devolve tudo a OK com os campos ja preenchidos.
SITES_COM_REGRAS_FCC = {"SPOVMN", "SBOJPS", "SCNPER"}

def _site_da_url(page: Page) -> str:
    """Extrai a sigla do site da URL (parametro ?site=...), em maiusculas.

    Ex.: https://infratel.claro.com.br/.../consultar?site=SCNPER -> 'SCNPER'.
    Retorna '' quando a URL nao tem o parametro.
    """
    m = re.search(r"[?&]site=([^&#]+)", page.url or "")
    return unquote(m.group(1)).strip().upper() if m else ""

def _situacao_final_nok(page: Page, bancos: list[dict]) -> None:
    """Marca a 'Situacao Final' de cada elemento como NOK (radio value=NOK).

    Familias de radio por elemento (nome `optradioMedicao{Equal|Descarga|
    Condutancia}FccF<n>[banco][elem]`, value OK=`_0` / NOK=`_1`): só nos bancos
    e elementos informados (mesma topologia do preenchimento). Pré-requisito dos
    hubs SITES_COM_REGRAS_FCC: com situacao vazia/OK o site recusa o
    preenchimento com 'ATENCAO'; com NOK o fluxo segue e o fill_ok final
    devolve tudo a OK.
    """
    alvos = {f"{info['banco']}:{e}" for info in bancos for e in range(info.get("limite", 0))}
    if not alvos:
        return
    stats = page.evaluate("""(alvosArr) => {
        const alvos = new Set(alvosArr);
        const res = { marcados: 0, ja: 0, falhas: [] };
        document.querySelectorAll('input[type="radio"]').forEach(r => {
            // O name do radio pode ter sufixo _0/_1 (ex.: optradioMedicaoEqualFccF1[1][0]_0)
            // Regex aceita sufixo opcional _0 ou _1 no final
            const m = (r.name || '').match(
                /^optradioMedicao(?:Equal|Descarga|Condutancia)FccF\\d+\\[(\\d+)\\]\\[(\\d+)\\]_?[01]?$/);
            if (!m) return;
            if (!alvos.has(m[1] + ':' + m[2])) return;
            if ((r.value || '').toUpperCase() !== 'NOK') return;
            if (r.checked) { res.ja++; return; }
            r.click();
            if (r.checked) res.marcados++;
            else res.falhas.push(r.id || r.name);
        });
        return res;
    }""", sorted(alvos))
    print(f"  [sit-final] Situacao final -> NO (pre-requisito do hub): "
          f"{stats['marcados']} marcados, {stats['ja']} ja NOK, {len(stats['falhas'])} falhas.")
    for fid in stats["falhas"][:10]:
        print(f"    [falha] {fid}")

    # Clica o radio LVD Final (optradioFccLvd_final) para NOK, se existir
    try:
        lvd_final = page.locator('input[name="optradioFccLvd_final"][value="1"]').first
        if lvd_final.count() > 0 and not lvd_final.is_checked():
            lvd_final.check()
            print(f"  [lvd-final] Marcado NOK no radio optradioFccLvd_final")
    except Exception as e:
        print(f"  [aviso] Falha ao marcar LVD Final: {e}")

def _perfil_bateria(tensao_cadastrada: str) -> dict:
    """Define os valores de preenchimento conforme a Tensao (VDC) do banco, lida da tela.

    Regras do tecnico (Infratel):
      12V: flutuacao 13.5-13.7 | descarga 12.2-12.8 | resistencia 4.0-7.8 (aleatorios,
           SEMPRE com 1 casa decimal — ex.: 6.1)
      2V : flutuacao 2.20      | descarga 2.00      | resistencia 1.39-1.98 (aleatorio,
           SEMPRE com 2 casas decimais — ex.: 6.43)
      Temperatura 20, condutancia 0 e densidade 0 em todos os perfis.
    As casas decimais sao FIXAS por perfil (f-format, nao round): 6.10 vira '6.1'
    no 12V e 2.0 vira '2.00' no 2V, sem depender do valor sorteado.
    Medicao nao e inventada: se a tensao do banco nao for reconhecida, as colunas
    de tensao/resistencia ficam sem valor (None) e o bot apenas alerta.

    O campo Tensao (VDC) pode vir formatado de varios jeitos ('2V', '12V',
    '2 V', '2,5 V'): o matching usa o numero imediatamente seguido de 'V'
    (a classificacao nominal da bateria), com recuo para o primeiro numero
    quando 'V' nao consta no texto.
    """
    t = (tensao_cadastrada or "").strip().upper().replace(",", ".")
    m = re.search(r"(\d+(?:\.\d+)?)\s*V", t) or re.search(r"(\d+)", t)
    rating = m.group(1) if m else None
    if rating == "12":
        return {"nome": "12V",
                "flut_t": lambda: f"{random.uniform(13.5, 13.7):.1f}",
                "desc_t": lambda: f"{random.uniform(12.2, 12.8):.1f}",
                "resis": lambda: f"{random.uniform(4.0, 7.8):.1f}"}
    if rating == "2":
        return {"nome": "2V",
                "flut_t": lambda: "2.20",
                "desc_t": lambda: "2.00",
                "resis": lambda: f"{random.uniform(1.39, 1.98):.2f}"}
    return {"nome": f"?({tensao_cadastrada or 'vazio'})", "flut_t": None, "desc_t": None, "resis": None}

def _detectar_bancos_bateria(page: Page) -> list[dict]:
    """Le a topologia real: bancos cadastrados, quantidade e tensao (VDC) de cada um.

    Estrategia: os bancos sao derivados da UNIAO entre os metadados
    (#txt_banco_bateria_fcc_N) e as linhas efetivamente renderizadas no DOM
    (#txt_tensao_equal_fcc_N_*), assim nenhum banco escapa, qualquer que seja
    a numeracao. A quantidade vem do cadastro (#txt_banco_bateria_fcc_N) e a
    tensao de #txt_tensao_bateria_fcc_N. Em divergencia entre cadastro e DOM,
    prevalece o cadastro, limitado ao que existe no DOM.
    """
    return page.evaluate("""() => {
        const nums = new Set();
        for (let b = 1; b <= 64; b++) {
            if (document.getElementById(`txt_banco_bateria_fcc_${b}`)) nums.add(b);
        }
        document.querySelectorAll('input[id^="txt_tensao_equal_fcc_"]').forEach((el) => {
            const m = el.id.match(/^txt_tensao_equal_fcc_(\\d+)_(\\d+)$/);
            if (m) nums.add(parseInt(m[1], 10));
        });
        const bancos = [];
        for (const b of [...nums].sort((x, y) => x - y)) {
            const meta = document.getElementById(`txt_banco_bateria_fcc_${b}`);
            const tens = document.getElementById(`txt_tensao_bateria_fcc_${b}`);
            let dom = 0;
            while (document.getElementById(`txt_tensao_equal_fcc_${b}_${dom}`)) dom++;
            let qtde = dom;
            if (meta) {
                const cadastrada = parseInt(meta.value, 10);
                if (!isNaN(cadastrada) && cadastrada > 0) qtde = cadastrada;
            }
            bancos.push({
                banco: b,
                qtde: qtde,
                dom: dom,
                tensao: tens ? (tens.value || '') : ''
            });
        }
        return bancos;
    }""")

def _preencher_campo_bat(page: Page, prefixo: str, banco: int, elem: int,
                         valor_fn, stats: dict, indice_zero_based: bool = False) -> None:
    """Preenche UM campo de bateria e classifica o resultado. Nenhuma falha e silenciosa.

    valor_fn None significa 'sem perfil para esta coluna' (tensao do banco nao
    reconhecida): o campo fica em aberto e e contabilizado em 'sem_perfil'.
    """
    if valor_fn is None:
        stats["sem_perfil"] += 1
        if len(stats["ex_sem_perfil"]) < 8:
            stats["ex_sem_perfil"].append(f"#{prefixo}{banco}_{elem}")
        return

    # A deteccao da tabela informa se os IDs hierarquicos usam indice 0-based.
    elem_1based = elem + 1
    if indice_zero_based:
        candidatos = [
            f"#{prefixo}{banco}_{elem}",
            f"#{prefixo}{banco}_{elem_1based}",
            f"#{prefixo}{elem_1based}",
        ]
    else:
        candidatos = [
            f"#{prefixo}{elem_1based}",
            f"#{prefixo}{banco}_{elem_1based}",
            f"#{prefixo}{banco}_{elem}",
        ]
    loc = None
    for sel in candidatos:
        loc = page.locator(sel).first
        if loc.count() > 0:
            break

    if loc is None or loc.count() == 0:
        stats["ausente"] += 1
        return
    try:
        if loc.get_attribute("readonly", timeout=1_000) is not None:
            stats["readonly"] += 1
            stats["ex_readonly"].append(sel)
            return
        if loc.get_attribute("disabled", timeout=1_000) is not None:
            stats["disabled"] += 1
            stats["ex_disabled"].append(sel)
            return
        if loc.input_value(timeout=1_000).strip():
            stats["ja_preenchido"] += 1
            return
        # force=True: ignora checagens de visibilidade (scroll do modal nao atrapalha)
        loc.fill(valor_fn(), force=True, timeout=1_000)
        stats["preenchido"] += 1
    except Exception as e:
        stats["erro"] += 1
        if len(stats["ex_erro"]) < 10:
            stats["ex_erro"].append(f"{sel}: {e}")

def carregar_medicoes(page: Page) -> int:
    """Clica nos botoes 'Carregar medicoes' do Infratel antes de preencher (idempotente).

    O site exige que cada secao de medicao seja carregada pelo botao 'Carregar
    medicoes' antes de renderizar as tabelas de baterias; sem esses cliques os
    bancos nao existem no DOM e fill_fcc_bat nao enxerga nada. Os botoes nao tem
    id/name, entao sao achados pelo TEXTO e clicados via DOM (ignora sobreposicao
    de elementos, comum no Infratel). Repete a varredura ate nao sobrar botao
    visivel, mas NAO clica duas vezes na mesma aparência (botao que permanece
    apos o clique nao e reacionado). Retorna quantos cliques foram efetuados.
    """
    total = 0
    vistas: set[str] = set()
    for rodada in range(1, 5):
        clicados = page.evaluate("""(jaVistas) => {
            const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim().toLowerCase();
            const visivel = (el) => el.checkVisibility
                ? el.checkVisibility()
                : !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
            const alvos = [...document.querySelectorAll(
                'button, a, input[type="button"], input[type="submit"]')]
                .map((el, i) => ({ el, i }))
                .filter(({ el }) => {
                    const texto = norm(el.innerText || el.value || '');
                    return texto.includes('carregar medi') && !el.disabled && visivel(el);
                });
            const novos = alvos.filter(({ el, i }) => !jaVistas.includes(
                i + ':' + el.tagName.toLowerCase()
                + (el.id ? '#' + el.id : '')
                + (typeof el.className === 'string' && el.className.trim()
                   ? '.' + el.className.trim().split(/\\s+/)[0] : '')));
            novos.forEach(({ el }) => el.click());
            return novos.map(({ el, i }) => i + ':' + el.tagName.toLowerCase()
                + (el.id ? '#' + el.id : '')
                + (typeof el.className === 'string' && el.className.trim()
                   ? '.' + el.className.trim().split(/\\s+/)[0] : ''));
        }""", list(vistas))
        if not clicados:
            break
        vistas.update(clicados)
        total += len(clicados)
        print(f"  [carregar] rodada {rodada}: {len(clicados)} botao(oes) 'Carregar medicoes' -> "
              f"{', '.join(clicados)}")
        page.wait_for_timeout(1500)
    if total:
        print(f"  [carregar] total de {total} clique(s) em 'Carregar medicoes'.")
    else:
        print("  [carregar] nenhum botao 'Carregar medicoes' visivel (tabelas ja carregadas?).")
    return total

def fill_fcc_bat(page: Page) -> None:
    """Preenche as tabelas de Baterias da aba FCC orientado pela topologia cadastrada.

    Para cada banco detectado, le a quantidade de baterias (#txt_banco_bateria_fcc_N)
    e a Tensao VDC (#txt_tensao_bateria_fcc_N) para escolher o perfil de valores
    (12V ou 2V — ver _perfil_bateria), e preenche exatamente essa quantidade de
    elementos em cada uma das 7 colunas (tensao/temperatura de flutuacao e descarga,
    condutancia, resistencia, densidade. Nos hubs SPOVMN/SBOJPS/SCNPER (sigla do
    parametro ?site= da URL) a densidade e FIXA em 1220 SOMENTE em bancos de 2V
    (bancos 12V ficam com 0; o site so aceita OK da condutancia com densidade
    <= 1220) e a 'Situacao Final' de cada elemento e marcada como NOK antes do
    preenchimento (o site bloqueia com 'ATENCAO' caso contrario); o fill_ok do
    final devolve tudo a OK. Nos demais hubs, densidade 0 e situacao final
    intocada.
    Campos ja preenchidos ou bloqueados (readonly/disabled) sao respeitados e
    relatados — nenhuma falha passa em silencio.
    """
    print("[fcc-bat] Iniciando preenchimento das baterias (modo topologia)...")
    site = _site_da_url(page)
    regras_hub = site in SITES_COM_REGRAS_FCC
    if regras_hub:
        print(f"  [info] Hub '{site}' detectado na URL: densidade fixa em 1220 apenas em "
              "bancos 2V; situacao final marcada como NO antes do preenchimento.")
    else:
        print(f"  [info] Site '{site or '(sem ?site= na URL)'}': sem regras de hub "
              "(densidade 0, situacao final intocada).")
    carregar_medicoes(page)
    bancos = _detectar_bancos_bateria(page)
    if not bancos:
        print("  [aviso] Nenhum banco de bateria detectado (#txt_banco_bateria_fcc_* ausente).")
        return

    # O Infratel pode recriar a primeira célula de tensao apos carregar as
    # secoes da FCC. Aguarda o elemento voltar ao DOM antes do primeiro fill.
    for info in bancos:
        if info["dom"] <= 0:
            continue
        sel = f"#txt_tensao_equal_fcc_{info['banco']}_0"
        try:
            page.locator(sel).wait_for(state="attached", timeout=5_000)
        except PlaywrightTimeoutError as e:
            print(f"  [aviso] {sel} nao ficou disponivel apos atualizar a tabela: {e}")

    for info in bancos:
        perfil = _perfil_bateria(info.get("tensao", ""))
        info["perfil"] = perfil
        if info["qtde"] != info["dom"]:
            print(f"  [aviso] Banco {info['banco']}: cadastrado={info['qtde']} bateria(s), "
                  f"renderizado={info['dom']} linha(s). Usando o menor limite.")
        limite = max(0, min(info["qtde"], info["dom"] or info["qtde"]))
        info["limite"] = limite
        print(f"  [info] Banco {info['banco']}: {info['qtde']} bateria(s) cadastrada(s) "
              f"[Tensao VDC: '{info.get('tensao', '?')}'], perfil {perfil['nome']}, "
              f"{limite} elemento(s) a processar.")
        if perfil["flut_t"] is None:
            print("  [aviso] Tensao do banco nao reconhecida: colunas de tensao/resistencia "
                  "serao IGNORADAS (o bot nao inventa medicao). Preencha manualmente.")

    if regras_hub:
        _situacao_final_nok(page, bancos)

    stats = {rot: {"preenchido": 0, "ja_preenchido": 0, "readonly": 0, "disabled": 0,
                   "ausente": 0, "erro": 0, "sem_perfil": 0,
                   "ex_readonly": [], "ex_disabled": [], "ex_erro": [], "ex_sem_perfil": []}
             for rot, _, _ in FCC_BAT_TABELAS}

    for info in bancos:
        perfil = info["perfil"]
        if regras_hub and perfil["nome"] == "2V":
            dens_fn = lambda: "1220"
        else:
            dens_fn = lambda: "0"
        for elem in range(info["limite"]):
            for rotulo, prefixo, chave in FCC_BAT_TABELAS:
                if chave == "temp":
                    fn = lambda: "20"
                elif chave == "zero":
                    fn = lambda: "0"
                elif chave == "dens":
                    fn = dens_fn
                else:
                    fn = perfil.get(chave)  # None se a tensao do banco nao for reconhecida
                # elem ja e 0-based; _preencher_campo_bat adiciona +1 internamente
                _preencher_campo_bat(
                    page, prefixo, info["banco"], elem, fn, stats[rotulo],
                    indice_zero_based=info["dom"] > 0)

    print("[fcc-bat] Resumo por coluna:")
    for rotulo, _, _ in FCC_BAT_TABELAS:
        s = stats[rotulo]
        partes = []
        if s["preenchido"]: partes.append(f"{s['preenchido']} preenchidos")
        if s["ja_preenchido"]: partes.append(f"{s['ja_preenchido']} ja tinham valor")
        if s["readonly"]: partes.append(f"{s['readonly']} READONLY")
        if s["disabled"]: partes.append(f"{s['disabled']} DISABLED")
        if s["ausente"]: partes.append(f"{s['ausente']} ausentes")
        if s["sem_perfil"]: partes.append(f"{s['sem_perfil']} SEM PERFIL (ignorados)")
        if s["erro"]: partes.append(f"{s['erro']} ERROS")
        print(f"  [{rotulo}] {', '.join(partes) if partes else 'nada a fazer'}.")
        for sel in (s["ex_disabled"] + s["ex_readonly"])[:8]:
            print(f"    [bloqueado] {sel}")
        for sel in s["ex_sem_perfil"][:5]:
            print(f"    [sem perfil] {sel}")
        for msg in s["ex_erro"][:5]:
            print(f"    [erro] {msg}")

    print("[bot] Marcando OK nas situacoes das baterias (aba aberta)...")
    fill_ok(page, somente_visiveis=True)
    print("[fcc-bat] Concluido.")

# Tabelas de baterias da aba UPS: (rotulo, trecho do id, chave do perfil).
# O Infratel pode usar sufixos '_ups' ou repetir os ids '_fcc_' dentro do
# modal da UPS — fill_ups_bat tenta os dois padroes via _detectar_bancos_ups.
UPS_BAT_TABELAS = (
    ("flut/tensao", "tensao_equal", "flut_t"),
    ("flut/temp", "temperatura_equal", "temp"),
    ("desc/tensao", "tensao_descarga", "desc_t"),
    ("desc/temp", "temperatura_descarga", "temp"),
    ("cond/valor", "elemento_condutancia", "zero"),
    ("cond/resis", "resistencia_condutancia", "resis"),
    ("cond/dens", "densidade_condutancia", "dens"),
)

def _detectar_bancos_ups(page: Page) -> list[dict]:
    """Le a topologia de baterias da aba UPS (sufixo '_ups', confirmado via scan).

    Metadados: #txt_banco_bateria_ups_N (quantidade) e #txt_tensao_bateria_ups_N
    (Tensao VDC). Linhas renderizadas: #txt_tensao_equal_ups_N_M (apenas
    VISIVEIS — as tabelas da FCC ficam ocultas na mesma pagina e nao devem
    ser confundidas com as da UPS).
    """
    return page.evaluate("""() => {
        const visivel = (el) => el.checkVisibility
            ? el.checkVisibility()
            : !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        const nums = new Set();
        for (let b = 1; b <= 64; b++) {
            if (document.getElementById(`txt_banco_bateria_ups_${b}`)) nums.add(b);
        }
        document.querySelectorAll('input[id^="txt_tensao_equal_ups_"]').forEach((el) => {
            const m = el.id.match(/^txt_tensao_equal_ups_(\\d+)_(\\d+)$/);
            if (m && visivel(el)) nums.add(parseInt(m[1], 10));
        });
        const bancos = [];
        for (const b of [...nums].sort((x, y) => x - y)) {
            const meta = document.getElementById(`txt_banco_bateria_ups_${b}`);
            const tens = document.getElementById(`txt_tensao_bateria_ups_${b}`);
            let dom = 0;
            while (document.getElementById(`txt_tensao_equal_ups_${b}_${dom}`)) dom++;
            let qtde = dom;
            if (meta) {
                const cadastrada = parseInt(meta.value, 10);
                if (!isNaN(cadastrada) && cadastrada > 0) qtde = cadastrada;
            }
            bancos.push({
                banco: b,
                sufixo: 'ups',
                qtde: qtde,
                dom: dom,
                tensao: tens ? (tens.value || '') : ''
            });
        }
        return bancos;
    }""")

def fill_ups_bat(page: Page) -> None:
    """Preenche as tabelas de Baterias da aba UPS (Flutuacao, Descarga, Condutancia).

    Mesmas regras de valores da FCC (ver _perfil_bateria):
      12V: flutuacao 13.5-13.7 | descarga 12.2-12.8 | resistencia 4.0-7.8
      2V : flutuacao 2.20      | descarga 2.00      | resistencia 1.39-1.98
      Temperatura 20, condutancia 0, densidade 0 (ou 1220 em hubs com regra).

    IDs confirmados via scan no OCOJMA (sufixo '_ups'):
      txt_banco_bateria_ups_N, txt_tensao_bateria_ups_N,
      txt_tensao_equal_ups_N_M, txt_temperatura_equal_ups_N_M,
      txt_tensao_descarga_ups_N_M, txt_temperatura_descarga_ups_N_M,
      txt_elemento_condutancia_ups_N_M, txt_resistencia_condutancia_ups_N_M,
      txt_densidade_condutancia_ups_N_M.
    Apenas linhas VISIVEIS sao consideradas (as tabelas da FCC ficam ocultas
    na mesma pagina e nao devem ser confundidas com as da UPS).
    """
    site = _site_da_url(page)
    regras_hub = site in SITES_COM_REGRAS_FCC
    print(f"[ups-bat] Iniciando preenchimento das baterias da UPS (site: {site or '(sem ?site=)'})...")
    if regras_hub:
        print(f"  [info] Hub '{site}' em SITES_COM_REGRAS_FCC: situacao final NO antes do preenchimento.")
    carregar_medicoes(page)
    bancos = _detectar_bancos_ups(page)
    if not bancos:
        print("  [aviso] Nenhuma tabela de bateria detectada na aba UPS.")
        print("          Verifique se 'Banco de Baterias' esta expandido e se as")
        print("          tabelas foram carregadas ('Carregar medicoes').")
        return

    # Monta colunas com o sufixo real de cada banco (sempre 'ups' nesta funcao)
    def _prefixo(suf: str, trecho: str) -> str:
        # ex.: trecho='tensao_equal', suf='ups' -> 'txt_tensao_equal_ups_'
        return f"txt_{trecho}_{suf}_"

    for info in bancos:
        perfil = _perfil_bateria(info.get("tensao", ""))
        info["perfil"] = perfil
        if info["qtde"] != info["dom"]:
            print(f"  [aviso] Banco {info['banco']}: cadastrado={info['qtde']} bateria(s), "
                  f"renderizado={info['dom']} linha(s). Usando o menor limite.")
        limite = max(0, min(info["qtde"], info["dom"] or info["qtde"]))
        info["limite"] = limite
        print(f"  [info] Banco {info['banco']} (sufixo '{info['sufixo']}'): {info['qtde']} "
              f"bateria(s) [Tensao VDC: '{info.get('tensao', '?')}'], perfil {perfil['nome']}, "
              f"{limite} elemento(s).")
        if perfil["flut_t"] is None:
            print("  [aviso] Tensao do banco nao reconhecida: colunas de tensao/resistencia "
                  "serao IGNORADAS (o bot nao inventa medicao).")

    if regras_hub:
        _situacao_final_nok(page, bancos)

    stats = {rot: {"preenchido": 0, "ja_preenchido": 0, "readonly": 0, "disabled": 0,
                   "ausente": 0, "erro": 0, "sem_perfil": 0,
                   "ex_readonly": [], "ex_disabled": [], "ex_erro": [], "ex_sem_perfil": []}
             for rot, _, _ in UPS_BAT_TABELAS}

    for info in bancos:
        perfil = info["perfil"]
        suf = info["sufixo"]
        if regras_hub and perfil["nome"] == "2V":
            dens_fn = lambda: "1220"
        else:
            dens_fn = lambda: "0"
        for elem in range(info["limite"]):
            for rotulo, trecho, chave in UPS_BAT_TABELAS:
                prefixo = _prefixo(suf, trecho)
                if chave == "temp":
                    fn = lambda: "20"
                elif chave == "zero":
                    fn = lambda: "0"
                elif chave == "dens":
                    fn = dens_fn
                else:
                    fn = perfil.get(chave)
                _preencher_campo_bat(
                    page, prefixo, info["banco"], elem, fn, stats[rotulo],
                    indice_zero_based=info["dom"] > 0)

    print("[ups-bat] Resumo por coluna:")
    for rotulo, _, _ in UPS_BAT_TABELAS:
        s = stats[rotulo]
        partes = []
        if s["preenchido"]: partes.append(f"{s['preenchido']} preenchidos")
        if s["ja_preenchido"]: partes.append(f"{s['ja_preenchido']} ja tinham valor")
        if s["readonly"]: partes.append(f"{s['readonly']} READONLY")
        if s["disabled"]: partes.append(f"{s['disabled']} DISABLED")
        if s["ausente"]: partes.append(f"{s['ausente']} ausentes")
        if s["sem_perfil"]: partes.append(f"{s['sem_perfil']} SEM PERFIL (ignorados)")
        if s["erro"]: partes.append(f"{s['erro']} ERROS")
        print(f"  [{rotulo}] {', '.join(partes) if partes else 'nada a fazer'}.")
        for sel in (s["ex_disabled"] + s["ex_readonly"])[:8]:
            print(f"    [bloqueado] {sel}")
        for sel in s["ex_sem_perfil"][:5]:
            print(f"    [sem perfil] {sel}")
        for msg in s["ex_erro"][:5]:
            print(f"    [erro] {msg}")

    print("[bot] Marcando OK nas situacoes das baterias da UPS (aba aberta)...")
    fill_ok(page, somente_visiveis=True)
    print("[ups-bat] Concluido.")

def diag_fcc(page: Page) -> None:
    """Diagnostico da aba FCC: matriz banco x elemento com estado de cada campo.

    Legendas por campo:  '.' = editavel, com valor   | 'V' = editavel, VAZIO
                        'D' = disabled, com valor    | 'd' = disabled, VAZIO
                        'R' = readonly, com valor    | 'r' = readonly, VAZIO
    Radio OK:            'O' = marcado                | '-' = desmarcado, editavel
                        'K' = marcado, DISABLED      | 'k' = desmarcado, DISABLED
    """
    linhas = page.evaluate("""() => {
        const out = [];
        const st = (el) => {
            if (!el) return 'x';
            if (el.disabled) return el.value ? 'D' : 'd';
            if (el.readOnly) return el.value ? 'R' : 'r';
            return el.value ? '.' : 'V';
        };
        const COLS = [
            ['flut/tensao', 'txt_tensao_equal_fcc_'],
            ['flut/temp', 'txt_temperatura_equal_fcc_'],
            ['desc/tensao', 'txt_tensao_descarga_fcc_'],
            ['desc/temp', 'txt_temperatura_descarga_fcc_'],
            ['cond/valor', 'txt_elemento_condutancia_fcc_'],
            ['cond/resis', 'txt_resistencia_condutancia_fcc_'],
            ['cond/dens', 'txt_densidade_condutancia_fcc_'],
        ];
        const RADIOS = [
            ['flut/radioOK', 'optradioMedicaoEqualFccF1'],
            ['desc/radioOK', 'optradioMedicaoDescargaFccF1'],
            ['cond/radioOK', 'optradioMedicaoCondutanciaFccF1'],
        ];
        let achou = false;
        const nums = new Set();
        for (let b = 1; b <= 64; b++) {
            if (document.getElementById(`txt_banco_bateria_fcc_${b}`)) nums.add(b);
        }
        document.querySelectorAll('input[id^="txt_tensao_equal_fcc_"]').forEach((el) => {
            const mm = el.id.match(/^txt_tensao_equal_fcc_(\\d+)_(\\d+)$/);
            if (mm) nums.add(parseInt(mm[1], 10));
        });
        for (const b of [...nums].sort((x, y) => x - y)) {
            const meta = document.getElementById(`txt_banco_bateria_fcc_${b}`);
            achou = true;
            out.push(`BANCO ${b} (Qtde cadastrada: ${meta ? (meta.value || '?') : '(sem campo)'})`);
            let n = 0;
            while (document.getElementById(`txt_tensao_equal_fcc_${b}_${n}`)) n++;
            for (const [rot, pre] of COLS) {
                let row = '';
                for (let i = 0; i < n; i++) row += st(document.getElementById(`${pre}${b}_${i}`));
                out.push(`  ${rot.padEnd(12)} ${row}`);
            }
            for (const [rot, pre] of RADIOS) {
                let row = '';
                for (let i = 0; i < n; i++) {
                    const ok = document.getElementById(`${pre}[${b}][${i}]_0`);
                    row += !ok ? 'x' : ok.disabled ? (ok.checked ? 'K' : 'k')
                                                   : (ok.checked ? 'O' : '-');
                }
                out.push(`  ${rot.padEnd(12)} ${row}`);
            }
        }
        if (!achou) out.push('(nenhum banco detectado)');
        const lvdAtivo = document.querySelector('input[name="optradioFccLvdAtivo"]:checked');
        const lvdTensao = document.getElementById('txt_tensao_lvd_fcc');
        const lvdFinal = document.querySelector('input[name="optradioFccLvd_final"]:checked');
        out.push('LVD: Ativo=' + (lvdAtivo ? lvdAtivo.value : '(sem marcacao)')
            + ' | tensao_lvd=[' + (lvdTensao ? lvdTensao.value : '?') + ']'
            + (lvdTensao && lvdTensao.disabled ? ' (disabled)' : '')
            + ' | final=' + (lvdFinal ? lvdFinal.value : '(sem marcacao)'));
        const ticket = document.getElementById('txt_ticket_fcc');
        out.push('Ticket: [' + (ticket ? ticket.value : '?') + ']'
            + (ticket && ticket.disabled ? ' (disabled)' : ''));
        return out.join('\\n');
    }""")
    print("\n--- DIAG FCC ---")
    print(linhas)
    print("--- FIM DIAG ---")

def _drain_browser_queue(page: Page) -> list[str]:
    """Le e limpa os comandos disparados pelos botoes do painel."""
    return page.evaluate("""() => {
        const q = window.__botQueue || [];
        window.__botQueue = [];
        return q;
    }""")

def _set_panel_status(page: Page, texto: str) -> None:
    try:
        page.evaluate("""(t) => {
            window.__botStatus = t;
            if (window.__botRender) window.__botRender();
        }""", texto)
    except Exception:
        pass

def print_dados_qdf_qdcc(page: Page) -> str:
    """Diagnostico do export de QDF/QDCC: arquivo, total de registros e o que
    casaria com o site/tag do formulario aberto. Devolve um resumo curto
    (aparece no painel do bot)."""
    dados = _carregar_dados()
    print(f"\n[dados] Pasta de dados: {_dir_dados()}")
    print(f"[dados] Arquivo: {dados['arquivo']}")
    if dados["erro"]:
        print(f"[dados] ERRO ao ler: {dados['erro']}")
        return f"DADOS: erro ao ler o export ({dados['erro']})"
    if not dados["arquivo"]:
        print("[dados] Nenhum .json na pasta — exporte do app Preventivas "
              f"e copie para '{DADOS_DIR_NOMES[0]}'.")
        return f"DADOS: nenhum export em '{DADOS_DIR_NOMES[0]}' (usando valores de referencia)"
    print(f"[dados] Registros no export: {dados['total']} (indexados: {len(dados['registros'])})")
    if dados.get("colisoes"):
        aviso = ", ".join(dados["colisoes"][:8])
        if len(dados["colisoes"]) > 8:
            aviso += " ..."
        n_col = len(dados["colisoes"])
        print(f"[dados] Aviso: {n_col} site/tag com mais de uma medicao "
              f"(ficou a mais recente): {aviso}")
    site = _site_da_url(page)
    tag = ""
    try:
        loc = page.locator("#txt_tag_qdcc").first
        if loc.count() > 0:
            tag = (loc.input_value() or "").strip()
    except Exception:
        pass
    print(f"[dados] Pagina atual: site={site} tag='{tag}'")
    reg = _dados_do_site(site, tag) if tag else None
    if reg:
        print(f"[dados] -> REGISTRO ENCONTRADO: tipo={reg.get('tipo')} "
              f"compl={reg.get('tipoComplemento')!r} ticket={reg.get('ticket')} "
              f"circuitos={len(reg.get('circuitos') or [])}")
        print(f"[dados]    tensaoAC={reg.get('tensaoAC')!r} temperatura={reg.get('temperatura')!r} "
              f"corrente={reg.get('medicaoCorrente')}")
    else:
        print("[dados] -> nenhum registro casa com esse site+tag")
    # lista as tags disponiveis do site (ajuda a achar o registro certo)
    disponiveis = sorted({t for (s, t) in dados["registros"].keys() if s == _norm_txt(site)})
    if disponiveis:
        print(f"[dados] Tags do site {site} no export: {', '.join(disponiveis)}")
    if reg:
        return (f"DADOS: {site} '{tag}' -> ACHOU {len(reg.get('circuitos') or [])} circuitos "
                f"({dados['total']} registros no export)")
    if disponiveis:
        return f"DADOS: {site} '{tag}' sem registro; tags no export: {', '.join(disponiveis[:6])}"
    return f"DADOS: {site} '{tag}' sem registro no export ({dados['total']} registros)"

def execute(page: Page, raw: str) -> str:
    """Executa um comando e devolve um status curto (exibido no painel)."""
    cmd, _, rest = raw.partition(" ")
    cmd = cmd.lower().strip()
    rest = rest.strip()
    if cmd in ("exit", "quit", "sair"): return "__EXIT__"
    if cmd == "help": print(HELP); return "ajuda exibida no terminal"
    if cmd == "hubs":
        global HUBS
        HUBS = _carregar_hubs()
        print(json.dumps(HUBS, indent=2, ensure_ascii=False))
        return f"hubs.json recarregado e exibido ({HUBS_PATH})"
    if cmd == "ls": print_interactive(page); return "elementos listados no terminal"
    if cmd == "scan": print_scan(page); return "scan exibido no terminal"
    if cmd == "scanv": print_scan_vazio(page); return "scan completo (com campos vazios) exibido no terminal"
    if cmd == "dados": return print_dados_qdf_qdcc(page)
    if cmd == "fill_qdcc": return fill_qdcc(page)
    if cmd == "fill_mt": fill_mt(page); return "MT preenchido (aba aberta)"
    if cmd == "fill_fcc": fill_fcc(page); return "FCC preenchido (aba aberta)"
    if cmd == "fill_fcc_bat": fill_fcc_bat(page); return "Baterias FCC preenchidas (aba aberta)"
    if cmd == "fill_ups": fill_ups(page); return "UPS preenchido (aba aberta)"
    if cmd == "fill_ups_bat": fill_ups_bat(page); return "Baterias UPS preenchidas (aba aberta)"
    if cmd == "fill_ups_tudo":
        carregar_medicoes(page)
        fill_ups(page)
        fill_ups_bat(page)
        return "UPS completo: medicoes carregadas + valores + baterias"
    if cmd == "fill_qdca": fill_qdca(page); return "QDCA preenchido (aba aberta)"
    if cmd == "fill_fcc_tudo":
        carregar_medicoes(page)
        fill_fcc(page)
        fill_fcc_bat(page)
        return "FCC completo: medicoes carregadas + valores + baterias"
    if cmd == "diag_fcc": diag_fcc(page); return "diagnostico FCC exibido no terminal"
    if cmd == "fill_ok":
        somente_visiveis = rest.lower() in ("aba", "mt", "visivel", "ativa")
        fill_ok(page, somente_visiveis)
        return f"OK aplicado ({'aba aberta' if somente_visiveis else 'pagina toda'})"
    if cmd == "goto": page.goto(rest, wait_until="domcontentloaded"); return f"navegou para {rest}"
    if cmd == "click": page.locator(rest).first.click(); return f"clicou em {rest}"
    if cmd == "fill":
        sel, _, val = rest.partition(" ")
        page.locator(sel.strip()).first.fill(val.strip())
        return f"preencheu {sel.strip()}"
    if cmd == "url": print(page.url); return page.url
    if cmd == "title": print(page.title()); return page.title()
    if cmd == "dump":
        path = save_dump(page, rest or None); print(f"[console] Salvo em {path}")
        return f"dump salvo: {path.name}"
    if cmd == "shot":
        path = save_shot(page, rest or None); print(f"[console] Salvo em {path}")
        return f"shot salvo: {path.name}"
    return f"comando desconhecido: {cmd}"

def _read_terminal(entradas: "queue.Queue[str]") -> None:
    """Le o terminal em thread separada e enfileira os comandos digitados."""
    while True:
        try: linha = input("\ninfratel> ")
        except (EOFError, KeyboardInterrupt):
            entradas.put("exit")
            return
        entradas.put(linha)

def _despachar(context: BrowserContext, abas: list[Page], ativa: int,
               raw: str, origem: object) -> tuple[str, int]:
    """Executa um comando vindo do terminal ou do painel de uma guia.

    Comandos de guia (guia/nova/fechar) mexem na lista de abas e no alvo do
    terminal; os demais vao para execute() na pagina de ORIGEM (painel age na
    propria guia) ou na guia ATIVA (terminal). Devolve (status, guia ativa).
    """
    cmd, _, rest = raw.partition(" ")
    cmd = cmd.lower().strip()
    rest = rest.strip()

    if cmd in ("guia", "aba", "tab"):
        if not rest:
            print("[guia] Guias abertas:")
            for i, a in enumerate(abas, 1):
                marc = "*" if (i - 1) == ativa else " "
                print(f"  {marc} guia {i}: {a.url}")
            return f"{len(abas)} guia(s) abertas", ativa
        n = int(rest)
        if 1 <= n <= len(abas):
            return f"alvo do terminal: guia {n}", n - 1
        return f"guia {n} inexistente (1..{len(abas)})", ativa

    if cmd == "nova":
        base = origem.url if isinstance(origem, Page) else abas[ativa].url
        destino = rest or base
        try:
            np = context.new_page()
        except Exception as e:
            return f"nova guia falhou: {e}", ativa
        np.set_default_timeout(NAV_TIMEOUT_MS)
        try:
            np.goto(destino, wait_until="domcontentloaded")
            np.wait_for_timeout(SETTLE_MS)
        except Exception as e:
            print(f"  [aviso] nova guia nao carregou {destino}: {e}")
        abas.append(np)
        return f"guia {len(abas)} aberta: {destino}", ativa

    if cmd == "fechar":
        n = int(rest) if rest else ativa + 1
        if len(abas) <= 1:
            return "nao e possivel fechar a ultima guia (use exit)", ativa
        if not (1 <= n <= len(abas)):
            return f"guia {n} inexistente (1..{len(abas)})", ativa
        try:
            abas[n - 1].close()
        except Exception:
            pass
        del abas[n - 1]
        return f"guia {n} fechada ({len(abas)} restante(s))", min(ativa, len(abas) - 1)

    alvo = origem if isinstance(origem, Page) else abas[ativa]
    return execute(alvo, raw), ativa

def run_console(context: BrowserContext, page: Page) -> None:
    """Console multi-guia: terminal + painel de botoes em varias abas ao mesmo tempo.

    - O painel e injetado em TODAS as guias do contexto (context.add_init_script);
      cada botao empilha o comando na fila DA PROPIA guia, entao age nela —
      varias guias podem ser preenchidas em paralelo, cada uma pelo seu painel.
    - O terminal comanda a 'guia ativa': 'guia' lista/troca, 'nova' abre outra
      aba JA AUTENTICADA (mesma sessao/cookies), 'fechar' fecha uma aba.
    """
    abas: list[Page] = [page]
    ativa = 0

    print("\n" + "="*60)
    print("[console] Sessao ativa. Digite 'help' para comandos.")
    print("[console] Multi-guia: 'nova' abre outra aba ja logada; 'guia' lista/troca o alvo.")
    print("="*60)
    print_interactive(page)

    # O terminal roda em thread separada; o loop principal atende os dois
    # "canais" (terminal + botoes do painel de cada guia) sem bloquear no input().
    entradas: "queue.Queue[str]" = queue.Queue()
    threading.Thread(target=_read_terminal, args=(entradas,), daemon=True).start()

    try:
        while True:
            abas = [a for a in abas if not a.is_closed()]
            if not abas:
                print("[console] Todas as guias foram fechadas. Encerrando.")
                return
            if ativa >= len(abas):
                ativa = len(abas) - 1

            pendentes: list[tuple[object, str]] = []
            for a in list(abas):
                try:
                    for cmd in _drain_browser_queue(a):
                        pendentes.append((a, cmd))
                except Exception as e:
                    msg = str(e).lower()
                    if "closed" in msg or "context was destroyed" in msg:
                        # guia foi fechada: o prune do proximo ciclo a remove
                        continue
                    print(f"[erro] painel indisponivel: {e}")

            while True:
                try: pendentes.append(("terminal", entradas.get_nowait()))
                except queue.Empty: break

            for origem, raw in pendentes:
                raw = (raw or "").strip()
                if not raw: continue
                print(f"[comando] {raw}")
                try:
                    status, ativa = _despachar(context, abas, ativa, raw, origem)
                    if status == "__EXIT__": return
                    alvo = origem if isinstance(origem, Page) else abas[ativa]
                    _set_panel_status(alvo, status)
                except Exception as e:
                    print(f"[erro] {e}")
                    try:
                        alvo = origem if isinstance(origem, Page) else abas[ativa]
                        _set_panel_status(alvo, f"erro: {e}")
                    except Exception:
                        pass

            # sleep puro: nao depende de nenhuma guia estar viva (fecha-lo no
            # meio do ciclo nao pode derrubar o console — bug do 1o dia multi-guia)
            time.sleep(0.2)
    except KeyboardInterrupt:
        print("\n[console] Encerrando pelo teclado (Ctrl+C)...")
        return

def wait_for_manual_otp(page: Page, timeout_s: int) -> bool:
    print("\n[otp] Digite a chave no campo 'Chave Authenticator' da janela.")
    timeout_ms = timeout_s * 1000 if timeout_s > 0 else 0
    try:
        page.wait_for_function("() => { const el = document.querySelector('#otp_code'); return !!el && el.value.trim().length >= 6; }", timeout=timeout_ms)
        return True
    except PlaywrightTimeoutError: return False

def criar_atalho_area_trabalho() -> None:
    """Cria um atalho do executavel na area de trabalho do Windows no primeiro uso."""
    if not getattr(sys, "frozen", False):
        return  # Nao cria atalho se rodando via script .py

    try:
        import winshell
        from win32com.client import Dispatch

        desktop = winshell.desktop()
        path_atalho = os.path.join(desktop, "Agente Infratel.lnk")
        
        # So cria se o atalho ainda nao existir
        if not os.path.exists(path_atalho):
            path_exe = sys.executable
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(path_atalho)
            shortcut.Targetpath = path_exe
            shortcut.WorkingDirectory = str(BASE_DIR)
            shortcut.IconLocation = path_exe
            shortcut.Description = "Automação Infratel/Claro"
            shortcut.save()
            print(f"[sistema] Atalho criado na área de trabalho: {path_atalho}")
    except Exception as e:
        print(f"[sistema] Aviso: Nao foi possivel criar o atalho automaticamente: {e}")

def main() -> None:
    # Tenta criar o atalho no primeiro uso (se for o executavel portable)
    criar_atalho_area_trabalho()

    # Pre-preenche a tela local a partir do .env (opcional: se nao houver, o
    # humano digita tudo). O .env e tambem onde o login e gravado quando o
    # checkbox "Salvar login" vem marcado.
    creds = load_credentials()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=["--start-maximized"])
        try:
            # Contexto explicito: o painel (add_init_script) nasce em TODAS as
            # guias — inclusive as abertas depois por 'nova' — e todas herdam a
            # mesma sessao (cookies). Login unico, preenchimento paralelo.
            # no_viewport: a area util da pagina acompanha o tamanho real da
            # janela (como um navegador normal), sem recolher para 1280x720 —
            # sem isso o layout responsivel do Infratel fica desalinhado, com
            # faixa lateral vazia.
            context = browser.new_context(no_viewport=True)
            page = context.new_page()
            page.set_default_timeout(NAV_TIMEOUT_MS)

            # --- TELA DE LOGIN LOCAL (login.html) -----------------------------
            # Abre ANTES do Infratel: o humano digita usuario, senha e ticket
            # numa tela propria (fundo escuro, logo). NENHUM init script ainda:
            # o painel do bot nao pode aparecer por cima do formulario.
            login_html = BASE_DIR / "login.html"
            if not login_html.exists():
                print(f"[erro fatal] Tela de login nao encontrada: {login_html}")
                return
            page.goto(login_html.as_uri(), wait_until="domcontentloaded")
            try:
                page.wait_for_load_state("load", timeout=NAV_TIMEOUT_MS)
            except PlaywrightTimeoutError:
                pass
            # Pre-preenche com o que ja existe no .env (a tela so completa o
            # que faltar) — evita redigitar a senha a cada execucao.
            if creds.user:
                page.locator("#user").fill(creds.user)
            if creds.password:
                page.locator("#password").fill(creds.password)
            if creds.ticket:
                page.locator("#ticket").fill(creds.ticket)
            if creds.user and creds.password:
                # Ja ha credenciais salvas neste computador: a caixa vem ligada.
                try:
                    page.locator("#saveLogin").check()
                except Exception:
                    pass
            print("\n[login] Preencha a tela de login (usuario, senha e ticket) e clique em ENTRAR E INICIAR.")
            try:
                # timeout=0 = sem limite: espera o clique do humano.
                page.wait_for_function("() => window.__loginData !== undefined", timeout=0)
            except Exception as e:
                print(f"[erro fatal] Tela de login encerrada antes do envio: {e}")
                return
            dados = page.evaluate("window.__loginData")
            creds = Credentials(user=dados["user"], password=dados["pass"], ticket=dados["ticket"])
            # O ticket vem da tela: as abas (FCC/UPS/QDCA) leem do ambiente.
            os.environ["INFRATEL_USER"] = creds.user
            os.environ["INFRATEL_PASS"] = creds.password
            os.environ["INFRATEL_TICKET"] = creds.ticket
            salvar_credenciais_no_env(creds.user, creds.password, creds.ticket, bool(dados.get("save")))
            print("[login] Dados recebidos. Navegando para o Infratel...")

            # --- INFRATEL -------------------------------------------------------
            # O painel (PANEL_JS) so e registrado AGORA: vale para esta
            # navegacao e para todas as guias criadas depois ('nova').
            context.add_init_script(PANEL_JS)
            page.goto(LOGIN_URL, wait_until="domcontentloaded")
            page.wait_for_timeout(SETTLE_MS)
            page.locator("#login").fill(creds.user)
            page.locator("#password").fill(creds.password)
            if not wait_for_manual_otp(page, OTP_WAIT_SECONDS): return
            page.locator('#loginForm button[type="submit"]').click()
            try: page.wait_for_load_state("domcontentloaded", timeout=NAV_TIMEOUT_MS)
            except PlaywrightTimeoutError: pass
            if page.locator("#password").count() > 0:
                print("[erro] Login falhou."); return
            try:
                run_console(context, page)
            except KeyboardInterrupt:
                print("\n[console] Encerrando...")
            except Exception as e:
                # O finally usa os._exit(0), que engole excecoes — imprimir aqui
                # para o console nunca morrer "as cegas".
                print(f"[erro fatal no console] {type(e).__name__}: {e}")
        except KeyboardInterrupt:
            print("\n[console] Encerrando...")
        finally:
            try: browser.close()
            except Exception: pass
            # Forca o encerramento de todas as threads e loops
            os._exit(0)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        os._exit(0)
    except Exception as e:
        print(f"[erro fatal] {e}")
        os._exit(1)
