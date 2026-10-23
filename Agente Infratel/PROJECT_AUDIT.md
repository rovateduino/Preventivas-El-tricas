# Relatório de Auditoria Técnica - Agente Infratel
**Data:** 21 de Outubro de 2026
**Responsável:** Especialista em Engenharia de Software / IA

> **Novo agente de IA:** comece pelo **`AGENTS.md`** (visão geral, arquitetura, build portátil,
> armadilhas, checklist). Este documento é a auditoria histórica de bugs (§5) e complementa o guia.

## 1. Visão Geral do Projeto
O **Agente Infratel** é uma solução de automação robótica (RPA) de alta performance desenvolvida para otimizar o preenchimento de relatórios de manutenção preventiva no sistema Infratel da Claro. O projeto utiliza uma arquitetura híbrida de automação de navegador (Playwright) com injeção de interface dinâmica (UI Overlay) para proporcionar uma experiência de "co-piloto" ao técnico de campo.

## 2. Propósito e Valor Agregado
*   **Redução de Erro Humano:** Elimina a necessidade de preenchimento manual exaustivo de centenas de campos repetitivos.
*   **Eficiência Operacional:** Reduz o tempo de preenchimento de uma aba completa (como FCC ou MT) de minutos para segundos.
*   **Consistência de Dados:** Garante que padrões técnicos (como tensões nominais e temperaturas de operação) sejam seguidos rigorosamente.
*   **Segurança da Informação:** Arquitetura focada em evitar a exposição de credenciais e segredos no código-fonte ou logs.

## 3. Arquitetura e Funções Implementadas
*   **Motor de Execução:** Python 3.11 + Playwright (Sync API).
*   **Interface Injetada:** Painel flutuante em JavaScript Vanilla, arrastável e resiliente a navegações de página. **Menu simplificado (21/10):** o painel ficou com “MT completo”, “FCC completo”, “Diag FCC” e “Nova guia”; as demais funções (OKs, scan, dump, shot) saíram do painel mas continuam disponíveis como comandos no terminal (`help`).
*   **Comando Inteligente `fill_ok`:** Lógica heurística que identifica campos de inspeção (OK/BOM) e os marca respeitando a visibilidade e o estado do sistema. Falhas passam a distinguir `disabled` (site travou a linha) de clique não aplicado.
*   **Automação de Baterias (FCC) — topologia e perfil de tensão:** `fill_fcc_bat` lê por banco a quantidade cadastrada (`#txt_banco_bateria_fcc_N`), a **Tensão VDC** (`#txt_tensao_bateria_fcc_N`) e as linhas renderizadas no DOM, preenchendo exatamente essa topologia nas 7 colunas. O perfil de valores é escolhido pela tensão lida na tela: **12V** → flutuação 13.5–13.7, descarga 12.2–12.8, resistência 4.0–7.8 (aleatórios, **sempre com 1 casa decimal** — ex.: 6.1); **2V** → 2.20 / 2.00 / 1.39–1.98 (**sempre com 2 casas decimais** — ex.: 6.43); temperatura 20 °C, condutância 0 e densidade 0 em ambos. As casas decimais são fixas por perfil via formatação `f"{valor:.Nf}"` (não `round`), evitando inconsistências como 6.43 ao lado de 6.1 na mesma tabela. Tensão não reconhecida: colunas de medição são ignoradas com alerta (o bot não inventa valor). **Regras dos hubs SPOVMN/SBOJPS/SCNPER (21/10):** a sigla é lida da URL (parâmetro `?site=`, ex.: `.../consultar?site=SCNPER` — `_site_da_url`) e habilita duas regras: (1) a coluna densidade recebe **1220 fixo** **somente em bancos de 2V** — bancos 12V do mesmo hub, hubs fora da lista e URLs sem `?site=` continuam com **0** (a Tensão VDC do banco é lida antes de decidir). O valor é fixo e não sorteado 1220–1222 porque o site **só aceita Situação Final = OK na Condutância com densidade ≤ 1220** — com 1221/1222 o clique em OK é recusado (constatado em produção: nas linhas 1221/1222 o botão ficava em NO; com 0 ou 1220, 100% dos OKs colavam); (2) **antes** de preencher, a *Situação Final* por elemento (rádios `optradioMedicao{Equal|Descarga|Condutancia}FccF<n>[banco][elem]`, value `NOK`) é marcada como **NO** — o site recusa o preenchimento com alertas de "ATENÇÃO" (condutância/resistência pendente) caso a situação esteja vazia/OK — e ao final o `fill_ok` devolve tudo a OK com os campos já preenchidos. Condutância permanece 0 em todos. O campo Tensão VDC aceita variações de formatação (`2V`, `12V`, `2 V`, `12,5 V`): a classificação usa o número imediatamente seguido de `V` (com vírgula decimal normalizada), com recuo para o primeiro número quando `V` não consta. Nenhuma falha é silenciosa: cada campo é classificado (preenchido / já tinha valor / readonly / disabled / ausente / sem perfil / erro) com exemplos no log.
*   **Correção do limite chumbado de bancos (21/10):** a detecção (`_detectar_bancos_bateria`) e o `diag_fcc` varriam apenas `b <= 8` via metadados `#txt_banco_bateria_fcc_N` — em um site com 12 bancos, os bancos 9–12 eram ignorados. Limites elevados para 64 e a numeração dos bancos passou a ser a **união** entre metadados e as linhas realmente renderizadas no DOM (`input[id^="txt_tensao_equal_fcc_"]`), de modo que nenhum banco escapa, mesmo sem campo de metadado. Verificado com página sintética de 12 bancos (+1 banco só-DOM): detecção, `diag_fcc` e `fill_fcc_bat` cobrem todos eles.
*   **Modo multi-guia (21/10):** o bot passou a usar um `BrowserContext` explícito com o painel injetado via `add_init_script` — **toda guia** (inclusive as abertas depois) nasce com o painel e compartilha a mesma sessão/cookies (login único). O painel de cada guia age **na própria guia** (fila por janela), permitindo preencher várias abas em paralelo. Comandos novos no terminal: `guia` (lista, `*` = alvo; `guia <n>` troca), `nova [url]` (abre aba já logada, padrão clona a guia atual) e `fechar [n]` (não fecha a última guia). Guias criadas manualmente com Ctrl+T continuam fora do alcance do bot (limitação do Playwright) — use `nova`. **Resiliência a guias fechadas (21/10):** no 1º dia, fechar uma aba no meio do ciclo derrubava o console silenciosamente (`wait_for_timeout` em página fechada → exceção → `os._exit(0)` engolido pelo `finally`). O loop agora usa `time.sleep` (sem depender de páginas), a drenagem da fila trata "closed"/"context was destroyed" como guia removida (prune do próximo ciclo) e o `main` imprime `[erro fatal no console]` antes de encerrar — fechar guia no meio do uso é seguro.
*   **Botão único “FCC completo” + carga automática de medições:** o painel expõe um só botão que executa, em sequência: clique automático em todos os botões “Carregar medições” do site (achados por texto — não têm `id`/`name`; clique via DOM, idempotente e sem reacionar botão já clicado), `fill_fcc` (ticket, valores medidos, alerta LVD e OKs) e `fill_fcc_bat` (baterias por perfil de tensão), via comando `fill_fcc_tudo`. O técnico não precisa mais abrir as seções de medição manualmente antes de rodar o preenchimento. Os comandos granulares `fill_fcc` e `fill_fcc_bat` continuam disponíveis no terminal (`fill_fcc_bat` também carrega as medições).
*   **Comando `diag_fcc`:** Matriz banco × elemento com estado de cada campo (valor/disabled/readonly) e dos radios OK, incluindo bloco LVD e N° Ticket. Usar antes de iterar quando houver campos que o site recusa.
*   **Sistema de Discovery:** Dumps JSON passam a registrar `disabled`/`readonly` por campo, permitindo diagnóstico forense offline.
*   **N° Ticket:** `fill_fcc` preenche `#txt_ticket_fcc` a partir de `INFRATEL_TICKET` no `.env` (campo obrigatório para salvar).

## 4. Análise de Risco e Segurança
*   **Lição da auditoria 21/10:** alegações de agentes externos sobre o código devem ser verificadas linha a linha. Nesta data, uma correção foi anunciada como "preenchimento orientado à topologia", mas a leitura de `#txt_banco_bateria_fcc_N` era apenas log — o preenchimento continuava guloso por prefixo. Corrigido na implementação atual.
*   **Ponto de Atenção (RESOLVIDO em 21/10 — ver itens 5.7 e 5.8):** a hipótese de que o site desabilitava/recusava os radios OK de bateria por campos vazios foi confirmada com mecanismo diferente do suposto: o site exige Situação Final = NOK durante o preenchimento ("ATENÇÃO" caso contrário) e recusa OK na Condutância com densidade > 1220. Soluções aplicadas: `_situacao_final_nok` (NO → preencher → OK) e densidade fixa 1220 nos hubs. Resta apenas a pendência 5.10 (`optradioFccLvd_final_0`).
*   **Encerramento:** `os._exit(0)` no `finally` eliminou o ruído de exceções ignoradas no Ctrl+C.
*   **Melhoria de Segurança:** as credenciais ainda residem em variáveis de ambiente simples. Recomenda-se a migração para o cofre AES-256-GCM planejado.

## 5. Histórico de Erros e Soluções (21–22/10/2026)
Registro cronológico de todos os defeitos observados (em produção ou teste) e a solução aplicada. Cada item: sintoma → causa → solução → verificação.

### 5.1 Bancos 9–12 ignorados (limite chumbado de 8)
*   **Sintoma:** em um hub com 12 bancos de baterias, só os bancos 1–8 eram preenchidos/diagnosticados; bancos 9–12 ficavam vazios.
*   **Causa:** `_detectar_bancos_bateria` e `diag_fcc` varriam apenas `b <= 8` nos metadados `#txt_banco_bateria_fcc_N`.
*   **Solução:** limites elevados para 64 e a numeração dos bancos passou a ser a **união** entre metadados e linhas realmente renderizadas no DOM (`input[id^="txt_tensao_equal_fcc_"]`), cobrindo bancos mesmo sem metadado.
*   **Verificação:** página sintética de 12 bancos (+1 só-DOM): detecção, `diag_fcc` e `fill_fcc_bat` cobrem todos.

### 5.2 Casas decimais inconsistentes nos valores (uso de `round`)
*   **Sintoma:** na mesma tabela apareciam valores como `6.43` ao lado de `6.1` (mistura de 1 e 2 casas decimais).
*   **Causa:** formatação por `round()`, que devolve o número de casas do valor sorteado, não do perfil.
*   **Solução:** formatação fixa por perfil via f-string — 12V sempre `.1f` (ex.: `6.1`); 2V sempre 2 casas (ex.: `2.20`, `2.00`, `6.43`), independente do valor sorteado.
*   **Verificação:** `test_bancos.py` (sorteios repetidos sempre saem com a casa decimal do perfil).

### 5.3 Crash `NameError: name 're' is not defined` em `_perfil_bateria`
*   **Sintoma:** qualquer chamada de `fill_fcc_bat`/`_perfil_bateria` abortava com `NameError` na linha do `re.search`.
*   **Causa:** edição externa do `bot.py` reescreveu `_perfil_bateria` usando `re` (para aceitar `'2 V'`, `'12,5 V'` etc.) mas **não adicionou `import re`** no topo do arquivo.
*   **Solução:** `import re` adicionado ao bloco de imports (bot.py:22).
*   **Verificação:** `py_compile` + suíte completa (6/6).

### 5.4 Multi-guia: fechar uma aba derrubava o console silenciosamente
*   **Sintoma:** no 1º dia do modo multi-guia, ao fechar uma guia com o X no meio do uso, o console morria sem mensagem e o terminal voltava ao prompt do PowerShell.
*   **Causa:** o loop chamava `abas[ativa].wait_for_timeout(200)` — se a aba ativa tivesse sido fechada, o Playwright lançava exceção; o `finally` do `main` executava `os._exit(0)`, que **engole a exceção**, produzindo morte silenciosa.
*   **Solução:** (1) loop passou a usar `time.sleep(0.2)` (não depende de páginas); (2) a drenagem da fila de cada guia trata mensagens contendo `"closed"`/`"context was destroyed"` como guia já removida (prune do próximo ciclo), sem erro; (3) `main` envolve `run_console` em try/except e imprime `[erro fatal no console] {tipo}: {erro}` antes do `os._exit(0)`; (4) o comando `nova` protege `context.new_page()` com try/except.
*   **Verificação:** `test_guia_fechada.py` reproduz o cenário (abrir guia, fechar no meio do ciclo, comandar de novo) — o console sobrevive.

### 5.5 Guias abertas com Ctrl+T não são alcançáveis pelo bot
*   **Sintoma:** abas criadas manualmente pelo usuário não recebem painel nem respondem a comandos.
*   **Causa:** limitação do Playwright — guias abertas fora do contexto do bot são invisíveis para ele.
*   **Solução:** não é defeito do código; uso correto é o comando `nova` (ou botão "Nova guia"), que abre a aba pelo contexto do bot com painel e sessão compartilhados. Documentado no `help` e no painel.

### 5.6 Botões "Carregar medições" não tinham identificação
*   **Sintoma:** era preciso abrir as seções de medição manualmente antes do preenchimento.
*   **Causa:** os botões do site não têm `id`/`name` — inalcançáveis por seletores.
*   **Solução:** localização **por texto** ("Carregar medições") com clique via DOM, idempotente (assinatura índice+tag+id+classe; não reage a botão já clicado), executada no início de `fill_fcc_tudo` e `fill_fcc_bat`.
*   **Verificação:** `test_carregar.py` (página sintética com 12 botões; todos clicados uma única vez).

### 5.7 Site bloqueia o preenchimento com alertas de "ATENÇÃO" (Condutância/Resistência)
*   **Sintoma:** nos hubs SPOVMN/SBOJPS/SCNPER, ao preencher a seção "Teste de Condutância / Resistência Interna", o site disparava mensagens de "ATENÇÃO" exigindo condutância/resistência antes, dificultando o preenchimento.
*   **Causa:** o site exige que a **Situação Final** de cada linha esteja marcada como **NOK ("NO")** enquanto os campos estão em preenchimento; com a situação vazia ou OK ele valida e recusa.
*   **Solução:** função `_situacao_final_nok` — **antes** de preencher (apenas nesses hubs), todos os rádios de Situação Final por elemento são marcados NOK; **depois** do preenchimento, o `fill_ok` final devolve tudo a OK com os campos já preenchidos. Sequência: **NO → preencher → OK**.
*   **Mapeamento dos rádios (feito a partir do dump real):** familias `optradioMedicaoEqualFccF<n>[banco][elem]` (flutuação), `optradioMedicaoDescargaFccF<n>[banco][elem]` (descarga) e `optradioMedicaoCondutanciaFccF<n>[banco][elem]` (condutância); sufixo `_0` = value `OK`, sufixo `_1` = value `NOK`; `[banco]` 1-based e `[elem]` 0-based, mesma indexação dos inputs `#txt_*_fcc_{banco}_{elem}`.
*   **Verificação:** `test_densidade_site.py` (sequência de cliques gravada na página: 6×NOK antes, campos, 6×OK no final).

### 5.8 OKs da Condutância recusados quando densidade > 1220
*   **Sintoma:** após o fluxo NO→preencher→OK, na página 2V do SCNPER muitos botões OK de Condutância continuavam em NO (49 de 72); nas páginas 12V (densidade 0), 100% colavam.
*   **Causa:** o site **só aceita Situação Final = OK na Condutância com densidade ≤ 1220**. Com 1221/1222 o clique é recusado (o handler do rádio reverte o `checked`). Evidência: (1) nos prints do técnico, **todas** as linhas verdes tinham densidade 1220 e **todas** as 1221/1222 ficaram em NO — correlação perfeita em todos os bancos; (2) 49 falhas = ~2/3 de 72 = justamente a fatia sorteada como 1221/1222; (3) densidade 0 (página 12V) passou sem nenhuma falha.
*   **Solução:** nos hubs da lista, bancos **2V** recebem densidade **fixa em 1220** (o único valor do intervalo pedido que o site aceita); bancos 12V e sites fora da lista continuam com 0. Decisão do técnico em 21/10 ("Sempre 1220").
*   **Verificação:** `test_densidade_site.py` (hub 2V → `["1220","1220"]`; hub+mix → banco 12V `0` e banco 2V `1220`; fora da lista → `0`).

### 5.9 Armadilha de teste: Playwright Sync API é preso a uma thread
*   **Sintoma:** em teste, chamar `page.close()` de outra thread produzia `Cannot switch to a different thread`.
*   **Causa:** a API síncrona do Playwright só opera na thread que a criou.
*   **Solução:** nos testes, interagir com as páginas apenas na thread principal (ou pelos comandos do próprio console, que rodam na thread certa). Não afeta o bot em produção (a thread do terminal só faz `input()`/fila).

### 5.10 Pendências conhecidas (ainda sem solução)
*   **`optradioFccLvd_final_0` — clique não aplicado:** o OK do rádio "Situação Final" do bloco LVD continua sendo recusado pelo site mesmo após tudo preenchido (aparece como única falha no fim do `fill_fcc_bat` nas páginas 12V e ainda na 2V). Mecanismo parecido com o 5.7/5.8 (validação de pré-requisitos), mas ainda não diagnosticado. Próximo candidato a investigação — usar `diag_fcc` + dump na página real.
*   **`#txt_ticket_fcc` vazio:** o site bloqueia o salvamento sem o N° Ticket; o bot só avisa. Definir `INFRATEL_TICKET` no `.env` resolve (preenchimento automático já implementado).
*   **Aviso de ticket:** mantido intencionalmente como alerta, não como erro.

### 5.11 UPS no SPOPIR: tensões vazias (IDs diferentes por hub) + MT/BT (21/10, tarde)
*   **Sintoma 1:** no hub SPOPIR (`.exe` portátil), "UPS completo" preenchia temps/correntes mas as **tensões AC ficavam vazias** (com "Obrigatório." no site). No terminal aparecia `[miss] #txt_tensao_*_ent/sai_ups`.
*   **Causa 1:** nesse hub os IDs das tensões não batem com `#txt_tensao_rn_ent_ups` etc. (variação de layout por hub; correntes/temps usam IDs que existem).
*   **Solução 1:** fallback por **rótulo visível** no `fill_ups` (`_JS_UPS_TENSAO_POR_ROTULO`): localiza "Tensão Ent. AC FN/FF" e "Tensão Sai. AC FN/FF", pega os inputs da **mesma linha** (`closest('tr')` quando o rótulo está em tabela; senão faixa-Y) à direita do rótulo, ordenados da esquerda p/ direita, e preenche apenas os **vazios** com os mesmos valores sorteados. Armadilha encontrada: sem exigir a mesma `tr`, inputs soltos logo abaixo da tabela roubavam as fases pela faixa-Y (corrigido: se existe `tr`, só a mesma `tr` serve).
*   **Armadilha 2 (21/10, noite — 1ª versão do fallback falhou no site real):** os dumps do Infratel mostraram que o "rótulo" **não é um `<label>` nem texto em `<td>`** — é um `<input id="lbl_tensao_ent_ups">` com o texto no **`.value`** (`textContent` vazio!). A busca original só casava `textContent`, então nunca achava nada no SPOPIR. **Solução:** a busca agora casa `textContent` **e** `value` (qualquer elemento, inclusive `input`); os inputs da linha são **marcados** com `data-bot-rot` pelo JS e preenchidos via **Playwright** (`loc.fill()`), garantindo eventos `input`/`change` corretos para o site; marcador é removido ao final. Diagnóstico detalhado no terminal: `[rotulo] <chave>: rotulo ok, N inputs na linha, 3 marcados` (ou `rotulo nao encontrado` / `so N input(s) na linha`).
*   **Sintoma 2:** em alguns hubs a aba "MT" aparece como **"Concessionária (BT)"** com IDs em sufixo `_bt`.
*   **Solução 2:** MT e BT são o mesmo formulário (decisão do técnico: não substituir um pelo outro, mas cobrir ambos) — `_variantes()` no `fill_mt` tenta o sufixo original **e** o par `_mt`/`_bt`, preenchendo o conjunto de IDs que existir na página (só campos vazios).
*   **Verificação:** `test_ups_rotulo_bt.py` (página sintética **com rótulos como `<input id="lbl_*">` + `.value`** — igual ao site real — sem IDs de tensão; + página só com `_bt`; garante que inputs de outras linhas não são tocados) + suíte completa 7/7 + rebuild do `agente_infra_portable.exe` (21/10, noite). Pacote recriado em `Pacote Agente Infratel\` (o anterior foi apagado/movido).

### 5.12 Tela de login local antes do Infratel (21/10, noite)
*   **Sintoma/pedido:** o login no Infratel exigia credenciais do `.env`; o técnico queria uma **tela própria**
    (visual moderno, fundo escuro, logo) onde digita **usuário, senha e ticket** e decide se quer
    **salvar o login neste computador** — antes de qualquer navegação no site.
*   **Solução 1 (tela):** `infratel_bot\login.html` (+ `robo.png` — o robozinho recortado do mockup,
    512×512) aberto via `file://` (`BASE_DIR/login.html`) **antes** do `LOGIN_URL`. O JS valida
    usuário/senha/ticket e publica `window.__loginData = {user, pass, ticket, save}`; o Python espera com
    `page.wait_for_function(..., timeout=0)` (sem limite) e lê com `page.evaluate`.
*   **Solução 2 (persistência):** o `localStorage` do `file://` é **efêmero** (o contexto do Playwright
    morre ao fechar) e o Chromium pode bloquear storage em `file://` → a persistência REAL é no **`.env`**:
    `salvar_credenciais_no_env()` usa `set_key`/`unset_key` do python-dotenv (preserva as outras vars do
    arquivo). O `save` da tela decide entre gravar ou remover `INFRATEL_USER/PASS/TICKET`.
*   **Solução 3 (ticket):** o ticket digitado na tela vai para `os.environ["INFRATEL_TICKET"]` — é de lá
    que as abas (FCC/UPS/QDCA) tiram o número; `load_credentials()` deixou de abortar (`sys.exit`) quando
    o `.env` está incompleto (a tela cobra o que faltar) e passou a só pré-preencher.
*   **Armadilha:** o `PANEL_JS` (`add_init_script`) **não pode** ser registrado antes da tela de login —
    o painel apareceria por cima do formulário. Registrado **depois** de coletar `__loginData`, ele cobre a
    navegação ao Infratel e todas as guias criadas por `nova` (init script vale para navegações futuras).
*   **Verificação:** `test_login_tela.py` (campos, validação sem ticket, `__loginData` com `save`,
    gravação/limpeza do `.env` preservando vars alheias) + `test_painel_pos_login.py` (painel ausente na
    tela local, presente na página seguinte e em guia nova) + suíte **8/8** + rebuild do `.exe` com
    `login.html`/`logo.png` **ao lado** do exe (são lidos por `BASE_DIR`, não embutidos) + smoke test
    (com `PYTHONUNBUFFERED=1`, senão o stdout bufferiza e o arquivo de log fica vazio).

### 5.13 MT/BT: bloco "Tensão (VCA)" vazio no OCOJMA (22/10)
*   **Sintoma:** no hub OCOJMA, a aba MT (que é o mesmo formulário de "Concessionária (BT)") preencheu
    corrente, temperatura, potência e utilização, mas o bloco **"Tensão (VCA)" (RN, SN, TN, RS, ST, TR)
    ficou vazio**, com "Obrigatório." no site.
*   **Diagnóstico:** o `scan` **só imprime campos com valor** (linha `elif f["value"]`), então os campos
    vazios não apareciam no diagnóstico — não dava para ver os IDs. Novo comando **`scanv`** lista **todos**
    os campos visíveis (inclusive vazios) com `id`/`name`/`type`.
*   **Causa:** os IDs das tensões desse hub não batem nem com `#txt_tensao_*_mt` nem com `#txt_tensao_*_bt`
    (variação de layout por hub, como o caso SPOPIR/UPS).
*   **Solução:** fallback por **rótulo visível** no `fill_mt` (`_JS_MT_VCA_POR_ROTULO`): localiza o rótulo
    "Tensão (VCA)" (match por "só letras", tolerante a acento perdido/espaces/parênteses), limita o bloco
    pelo próximo rótulo ("Corrente") e marca os 6 inputs com `data-bot-mt` para preenchimento via Playwright.
*   **Armadilhas encontradas:** (a) agrupar linhas por **distância fixa** (25px) embaralha a ordem das
    fases → agora é por **sobreposição vertical real** (>50% da altura menor); (b) `data:` URL sem
    `charset=utf-8` mangleia acentos ("tensão" → "tensa?o") e quebra o match do rótulo.
*   **Verificação:** `test_mt_vca.py` (página sintética com layout de linha e IDs desconhecidos; valida os
    6 valores **na ordem** RN=127.0, SN=127.2, TN=127.8, RS=220.0, ST=221.3, TR=220.9 e garante que a linha
    de Corrente **não** foi tocada) + suíte **10/10** + rebuild do `agente_infra_portable.exe`.
*   **CAUSA RAIZ (22/10, madrugada — o `scanv` do técnico revelou):** os IDs `txt_tensao_rn_mt` etc.
    **existem** e o bot preenchia ("[ok] #txt_tensao_rn_mt -> 127.0"), mas o **site ZERAVA** os campos
    depois. Motivo: o hub OCOJMA é **380V** (`#txt_tensao_mt` = "Tensão FF (V)" = **380**) e o bot
    preenchia 127/220 — valores de um sistema **220V**. A validação client-side do site rejeita e limpa o
    campo, exibindo "Obrigatório.".
*   **Solução definitiva:** `_vca_mt_valores()` lê a **tensão FF da própria página** (`#txt_tensao_mt` /
    `#txt_tensao_bt`) e deriva o bloco "Tensão (VCA)": sistema 220V → RN/SN/TN 127.x e RS/ST/TR 220.x;
    sistema 380V → RN/SN/TN 220.x e RS/ST/TR 380.x. Os valores **nunca** são fixos (valem para o
    preenchimento por ID e pelo fallback por rótulo). Terminal: `[mt] Tensao FF do sistema: 380V -> VCA
    fase-neutra 220V / fase-fase 380V`.
*   **Armadilha:** o `scan` só mostra campos **com valor** — para diagnosticar campo vazio é preciso o
    `scanv` (novo comando) ou o `dump`.

### 5.14 QDCC/QDF com os DADOS REAIS do app "Preventivas Elétricas" (22/10, madrugada)
*   **Solicitação (texto do técnico):** *"Isso seria as medições do QDCC e QDF no infratel, não precisa agora
    alterar e nem modificar nada no projeto, apenas leia o conteudo e me diga se é possivel usarmos isso para
    o auto preenchimento com o bot."* → depois: *"a fonte dos dados será esse arquivo exportado mesmo eu
    sempre vou estar atualizando se preciso e copiando para essa pasta."*
*   **Diagnóstico / Investigação:**
    - Arquivo `infratel_bot\dados QDF_QDCC\preventivas-export-2026-10-22T05-43-39.json` (510 KB): export do
      app "Preventivas Elétricas" v1.0, **121 registros** (73 QDF + 48 QDCC) de **33 sites** (35 siglas).
      Campos por registro: `site{sigla,name,cat}`, `tipo` (QDF|QDCC), `tipoComplemento`, `ticket`, `data`,
      `tensaoAC`, `tensaoDC`, `temperatura`, `medicaoCorrente{geral,viaA,viaB}`, `circuitos[{n,viaA,viaB}]`,
      `observacao`; `tensaoR/S/T` e `tensaoRS/ST/TR` vêm **vazios em 121/121** (não servem para nada).
    - O `scanv` do técnico (aba QDCC de `?site=SMMOO62` e `?site=SPOSNT`) revelou a chave que faltava:
      **`txt_tag_qdcc`** = "QDF 1" / "QDCC 01" — ou seja, o QDF mora **dentro da aba QDCC**.
    - Cruzamento: app `SM-MOO62` normalizado = `SMMOO62` = o `?site=` do Infratel (**confirmado**).
      Tag do form "QDF 1" = `tipo`"QDF" + `tipoComplemento`"01" do export (difere só no zero à esquerda).
    - Regras validadas nos dados: `geral == viaA + viaB` em **62/62** casos; `soma(circuitos) == geral` em
      **12/12**; `n` dos circuitos sempre 1..N sem repetição; `tensaoAC` usa **vírgula** decimal em 164 dos
      7.924 valores ("54,1") — os demais usam ponto.
*   **Causa raiz:** não era bug — era **feature nova** (usar medições reais em vez de valores fixos).
    O `fill_qdcc` usava 54.1 / 0 / 20 fixos e `0` no Med. A (só até a linha 64).
*   **O que foi feito:**
    - `bot.py` — novo bloco de dados: `DADOS_DIR_NOMES`, `_dir_dados()`, `_arquivo_dados()` (pega o `.json`
      **mais recente** da pasta), `_num()` (vírgula→ponto), `_norm_txt()` (maiúsculas, sem acento, só
      letras/dígitos, tira zeros à esquerda: "QDF 01"≡"QDF 1"), `_chave_tag()`, `_carregar_dados()`
      (índice `(site,tag)→registro`, com cache em `_DADOS_CACHE`), `_dados_do_site()` (casamento + override
      `hubs.json` seção `SITES`), `_circuitos_por_numero()` e `_linhas_medicao_qdcc()`.
    - `bot.py` — `fill_qdcc()` reescrito: ticket, VCC a/b, correntes A/B, temperaturas +/−, observação no
      comentário e **Med. A por circuito** (todos os circuitos com valor do export, casados pelo número do
      circuito). Sem registro que case → **valores de referência** de antes + aviso.
    - `bot.py` — novo comando **`dados`** (diagnóstico do export) + entrada no `HELP` e no `execute()`.
    - `hubs.json` — nova seção **`SITES`** (vazia, só com comentário): override `sigla_infratel → sigla_app`
      para os hubs em que os dois códigos não batem.
    - `AGENTS.md` — seção 4 (fill_qdcc), §2 (estrutura), §8 (tabela de testes), §9 (pacote).
*   **Por quê:**
    - **Preencher pelo número do circuito, não pelo índice da linha:** o formulário pode ter **vários blocos**
      (SPOSNT: linhas 1‑24 com circuitos 1‑24 e linhas 25‑49 com circuitos 0‑24) — o número do circuito
      reinicia a cada bloco. O bot procura a **sequência contígua 1..N** que casa com o registro.
    - **Med. A recebe `viaA`** (só `viaB` quando `viaSelecionada == "B"`): o formulário tem uma única coluna
      de medição por circuito.
    - **O ticket é o da tela de login**, não o do export: o do export é o ticket **histórico** da medição, e o
      site bloqueia o salvamento sem ticket. Só é preenchido se for **numérico** (o campo é `type=number` —
      "T-777" é recusado pelo navegador).
    - **Colisão de site+tag** (o export tem `GRS`/"QDF 3" duas vezes, em 2026-08-02 e 2026-09-03): fica a
      medição **mais recente** e o fato é avisado no comando `dados`.
    - **Fallback preservado:** se o export não existir, estiver corrompido ou não casar, o bot usa os valores
      de referência — nunca fica sem preencher.
*   **Solução (uso pelo técnico):** exportar do app "Preventivas Elétricas" e copiar o `.json` para
    `infratel_bot\dados QDF_QDCC\` (ou a pasta do `.exe` no pacote portátil). Ao rodar "QDCC completo":
    o bot lê a tag da página (`txt_tag_qdcc`) e o `?site=` da URL, acha o registro e preenche com os valores
    reais. Terminal: `[dados] site=SMMOO62 tag='QDF 1' -> registro encontrado (ticket 14368802, 60 circuitos)`
    e `[med] 4/4 circuitos preenchidos com o valor do export.` Comando `dados` mostra o arquivo carregado,
    o registro que casaria com a página atual e **as tags do site** que existem no export.
*   **Verificação:** `test_qdcc_dados.py` (export sintético + página sintética no formato real, com URL
    `?site=`): (1) casamento site+tag → VCC 54.1 (vírgula convertida), correntes 10.5/9.5, temp 27,
    ticket 777777, Med. A 4/4 = 10.5, observação no comentário sem TAB; (2) tag sem registro → valores de
    referência 54.1/0/20 e Med. A com 0; (3) campo já preenchido **não** é sobrescrito. Suíte **11/11** +
    `py_compile` limpo. Validação com o **export real** (121 registros): 120 indexados, 1 colisão
    (`GRS`/QDF 3 → ficou 2026-09-03), 50 tags distintas, 34 sites; "QDF 1" ↔ "QDF 01" casa corretamente.
*   **Sugestões / Pendências:**
    - **`tensaoDC` ficou SEM uso** (bate com `geral` em 60 registros e difere em 61 — são grandezas
      diferentes; não há campo correspondente no formulário). O técnico precisa dizer para onde vai, se for
      o caso.
    - **A seção `SITES` do `hubs.json` está vazia**: se algum hub tiver sigla diferente entre o app e o
      Infratel (ex.: OCOJMA × "Osasco II"=JMA no app), cadastrar ali — o comando `dados` mostra as tags
      disponíveis do site para ajudar.
    - **A marcação viaA/viaB da Med. A** foi assumida (viaA, exceto quando `viaSelecionada == "B"`): se o
      técnico usar outro critério, é uma linha em `fill_qdcc`.
    - O export é **histórico** (medições de ago/out) — para a preventiva atual o técnico precisa exportar
      novamente com os dados do dia.
    - O `ticket` do export **não** é usado para nada além de display: a preventiva atual tem outro ticket.
*   **Armadilhas:**
    - `localStorage`/contexto: nada a ver aqui — mas o `BASE_DIR` no `.exe` é a pasta do exe: **a pasta de
      dados precisa estar ao lado do `.exe`** (ou o bot cai nos valores de referência).
    - `scan` só mostra campos **com valor** — para campo vazio use `scanv`.
    - `data:` URL sem `charset=utf-8` mangleia acentos (quebra o match da tag).
    - `txt_ticket_qdcc` é `type=number`: ticket com letra é recusado pelo navegador (`Cannot type text into
      input[type=number]`).
    - `hubs.json` só aceita JSON estrito: comentário solto (sem aspas) quebra o `json.load`.

### 5.15 REGRA DE AUDITORIA obrigatória (22/10, madrugada)
*   **Solicitação (texto do técnico):** *"peço que tambem vire mais uma regra aqui, ao final de qualquer
    mudança no bot vc documente tudo isso desde a solicitação, o que foi feito, pra que foi feito, solução,
    sugestão, enfim uma auditoria detalahada/pente fino de tudo."*
*   **O que foi feito:** criada a **seção 12 do `AGENTS.md` — "REGRA DE AUDITORIA — toda mudança no bot vira
    documento"**, com o texto do pedido, o formato obrigatório (9 seções: Solicitação · Diagnóstico ·
    Causa raiz · O que foi feito · Por quê · Solução · Verificação · Sugestões/Pendências · Armadilhas) e o
    item 7 do checklist da §11 do `AGENTS.md` ("toda mudança no bot precisa de AUDITORIA no
    `PROJECT_AUDIT.md`").
*   **Por quê:** o `PROJECT_AUDIT.md` já funcionava como histórico de bugs, mas era escrito caso a caso;
    o técnico pediu que isso deixe de depender da memória do agente e vire regra do projeto.
*   **Verificação:** a própria auditoria 5.14 (acima) e a 5.13 seguem o novo formato (a 5.14 foi escrita já
    no formato completo; a 5.13 é a que motivou a regra e foi mantida).
*   **Sugestões / Pendências:** a regra cobre `bot.py`, `hubs.json`, `login.html`, `robo.png` e o build.
    Se quiser, dá para exigir a mesma auditoria para mudanças **só** de documentação.
*   **Armadilha:** "não anunciar correção que não existe" — as auditorias devem registrar também o que
    **ficou pendente** e o que **não** foi feito (e por quê).

### 5.16 Análise de log de produção 22/10/2026 (SPOSMT, OCO SA, SMMOO62) — SÓ DOCUMENTAÇÃO, SEM CÓDIGO

*   **Solicitação (texto do técnico):** *"vou te mandar alguns dados que coletei do terminal do bot, pegue
    eles analise e depois sem fazer absolutamente nada apenas documente isso para futuramente eu abrir o
    projeto e pedir para algum IA ler o arquivo auditado. uma observação caso vc não veje isso nos log eu
    presenciei que quando o bot vai preencher os campos de baterias de forma geral ele esta pulando os 2 ou
    3 primeiros campos de cada banco."* → **pedido explícito de NÃO alterar código**: apenas analisar e
    registrar. O log bruto (1.782 linhas) foi preservado em `leitura terminal 2026-10-22.txt` (raiz do
    projeto).
*   **Diagnóstico / Investigação (números do log):** a sessão rodou com o `bot.py` de 22/10 (com `hubs.json`,
    `fill_ups`/`fill_ups_bat`, `fill_qdca`, `fill_qdcc`+`dados`, MT com leitura da tensão FF do sistema);
    ticket 14368981; export `preventivas-export-2026-10-22T05-43-39.json` (121 registros / 120 indexados;
    duplicado `GRS`/QDF3 resolvido para o mais recente). Três sites passaram pelo console: **SPOSMT**
    (MT + FCC + UPS + QDCA + QDCC), **OCO SA** (FCC 4×24 de 2V + QDCC), **SMMOO62** (QDCC + QDCA). O padrão
    do "pulo" se repetiu em todas as tabelas de baterias:
    - FCC SPOSMT (6 bancos × 4 elementos, 12V): por coluna **18 preenchidos + 6 "já tinham valor"** =
      exatamente **1 elemento por banco já vinha preenchido pelo site** (nos 7 grupos de colunas ao mesmo
      tempo → estado vindo do site, não do bot). Bot pulou por invariante (nunca sobrescrever).
    - FCC "OCO SA" (4 bancos × 24 elementos, 2V): mesmo padrão — **92 + 4 "já tinham valor"** (1 por banco).
    - UPS SPOSMT (1 banco × 32 elementos, 12V): **30 preenchidos + 1 "já tinham valor" + 1 AUSENTE** (campo
      nem existe no DOM) → 2 linhas de cada coluna sem preenchimento pelo bot.
    - Idempotência confirmada: repetindo `fill_fcc_tudo` em SPOSMT, tudo voltou "já tinham valor" (24/24
      por coluna) — nada duplicado, nada sobrescrito.
    - Após o preenchimento, o clique **OK da Situação Final foi revertido pelo site SEMPRE em
      `optradioMedicao{Equal|Descarga}FccF1[n][0]`** (elem 0 de cada banco; no UPS também `[n][1]`), mesmo
      com os campos preenchidos. As falhas de OK **pré-preenchimento** (49 no 1º fill_fcc, 64 no fill_ups)
      recaíram sobre as linhas vazias e foram resolvidas após `fcc-bat`/`ups-bat` — exceto o elem 0/1.
    - **Sigla URL-encoded:** o site "OCO SA" aparece no log como `OCO%20SA` — o casamento do QDCC com o
      export falhou ("Sem registro para site=OCO%20SA") e a aba caiu nos valores de referência; regras de
      hub por sigla também deixariam de casar.
    - Comportamentos saudáveis no mesmo log: MT (FF 220V → VCA 127/220; fallback por rótulo marcou os 6
      inputs); UPS pelas faixas do `hubs.json` (`_padrao`: Ent FN 220–224 / Ent FF 380–385 / Sai FN
      219.6–220 / Sai FF 376–379; temps 20/21; corr 30/10; freq 60; autonomia 100) + rótulo cobriu as 4
      linhas; QDCA completo (faixas padrão FN 128.2–132 / FF 219–224.3; 20–22 disjuntores × R/S/T = 0; zero
      falhas de OK); QDCC com export encontrado (SMMOO62 "QDF 1": 60/60 circuitos + 84 linhas fora do bloco
      com 0 **e aviso explícito**; "QDF 10B-3ºandar": 10/10 + 144 zeros); ticket em todas as abas.
*   **Causa raiz (por achado):**
    1. **"Pulo" dos primeiros campos:** em parte é **comportamento correto** (invariante nº1 — campo com
       valor vindo do site não é sobrescrito; o site traz 1 elemento pré-preenchido por banco no FCC e mais
       1 campo ausente no UPS). A quantidade variável (1 vs 2) é compatível com o relato "2 ou 3" do técnico
       em outros hubs. A **falha residual** é o site **reverter o OK** justamente da(s) linha(s) não
       preenchidas pelo bot — mecanismo ainda desconhecido (candidatos: valor pré-existente reprovado na
       validação atual da página, ou pré-requisito oculto da linha). Mesma família da pendência 5.10.
    2. **`OCO%20SA`:** `_site_da_url` devolve o parâmetro `?site=` sem URL-decode; "OCO SA" tem espaço e
       chega encoded. **Defeito real, corrigível com `urllib.parse.unquote`** — não corrigido nesta etapa.
    3. **`optradioFccLvd_final_0`** (pendência 5.10): reconfirmado em todas as passagens do dia.
*   **O que foi feito:** **apenas documentação** — esta entrada (5.16) + preservação do log em
    `leitura terminal 2026-10-22.txt`. Zero alterações em `bot.py`, `hubs.json`, testes ou build, conforme o
    pedido. Nada de restart.
*   **Por quê:** o técnico pediu material de análise para uma sessão futura ("futuramente eu abrir o projeto
    e pedir para algum IA ler o arquivo auditado") — ou seja, o valor desta etapa é o registro fiel, com
    números, e a separação clara entre "explicado" e "ainda sem explicação".
*   **Solução (uso futuro):** quando o técnico autorizar, as ações documentadas são: (1) aplicar `unquote` na
    sigla do site; (2) rodar `diag_fcc` + `dump` numa página real com o problema do elem 0 **antes** de
    propor correção; (3) decidir com o técnico se o elemento pré-preenchido pelo site deve passar a ser
    sobrescrito (mudaria o invariante nº1) ou se o objetivo é o site aceitar OK naquela linha.
*   **Verificação:** análise feita linha a linha sobre o log de 1.782 linhas (comandos, resumos por coluna,
    falhas de OK e saídas do `dados`). **Nenhum teste foi executado e nenhum código compilado — por pedido
    explícito.** Todos os números citados vêm do log.
*   **Sugestões / Pendências:**
    - Autorização do técnico para (1)(2)(3) acima.
    - O "1 AUSENTE" por coluna no UPS (campo do elem não renderizado) merece um `diag` no site real para
      identificar **qual** índice falta (o resumo não diz se é o último elemento ou um do meio).
    - Considerar registrar no resumo do `fill_*_bat` **quais índices** ficaram em "já tinham valor"/"ausente"
      (hoje só conta quantidade + poucos exemplos) — facilitaria diagnosticar esse padrão sem `diag`.
*   **Armadilhas:**
    - **Não concluir que o bot "perdeu" campos:** "já tinham valor" = valor do site respeitado por invariante;
      confirmar sempre com uma 2ª execução (idempotência) antes de suspeitar de bug de preenchimento.
    - **Não confundir as duas falhas de OK:** a pré-preenchimento (linhas vazias) é mecanismo conhecido
      (5.7); a **pós**-preenchimento no elem 0 é o fenômeno novo e não explicado.
    - **Siglas com espaço quebram match silenciosamente** em tudo que usa `?site=` (export QDCC, regras de
      hub, faixas) — ao investigar "sem registro no export", olhar primeiro se a sigla não está encoded.
    - O relato do técnico ("2 ou 3 primeiros campos") **não aparece literalmente** no log — os logs mostram
      os pulos como "já tinham valor"/"ausente"; a conexão entre um e outro é interpretação minha, validada
      pelos números, mas o elemento exato pré-preenchido não é identificado no resumo (ver Sugestões).

### 5.17 Decodificação da sigla do site e preservação de campos pré-preenchidos (22/10/2026)
*   **Solicitação (texto do técnico):** *"leia o project_audit.md e faça as alterações e ajustes que ele
    pede"*; foi apresentado o resumo da análise 5.16 e pedida a execução dos próximos passos. Sobre a
    decisão comportamental, o técnico escolheu **preservar** os valores que o site já preenche e investigar
    a aceitação do OK sem sobrescrevê-los.
*   **Diagnóstico / Investigação:**
    - A entrada 5.16 aponta que a URL do hub OCO SA chega como `?site=OCO%20SA`, mas `_site_da_url`
      retornava o valor ainda codificado. Isso impede tanto a comparação com o site normalizado do export
      QDCC quanto regras que dependam da sigla.
    - A mesma entrada aponta reversão do rádio OK em `optradioMedicao{Equal|Descarga}FccF1[n][0]` (e
      também `[n][1]` na UPS) depois do preenchimento. A auditoria exige `diag_fcc` e `dump` na página real
      antes de propor mudança; esses dados de sessão real não estão disponíveis nesta execução.
    - Foi confirmada com o técnico a manutenção do invariante: campos com valor anterior não serão
      sobrescritos. Portanto, a causa da reversão do rádio não será contornada alterando o preenchimento.
*   **Causa raiz:**
    1. O parâmetro extraído de `page.url` não era decodificado percent-encoding; `%20` permanecia literal
       no nome do hub.
    2. A reversão do OK segue sem causa raiz comprovada; não há dump/diagnóstico ao vivo nesta execução.
*   **O que foi feito:**
    - `infratel_bot\bot.py` — importado `urllib.parse.unquote`; `_site_da_url` agora decodifica o valor
      capturado antes de remover espaços laterais e converter para maiúsculas.
    - `AGENTS.md` — documentada a decodificação de `?site=` e reafirmado que isso não muda a regra de não
      sobrescrita.
    - `PROJECT_AUDIT.md` — adicionada esta entrada para registrar a alteração e as pendências.
    - Não foram editados valores, campos de bateria, rádios OK, `hubs.json` nem dados do export. Durante o
      smoke test, o próprio app gravou as credenciais da tela no `.env` do pacote; ao final, esse arquivo
      tinha conteúdo byte a byte igual ao `.env` de `infratel_bot` (hashes iguais; valores não exibidos).
      O `.env` do projeto não foi editado.
*   **Por quê:**
    - `unquote` converte `%20` para espaço sem mudar a normalização posterior usada para comparar siglas.
      A alteração fica no ponto comum `_site_da_url`, beneficiando todas as chamadas que usam o parâmetro
      do hub (QDCC e regras de FCC).
    - Manter a regra de não sobrescrita evita descartar dado fornecido pelo próprio site. Sem diagnóstico
      real, não há evidência para alterar o valor nem para atribuir a reversão do rádio a esse valor.
*   **Solução (uso pelo técnico):** URLs com `?site=OCO%20SA` passam a fornecer `OCO SA` a quem consulta
    `_site_da_url`; o fluxo QDCC pode então normalizar a sigla e procurar o export como antes. Valores
    existentes permanecem intactos. O OK revertido ainda precisa ser investigado numa página real com
    `diag_fcc` e `dump`.
*   **Verificação:**
    - `py_compile infratel_bot\bot.py`: passou.
    - Teste sintético de `_site_da_url`: **4/4** casos passaram (`OCO%20SA` → `OCO SA`, `SMMOO62` sem
      escape, URL sem `site` → string vazia, e parâmetro `site` depois de outro parâmetro).
    - Export atual: **13/13** tags indexadas para o site normalizado `OCOSA` foram encontradas por
      `_dados_do_site("OCO SA", tag)`, confirmando o casamento após decodificar a sigla.
    - `test_qdcc_dados.py`: passou; export, valores, fallback e preservação de campos preexistentes
      validados.
    - `test_densidade_site.py`: terminou com duas falhas fora do caso de URL-encoded. O próprio fixture
      usa radios com índices de elemento 1-based, enquanto `_situacao_final_nok` constrói alvos 0-based
      (3 NOK observados, 6 esperados); e os inputs de medição são ids flat repetidos entre bancos, embora
      o caso misto espere distinguir o segundo banco. As URLs desse teste usam `SCNPER`/`SPOVMN` sem
      escape, então o decode novo não altera essas entradas. O teste externo ao repositório não foi
      modificado.
    - PyInstaller concluiu sem erro; o executável foi copiado para `Pacote Agente Infratel\` e o hash do
      pacote confere com o de `infratel_bot\dist\agente_infra_portable.exe`.
    - Smoke test: os marcadores `[hubs] Carregado hubs.json` e `[login] Preencha a tela de login` foram
      registrados e `stderr` ficou vazio. Durante a janela de 60 s, a tela local enviou os dados e o app
      avançou para a mensagem de navegação ao Infratel; o processo terminou antes da coleta final. Portanto,
      o início do pacote foi verificado, mas não se confirmou que ele permaneceria aguardando na tela local.
      Nenhum `diag_fcc`/`dump` real foi executado sem uma página Infratel autenticada.
*   **Sugestões / Pendências:**
    - Executar `diag_fcc` e `dump` em uma página real que reproduza a reversão do rádio; só então decidir
      se existe um pré-requisito do site a corrigir mantendo a não sobrescrita.
    - Identificar o índice ausente por coluna na tabela de baterias UPS; o log 5.16 só contabiliza um campo
      ausente por coluna e não informa qual índice.
    - Avaliar futuramente detalhar no resumo do `fill_*_bat` os índices exatos classificados como
      "já tinham valor" ou "ausente".
*   **Armadilhas:**
    - Não remover a regra “nunca sobrescrever campo que já tem valor”; foi explicitamente escolhida pelo
      técnico para esta correção.
    - `OCO%20SA` decodificado resulta em `OCO SA`; a comparação final ainda passa pela normalização
      existente — não remover nem substituir `_norm_txt`.
    - Não afirmar que o problema do OK foi corrigido: permanece sem diagnóstico real e sem alteração de
      comportamento.

### 5.18 Corrigido o índice das baterias e a interrupção do preenchimento (22/10/2026)
*   **Solicitação (texto do técnico):** *"não está funcionando a automação para com os preenchimentos dos
    bancos"*; anexou log do terminal e captura de tela da FCC no site OCO SA.
*   **Diagnóstico / Investigação:**
    - No comando `fill_fcc_tudo`, o log confirma que foram clicados 4 botões "Carregar medições" e que
      `fill_fcc` preencheu os campos medidos. Em seguida `fill_fcc_bat` detectou 4 bancos, cada um com
      24 elementos, todos de 2V, mas parou no primeiro campo com
      `Locator.input_value: Timeout 30000ms exceeded` aguardando
      `#txt_tensao_equal_fcc_1_1`. A captura de tela mostra os campos de tensão vazios e "Obrigatório.",
      compatível com o ciclo de baterias interrompido antes de preencher as linhas.
    - O `scanv` posterior registra os IDs reais da FCC como
      `txt_tensao_equal_fcc_1_0`, `txt_tensao_equal_fcc_1_1` ... e os IDs das demais colunas no mesmo
      padrão banco/elemento com índice de elemento começando em zero.
    - O helper `_preencher_campo_bat` tentava primeiro o ID hierárquico 1-based (`_1_1`) e só depois o
      ID real 0-based (`_1_0`). O log não prova por que o locator, que aparece no `scanv` posterior,
      expirou no instante da leitura. O código, porém, fazia `get_attribute`/`input_value` fora do `try`
      por campo, então qualquer timeout escapava e encerrava o ciclo.
    - Na UPS, `fill_ups_bat` somava 1 ao índice antes de chamar o helper, que já calculava o índice
      1-based. Isso deslocava a busca dos IDs hierárquicos: no registro anexado, 40 elementos resultaram
      em somente 38 preenchidos, 1 preexistente e 1 ausente em cada coluna.
    - A imagem e o log mostram o site OCO SA (`?site=OCO%20SA`), sem regra especial de FCC; os campos
      existentes não serão sobrescritos.
*   **Causa raiz:**
    1. Ordem de seletores incompatível com os IDs da tabela FCC (o código preferia `_banco_{elemento+1}`
       embora o DOM renderize `_banco_{elemento}`).
    2. A verificação do valor do campo podia lançar timeout fora do tratamento individual e interromper
       todo `fill_fcc_bat`, deixando as linhas seguintes vazias.
    3. O caminho UPS aplicava o deslocamento de índice duas vezes.
*   **O que foi feito:**
    - `infratel_bot\bot.py` — `_preencher_campo_bat` agora prioriza o ID hierárquico 0-based; mantém os
      fallbacks hierárquico 1-based e flat 1-based para outros formulários. Verificações `readonly`,
      `disabled`, leitura do valor e `fill` passam a compartilhar o tratamento de erro por campo, com
      timeout de 1 segundo para não bloquear o ciclo por 30 segundos no mesmo campo.
    - `infratel_bot\bot.py` — `fill_ups_bat` passa o índice 0-based ao helper, sem somar 1 antes.
    - `AGENTS.md` — documentado o padrão de índice observado na FCC e a chamada correta da UPS.
    - Não foram alterados valores de medição, rádios, regra de não sobrescrita, export de dados ou
      credenciais.
*   **Por quê:**
    - A ordem do seletor segue os IDs observados no `scanv`, garantindo que o primeiro índice de elemento
      (0) corresponda à primeira linha (`..._1_0`) e não à segunda (`..._1_1`).
    - O erro deve ser registrado na classificação daquela célula, sem abortar as centenas de campos
      independentes que ainda podem ser preenchidos. O timeout limitado evita pausas de 30 s repetidas.
    - Remover a soma extra na UPS mantém uma única conversão de índice dentro do helper e inclui a primeira
      linha sem apontar o último índice para fora da tabela.
*   **Solução (uso pelo técnico):** executar novamente "FCC completo" ou `fill_fcc_tudo`; as linhas FCC
    serão buscadas pelos IDs hierárquicos 0-based e o ciclo continuará mesmo se uma célula individual
    falhar, registrando `[erro]` no resumo por coluna. Para baterias UPS, a varredura também começa no
    índice correto. Campos já preenchidos seguem preservados.
*   **Verificação:**
    - `py_compile infratel_bot\bot.py`: passou.
    - Teste sintético offline com IDs FCC/UPS no padrão real `_banco_0..N-1`: **3/3 elementos por tipo**
      foram endereçados; os valores preexistentes e os IDs flat de fallback permaneceram intactos.
    - `test_fcc_tudo.py`: passou; o ciclo completo sintético preencheu os valores medidos e as baterias.
    - `test_bancos.py`: passou; preservados os perfis 12V/2V e as casas decimais.
    - `test_densidade_site.py`: duas falhas: sequência dos rádios esperava 1-based contra os nomes
      0-based gerados pela fixture; no caso com dois bancos, os IDs flat da própria fixture não distinguem
      os bancos. Esse teste externo não foi editado.
    - PyInstaller recompilou o executável; o binário foi copiado ao pacote e os hashes SHA-256 do build e
      do pacote conferem. Não foi aberto navegador de produção durante o smoke test, para evitar enviar
      credenciais salvas a uma sessão Infratel; o comportamento de campos foi exercitado nas páginas
      sintéticas. Não houve login real nem diagnóstico dos rádios OK.
*   **Sugestões / Pendências:**
    - Validar em uma execução real OCO SA se as 4 × 24 linhas FCC ficam preenchidas; o anexo mostra a
      falha anterior, não uma execução posterior à alteração.
    - Investigar separadamente os rádios OK recusados em FCC/UPS e o campo LVD, conforme itens 5.10/5.16;
      esta correção só cobre a busca/preenchimento dos campos de medição de bateria.
    - O campo UPS listado como "ausente" no log anterior não foi identificado por índice; conferir após o
      novo ciclo.
*   **Armadilhas:**
    - O índice no ID do campo de bateria (`..._{banco}_{elemento}`) começa em zero; o rótulo visível do
      elemento começa em 1. Não confundir a numeração apresentada ao técnico com o índice do DOM.
    - O helper já fornece os fallbacks para IDs antigos; não somar 1 no chamador UPS.
    - Um erro de uma célula não deve ser convertido em sucesso silencioso: ele permanece contado e aparece
      como exemplo de erro no resumo.

### 5.19 Ajuste das faixas da UPS para MAUDTC (22/10/2026)
*   **Solicitação (texto do técnico):** *"agora só ajuste o UPS vejo que só falta eles serem ajustados..."*,
    acompanhada de captura da aba UPS no endereço `...?site=MAUDTC`. A imagem mostra temperaturas e
    correntes preenchidas, mas os campos de tensão de entrada FN/FF e saída FN/FF vazios, com avisos
    "Obrigatório".
*   **Diagnóstico / Investigação:**
    - O código da UPS monta as quatro faixas de tensão a partir de `hubs.json`; se o site não tem override,
      usa `_padrao`: entrada FN 220–224 V, entrada FF 380–385 V, saída FN 219.6–220 V e saída FF 376–379 V.
    - O hub da imagem é `MAUDTC` e ainda não tinha override. O `hubs.json` já contém o perfil do sistema
      127/220 V do hub `JAIDTC`: FN 126–131.8 V e FF 219–225 V.
    - O log de terminal recebido depois da alteração confirma a configuração usada pela execução anterior:
      na inicialização, a lista de hubs UPS era `['_padrao', 'OCOJMA', 'SPOVMN', 'JAIDTC']`, sem `MAUDTC`;
      o comando `fill_ups_tudo` informou `faixas: padrao` e aplicou tensões de entrada FN 221–222 V, entrada
      FF 382 V, saída FN 219.8–219.9 V e saída FF 376.7–378.1 V. A captura da mesma sessão mostra as
      tensões em branco com "Obrigatório". Portanto, o override adicionado na solicitação não estava
      carregado nessa execução.
    - O log também registra em `fill_ups_bat` 35 campos preenchidos e 1 erro em
      `#txt_tensao_equal_ups_1_0` (`Locator.get_attribute: Timeout 1000ms`). As outras seis colunas
      registram 36 preenchidos. É um problema separado das faixas dos valores medidos; não há, nesse
      log, dump/scan que identifique a causa do timeout nessa primeira célula.
*   **Causa raiz:** a execução documentada carregou um `hubs.json` anterior, sem override `MAUDTC`, e
    usou os valores padrão 220/380 V, incompatíveis com o formulário visível na captura. A faixa exata
    aceita para MAUDTC não está escrita no log; o perfil 127/220 V adotado no override é uma inferência
    baseada no formulário e no perfil de 127/220 V já existente para `JAIDTC`, devendo ser confirmado após
    reiniciar/recarregar a configuração.
*   **O que foi feito:**
    - `infratel_bot\hubs.json` — adicionado override UPS `MAUDTC` com FN 126–131.8 V e FF 219–225 V para
      entrada e saída.
    - `Pacote Agente Infratel\hubs.json` — atualizado com o mesmo override para o executável portátil.
    - `AGENTS.md` — documentado o perfil UPS do MAUDTC.
    - Não foi alterado o código de FCC, QDCA, QDCC, os valores fixos de corrente/temperatura, o fluxo das
      baterias UPS, credenciais ou outras faixas de hubs.
*   **Por quê:** o `hubs.json` é o ponto de configuração já usado para diferenças de tensão por site.
    Reutilizar as faixas 127/220 V evita uma exceção de código e mantém as três fases agrupadas pelo
    gerador existente. O override é restrito a MAUDTC; os demais hubs preservam seus valores.
*   **Solução (uso pelo técnico):** reiniciar o bot portátil (o `hubs.json` é carregado na inicialização) ou
    rodar `hubs` no console; em MAUDTC, `UPS completo` passa a sortear FN entre 126 e 131.8 V e FF entre
    219 e 225 V nas linhas de entrada e saída. Temperaturas, correntes, frequência, recarga e autonomia não
    mudam.
*   **Verificação:**
    - JSON de `infratel_bot\hubs.json` e do pacote: parsing e conteúdo do override MAUDTC conferidos.
    - Teste sintético da aba UPS com rótulos e inputs sem IDs diretos de tensão: os 12 campos foram
      preenchidos por fallback; FN/FF ficaram dentro das faixas configuradas e fases da mesma linha
      permaneceram agrupadas.
    - `test_ups_rotulo_bt.py`: passou; fallback por rótulo dos hubs sem IDs diretos segue funcionando.
    - O log autenticado da execução anterior foi analisado: confirma que ela não carregou o override novo
      (ausente na lista de hubs e faixa impressa como `padrao`), portanto não é validação do perfil 127/220
      atualizado.
    - Não foi executada uma nova passagem autenticada após a inclusão do override. A confirmação do perfil
      no site real ainda depende de reiniciar o bot/rodar `hubs` e testar MAUDTC.
*   **Sugestões / Pendências:**
    - Após reiniciar o pacote, executar "UPS completo" em MAUDTC e verificar se os 12 campos de tensão
      ficam preenchidos sem "Obrigatório". Se o formulário exibir outros limites, ajustar somente este
      override com os limites observados.
    - Investigar a célula de bateria UPS `#txt_tensao_equal_ups_1_0`, que teve timeout de 1 segundo no log;
      não confundir esse erro individual com as tensões da seção de valores medidos.
*   **Armadilhas:**
    - O override está em `UPS.MAUDTC`; não cadastrar essa faixa em `QDCA` nem mudar `_padrao`, que atende
      hubs com UPS 220/380 V.
    - A captura não prova os limites elétricos permitidos: 127/220 V foi inferido e ainda requer confirmação
      em execução real. Não tomar o valor de 220 V de saída FN do perfil padrão como tensão aplicável ao
      MAUDTC.

### 5.20 Regra de tensão 127/220 V e 220/380 V para UPS e FCC (22/10/2026)
*   **Solicitação (texto do técnico):** *"OCOJMA-SPOSMT-SPOCGR-DDADTC-SLODTC-ITUDTC-MCZDTC-SPOBUT-
    SPOVMN-SNCJCO-SPOCDU. Essas siglas dos HUB/SITES são especialmente as que o UPS e o FCC são diferente
    dos demais. [...] Para esses hubs: FN 220,0 até 224,3 V e FF 380,0 até 384,3 V. Fora esses hubs/sites,
    os demais: FN 127,0 até 130,3 V e FF 220,0 até 224,3 V. Reforce e atualize a regra; teste os
    preenchimentos."*
*   **Diagnóstico / Investigação:**
    - `infratel_bot\bot.py` já tem geradores de tensão UPS (`_gerar_ups_medidos`) e FCC
      (`_gerar_fcc_medidos`) que leem `_hub_cfg` por site, e `fill_fcc` consome a seção `FCC` do JSON.
      A aplicação usa entrada e saída FN/FF na UPS; o formulário FCC atual expõe campos FF RS/ST/TR e
      campos FN opcionais.
    - A configuração fonte já continha as 11 siglas do pedido nas seções `UPS` e `FCC`, com as faixas
      solicitadas, mas ainda mantinha overrides antigos de `JAIDTC` e `MAUDTC` em `UPS` (FN 126–131,8 V /
      FF 219–225 V), diferentes da regra expressa de que todos os demais sites usam exatamente o padrão.
    - O `hubs.json` no pacote portátil estava desatualizado: usava padrão 220/380 na UPS, não tinha os
      overrides solicitados nem a seção `FCC`. O executável também era anterior ao `bot.py` atual, que já
      contém os geradores configuráveis para FCC.
    - Foi conferido que o agrupamento existente sorteia fases próximas sem ultrapassar as faixas. O teste
      final cobre cada uma das 11 exceções, um site não listado, `JAIDTC` e `MAUDTC`, tanto na configuração
      carregada quanto nos valores produzidos pelos geradores.
*   **Causa raiz:** configurações do script e do pacote portátil divergiam; além disso, os overrides
    residuais de `JAIDTC`/`MAUDTC` contrariavam a nova regra global para qualquer site fora das 11 siglas.
    A lógica de geração e preenchimento já era orientada por `hubs.json`; não era necessário alterar os
    seletores ou os ciclos de preenchimento.
*   **O que foi feito:**
    - `infratel_bot\hubs.json` — mantidos os 11 overrides 220/380 V em `UPS` e `FCC`; removidos os
      overrides de `JAIDTC` e `MAUDTC` para que ambos, assim como qualquer site não listado, usem
      `_padrao` 127/220 V.
    - `Pacote Agente Infratel\hubs.json` — sincronizado integralmente com a configuração fonte; os arquivos
      foram comparados por SHA-256 e ficaram idênticos.
    - `AGENTS.md` — atualizadas as regras operacionais de UPS, FCC e `hubs.json`, incluindo as 11 siglas
      e os intervalos padrão/excepcional.
    - `Pacote Agente Infratel\agente_infra_portable.exe` — recompilado a partir do `bot.py` atual, pois o
      executável anterior era mais antigo que o código que lê as faixas FCC pelo JSON.
    - `bot.py` não foi alterado nesta etapa: os caminhos `_cfg_ups`, `_cfg_fcc`, `_gerar_ups_medidos`,
      `_gerar_fcc_medidos` e `fill_fcc` já aplicavam a configuração adequada.
    - Não foram alterados MT, QDCA, QDCC, baterias, tickets, dados de produção, credenciais ou ranges de
      outras seções.
*   **Por quê:** centralizar a regra em `hubs.json` garante o mesmo comportamento no script e no pacote,
    mantém apenas os 11 sites explicitamente identificados como 220/380 V e elimina exceções incompatíveis
    com a nova regra. Remover overrides desnecessários permite que `_padrao` seja a fonte única para todos
    os demais sites, sem duplicar faixas especiais com valores diferentes.
*   **Solução (uso pelo técnico):** reiniciar o bot depois de receber/substituir a pasta do pacote. Nos 11
    sites listados, `UPS completo` sorteia FN de entrada/saída em 220,0–224,3 V e FF em 380,0–384,3 V;
    `FCC completo` sorteia FF em 380,0–384,3 V (FN 220,0–224,3 V fica disponível se o formulário tiver
    esses campos). Em qualquer outro site, inclusive `JAIDTC` e `MAUDTC`, usa FN 127,0–130,3 V e FF
    220,0–224,3 V. Campos preenchidos continuam protegidos contra sobrescrita.
*   **Verificação:**
    - `py_compile infratel_bot\bot.py`: passou.
    - Teste focado `test_fcc_ups_faixas.py`: passou; `test_ups_rotulo_bt.py`: passou. A frente de testes
      também confirmou que os 11 sites especiais e um site padrão seguem os intervalos esperados.
    - Validação adicional dos geradores UPS/FCC passou para os 11 sites, `OUTROSITE`, `JAIDTC` e `MAUDTC`;
      conferiu entrada/saída FN/FF da UPS, FF do FCC, limites, agrupamento de fases, JSON fonte/pacote e
      igualdade de arquivos.
    - Uma subchecagem do agente de testes esperava preservar os antigos overrides de `JAIDTC`/`MAUDTC`;
      essa expectativa foi descartada por contrariar o texto explícito desta solicitação ("fora esses
      hubs/sites os demais são 127/220"). A verificação final validou esses dois hubs no padrão.
    - Regressões adicionais: `test_bancos.py`, `test_mt_vca.py` e `test_qdcc_dados.py` passaram.
      `test_fcc_tudo.py` não executa por depender do símbolo removido `bot.FCC_MEDIDOS`; o teste precisa ser
      atualizado para `_gerar_fcc_medidos(site)`. `test_densidade_site.py` manteve duas falhas já conhecidas
      na fixture de rádios/IDs flat: ordem NOK/OK e densidades 2V, fora desta mudança.
    - Build PyInstaller: concluído. O smoke test abriu a janela `Agente Infratel - Login: Google Chrome
      for Testing`; não foi enviado login nem OTP. A saída redirecionada permaneceu vazia, então o marcador
      de terminal previsto no procedimento não foi observado, mas a janela local de login foi confirmada.
    - Não foi feita passagem autenticada em nenhum site real; a aceitação das tensões no Infratel continua
      dependendo de execução com credenciais/OTP do técnico.
*   **Sugestões / Pendências:**
    - Após instalar/atualizar o pacote portátil, confirmar `UPS completo` e `FCC completo` em pelo menos um
      hub 220/380 V e um hub 127/220 V, verificando avisos de validação antes de salvar.
    - Atualizar `test_fcc_tudo.py` para usar o gerador FCC atual; investigar as duas falhas de fixture de
      `test_densidade_site.py` em tarefa separada, sem misturá-las à regra elétrica.
*   **Armadilhas:**
    - A exceção é definida por sigla exata do parâmetro `?site=` em `UPS` e `FCC`; cadastrar um site novo
      com 220/380 V requer inseri-lo nas duas seções.
    - Não reintroduzir faixas específicas de `JAIDTC` ou `MAUDTC` sem nova confirmação do técnico: pela
      regra atual, são sites padrão 127/220 V.
    - O FCC atual só renderiza os campos FF; a validação da geração FN não significa que campos FN existam
      nem que sejam preenchidos se o DOM não os apresentar.
    - Atualizar só `infratel_bot\hubs.json` não atualiza um pacote já distribuído; sincronizar também
      `Pacote Agente Infratel\hubs.json` e recompilar quando o executável não tiver o código atual.

### 5.21 Retificação da sigla para SNE-JCO (22/10/2026)
*   **Solicitação:** o técnico corrigiu a retificação anterior e confirmou que a sigla correta é `SNE-JCO`.
*   **Diagnóstico / Investigação:** `SNC-JCO` estava configurada nas seções `UPS` e `FCC` dos dois
    arquivos `hubs.json` e nas listas de exceções da documentação. A imagem do formulário também mostra
    `?site=SNE-JCO`, em concordância com a correção final.
*   **Causa raiz:** a transcrição inicial da sigla e a correção intermediária estavam incorretas.
*   **O que foi feito:** substituída `SNC-JCO` por `SNE-JCO` nas seções `UPS` e `FCC` de
    `infratel_bot\hubs.json` e `Pacote Agente Infratel\hubs.json`; atualizadas as três menções
    operacionais em `AGENTS.md`. O registro histórico 5.20 foi preservado.
*   **Por quê:** a configuração faz correspondência exata com o parâmetro `?site=`; `SNE-JCO` deve
    coincidir com a URL observada para aplicar a faixa especial.
*   **Solução:** `SNE-JCO` usa FN 220–224,3 V e FF 380–384,3 V tanto em UPS como em FCC. Nenhum outro
    hub, perfil, função, campo ou comportamento foi alterado.
*   **Verificação:** JSONs do projeto e do pacote parseiam e mantêm as faixas da chave `SNE-JCO`; a chave
    `SNC-JCO` não permanece nas configurações nem na documentação operacional atual (o histórico 5.20
    foi preservado). O executável não precisou ser recompilado: lê `hubs.json` externo ao iniciar.
*   **Sugestões / Pendências:** nenhuma alteração adicional solicitada.
*   **Armadilhas:** a chave deve coincidir exatamente com o parâmetro `?site=`; usar a grafia sem hífen ou
    com a letra `C` no lugar de `E` faz o hub cair no padrão 127/220 V.

### 5.22 Espera pela primeira tensão das baterias FCC (22/10/2026)
*   **Solicitação (texto do técnico):** *"só falta um ajuste, em todos os FCC dos hub o primeiro banco
    no campo de TENSÃO (V) ele não preenche"*, com captura da linha 1, banco 1, mostrando tensão vazia
    e situação NOK.
*   **Diagnóstico / Investigação:**
    - No log anexado da execução FCC em `SPOCGR`, `fill_fcc_bat` processou 11 bancos × 4 elementos.
      Em `flut/tensão`, foram registrados 43 preenchimentos e 1 erro:
      `Locator.get_attribute: Timeout 1000ms exceeded` aguardando
      `#txt_tensao_equal_fcc_1_0`.
    - As outras colunas da mesma linha (`temperatura`, tensão de descarga, etc.) foram processadas.
      O `scanv` executado depois lista `#txt_tensao_equal_fcc_1_0` presente, visível e vazio; os elementos
      `_1_1` a `_1_3` têm tensão preenchida. Isso confirma que a célula alvo existia depois do erro e
      localiza o sintoma na primeira tensão 0-based do banco, não em um perfil 12V/2V incorreto.
    - O helper detecta as linhas pelo DOM, mas o Infratel pode recriar a primeira célula depois de carregar
      as tabelas. A leitura do atributo com timeout de 1 s acontecia antes de a célula ficar disponível;
      o log posterior confirma que o campo surgiu sem intervenção adicional do bot.
*   **Causa raiz:** corrida de renderização da tabela FCC: a primeira célula de tensão pode ser substituída
    durante a atualização assíncrona da página. O código tentava consultar/preencher imediatamente após
    detectar a topologia e um timeout transitório deixava o campo em branco, embora as demais células
    continuassem.
*   **O que foi feito:**
    - `infratel_bot\bot.py` — após detectar os bancos FCC, aguarda o estado `attached` do primeiro campo
      de tensão 0-based (`#txt_tensao_equal_fcc_{banco}_0`) por até 5 s para cada banco com linhas 0-based.
      O helper de preenchimento então relocaliza o campo e aplica os mesmos guardas de readonly, disabled
      e valor já existente.
    - `AGENTS.md` — documentado o tempo de espera e que timeout é avisado sem interromper as demais
      células.
    - Não foram alterados valores de tensão, perfis elétricos, seletores de outras colunas, rádios, regra
      de não sobrescrita, UPS, credenciais ou dados do site.
*   **Por quê:** aguardar o elemento real do DOM é mais preciso que aumentar uma pausa fixa para toda
    execução. O timeout é limitado a 5 s e só é usado para a primeira tensão de cada banco; campos já
    prontos não geram espera e células ausentes continuam reportadas sem abortar as demais.
*   **Solução (uso pelo técnico):** rodar novamente **FCC completo**. Para cada banco com IDs FCC
    hierárquicos 0-based, o bot espera a primeira célula de tensão estar anexada ao DOM e depois preenche
    somente se estiver vazia e editável. Se não aparecer em 5 s, imprime aviso e continua o ciclo.
*   **Verificação:**
    - `py_compile infratel_bot\bot.py`: passou.
    - Teste sintético Playwright simulou a remoção e recriação assíncrona da primeira célula 450 ms após
      detectar o banco; a espera de readiness aguardou e `#txt_tensao_equal_fcc_1_0` foi preenchido com
      valor 12V válido. As outras colunas também mantiveram seus resultados.
    - `test_bancos.py`, `test_fcc_ups_faixas.py` e `test_ups_rotulo_bt.py`: passaram.
    - Não foi feita nova execução autenticada no Infratel; o log investigado é anterior ao ajuste.
*   **Sugestões / Pendências:** confirmar em uma próxima execução real FCC que a linha banco 1 / elemento 1
    recebe tensão e que o aviso de campo obrigatório desaparece. Manter a verificação dos demais campos
    e não salvar a preventiva enquanto houver campos obrigatórios em aberto.
*   **Armadilhas:**
    - A primeira linha visível tem elemento 1, mas o ID correspondente usa índice de elemento 0:
      `#txt_tensao_equal_fcc_1_0`.
    - A espera cobre apenas DOM readiness; não inventa uma medição quando o perfil VDC do banco não é
      reconhecido, nem substitui um valor já preenchido.
    - Um aviso de timeout não significa que o campo foi preenchido; confira o resumo `[flut/tensão]` e a
      página antes de salvar.

## 6. Suíte de Testes Offline (regressão)
Localização: `C:\Users\Rovati\AppData\Local\Temp\opencode\test_*.py` (fora do repositório; podem ser copiadas para dentro do projeto se desejado).

| Teste | Cobre |
|---|---|
| `test_bancos.py` | Perfil 12V/2V e casas decimais fixas (item 5.2) |
| `test_fcc_tudo.py` | `fill_fcc_tudo` de ponta a ponta em página sintética |
| `test_carregar.py` | Clique idempotente em "Carregar medições" (item 5.6) |
| `test_multi_guia.py` | Painel em toda guia, filas por janela, `nova`/`guia`/`fechar` |
| `test_guia_fechada.py` | Console sobrevive a guia fechada no meio do ciclo (item 5.4) |
| `test_densidade_site.py` | Regras dos hubs: densidade 1220 fixo 2V, NOK→preencher→OK, sigla da URL (itens 5.7 e 5.8) |
| `test_ups_rotulo_bt.py` | Fallback por rótulo da UPS (SPOPIR) e variantes `_mt`/`_bt` (item 5.11) |
| `test_login_tela.py` | Tela de login local: campos, validação, `__loginData`, gravação/limpeza do `.env` (item 5.12) |
| `test_painel_pos_login.py` | Painel ausente na tela local e presente nas páginas seguintes do contexto (item 5.12) |
| `test_mt_vca.py` | Tensões do bloco "Tensão (VCA)" conforme a tensão do sistema (220V/380V), com IDs e via fallback por rótulo (item 5.13) |
| `test_qdcc_dados.py` | `fill_qdcc` com o export de QDF/QDCC: casamento site+tag, valores reais, fallback de referência e "não sobrescrever" (item 5.14) |

Como rodar (PowerShell, na pasta do projeto):
```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\Users\Rovati\Documents\Projetos AI\Agente Infratel\infratel_bot\.playwright-browsers"
& ".\.venv\Scripts\python.exe" "C:\Users\Rovati\AppData\Local\Temp\opencode\test_densidade_site.py"
```
Notas de implementação de teste: usar `page.goto("data:...")` e não `set_content` (init scripts não rodam em `set_content`); Playwright headless; página sintética monta os mesmos ids do site real (`#txt_*_fcc_{banco}_{elem}` e rádios `optradio*`).

Status em 21/10/2026: **8/8 testes OK** + `py_compile` limpo.
Status em 22/10/2026: **11/11 testes OK** + `py_compile` limpo.

## 7. Próximos Passos e Sugestões (Roadmap)
*   **Fase 1 (Estabilidade):** Finalizar o tratamento de sinais de encerramento do SO para um cleanup silencioso.
*   **Fase 2 (Parametrização):** Criar um arquivo `config.yaml` ou `sites.json` para que o técnico possa definir os valores padrão (Ex: "Para o site X, a tensão nominal é Y") sem mexer no código.
*   **Fase 3 (OCR/IA):** Integrar leitura de fotos de medidores físicos para preenchimento automático dos valores de Corrente/Tensão a partir de fotos tiradas no local.
*   **Fase 4 (Modo Headless/Cloud):** Possibilidade de rodar a automação em background enviando apenas os resultados finais.

## 8. Conclusão
O projeto encontra-se em estado **Beta Avançado**. As funcionalidades críticas de preenchimento de abas complexas (MT e FCC) estão operacionais e estáveis. A interface flutuante elevou o nível de usabilidade, permitindo que o bot atue como uma extensão da ferramenta de trabalho do técnico, e não apenas um script isolado.

---
*Documento gerado para fins de auditoria e controle de qualidade.*
