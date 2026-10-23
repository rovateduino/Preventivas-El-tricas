# Auditoria — Sistema Preventivas Elétricas

**Data:** 02/10/2026
**Versão auditada:** 1.0.0
**Commit no momento da auditoria:** `f54298f7`
**Repositório:** `rovateduino/Preventivas-El-tricas`

---

## 1. O que é o aplicativo

O **Preventivas Elétricas** é um sistema de desktop e web para registrar, calcular
e reportar **medições de manutenção preventiva em quadros elétricos** de sites de
telecomunicação (operadoras).

O problema que ele resolve: equipes de campo medem correntes e tensões em
quadros de força durante visitas preventivas. Esse trabalho era feito em
planilhas soltas — uma por quadro, por site, por técnico — o que gerava perda de
dados, soma manual de correntes (fonte de erro crítico em segurança elétrica),
impossibilidade de filtrar histórico e dificuldade de montar o relatório para
entregar à área responsável.

O app centraliza esse fluxo: **da medição em campo ao relatório técnico
imprimível**, sem instalação e sem depender de internet para o uso individual.

### Para quem serve

| Perfil | Uso |
|---|---|
| **Técnico de campo** | Medir e registrar em campo, inclusive sem sinal, offline |
| **Supervisor / gestor** | Filtrar histórico por site, tipo, período e ticket |
| **Área de manutenção** | Emitir o relatório impresso como comprovante da preventiva |
| **Administrador** | Controlar quem tem acesso, via convites |

---

## 2. Benefícios

### 2.1 Eliminação de erro de cálculo

Este é o benefício mais relevante. **Soma de corrente manual em quadro
energizado é a principal fonte de erro do processo anterior.** O app calcula
automaticamente:

- **Quadros QDF / QDCC** — soma por **Via A** e **Via B**, com opção de medir
  só uma via ou ambas (`App.tsx:84-85`)
- **Quadros PDT / OUTRO** — soma por **fase R, S e T**
- **Corrente total** exibida apenas quando ambas as vias foram selecionadas,
  evitando somar dados incompletos

### 2.2 Eliminação de planilha

Cada registro guarda: site, sigla, categoria, tipo de quadro, ticket,
temperatura do painel, tabela de circuitos, medições de corrente e tensão,
complemento e observação. Tudo pesquisável e filtrável, em vez de disperso em
arquivos.

### 2.3 Relatório pronto para entrega

`downloadReport()` (`App.tsx:187`) gera um **HTML autocontido** com CSS de
impressão, que abre e **dispara a impressão automaticamente**. O técnico não
monta nada manualmente: escolhe o registro, o sistema produce o documento.

### 2.4 Operação sem internet

O **Modo Local** grava em `localStorage` e funciona sem rede e sem login —
essencial em salas de equipamentos e subsolo, onde a conectividade não existe.

### 2.5 Continuity sem instalação

O executável **portable** (620,9 MB) roda direto da pasta ou pendrive, sem
instalador, sem privilégios de administrador. Numa empresa com TI restritiva,
isso é a diferença entre usar e não usar.

### 2.6 Isolamento de dados por usuário

Cada registro carrega o `uid` do dono. As consultas filtram por
`where('uid','==',uid)` (`preventivaService.ts:75`) — um técnico não enxerga
registros de outro, nem por erro de filtro.

### 2.7 Continuidade de trabalho

Como toda a lógica está no cliente e o build é portable com `base: './'`, o app
funciona em qualquer máquina Windows sem depender de instalação, versão de
runtime ou servidor de aplicação.

---

## 3. Funcionalidades

### 3.1 Tipos de quadro e modelo de medição

O comportamento do formulário muda conforme o tipo (`App.tsx:31-33`):

| Tipo | Modo de medição | Campos por circuito | Máx. circuitos |
|---|---|---|---|
| **QDF** | Via A / Via B | `viaA`, `viaB` | 200 |
| **QDCC** | Via A / Via B | `viaA`, `viaB` | 200 |
| **PDT** | Três fases | `r`, `s`, `t` | 60 |
| **OUTRO** | Três fases + nome | `r`, `s`, `t`, `nome` | 60 |

O limite é `isViaAB(tipo) ? 200 : 60` (`App.tsx:531`), forçado por
`Math.max(1, Math.min(maxCircuitos, ...))` na linha seguinte.

### 3.2 Tabelas dinâmicas

O usuário define quantos circuits o quadro tem; a tabela é gerada
automaticamente. Padrão: 8 para PDT, 13 para os demais (`App.tsx:33`).

### 3.3 Tensões condicionais

- **QDF / QDCC:** exibe apenas **Tensão DC** (`App.tsx:114-116`)
- **PDT / OUTRO:** exibe tensão por fase (R, S, T) **e** tensões compostas
  entre fases (RS, ST, TR) (`App.tsx:117-124`)

Essas tensões compostas são relevantes: em painel trifásico, a tensão entre
fases é o indicador que revela desequilíbrio de carga.

### 3.4 Soma automática de corrente

Calculada em efeito dedicado (`App.tsx:417-453`), por fase para PDT/OUTRO e por
via para QDF/QDCC.

### 3.5 Busca e filtros

Busca textual, filtro por tipo de quadro, por site e por intervalo de datas —
com contador de registros e paginação por abas.

### 3.6 CRUD completo

Criar, **editar**, visualizar e excluir. A edição (`updatePreventiva`) preserva
o registro original via `setDoc(..., { merge: true })` e atualiza `atualizadoEm`,
permitindo trilha de alteração temporal.

### 3.7 Armazenamento duplo

O seletor de modo no cabeçalho (`App.tsx:884-888`) alterna entre:

- **Local** — `localStorage`, chave `preventiva-records` (`constants.ts:1`)
- **Firebase** — coleção `preventivas`, sincronizado e isolado por usuário

### 3.8 Autenticação e controle de acesso

- **Login por e-mail e senha** via Firebase Auth (`auth.ts:4`)
- **Convites** — token de 24 bytes em `crypto.getRandomValues`, hex de 48
  caracteres (`userService.ts:6-11`), com registro único em `invites/{token}`
- **Bootstrap do primeiro admin** — `metadata/firstAdmin` só é criado se ainda
  não existir (`userService.ts:66-70`); depois disso, novos usuários exigem
  convite
- **Papéis** — `user` e `admin` (`userService.ts:4`); admin tem controles
  exclusivos de convite e limpeza em massa
- **Fora do escopo** — se o documento em `users/{uid}` não existir, a sessão é
  encerrada (`App.tsx:230`), impedindo acesso com conta órfã

### 3.9 Importação e exportação

- **JSON** — `exportToJSON` gera arquivo versionado (`version: '1.0'`) com
  `appName` e `exportedAt` (`dataExport.ts:3-21`). `importFromJSON` valida
  cada registro exigindo `id`, `data`, `site`, `tipo` e `ticket`
  (`dataExport.ts:34`), descartando os incompletos em vez de quebrar a
  importação
- **Relatório HTML** — impresso, com nome `preventiva-{sigla}-{data}.html`

### 3.10 Saída para PDF

O relatório é HTML com `@media print` (`App.tsx:143`) e **auto-impressão**,
permitindo "Salvar como PDF" pela caixa de diálogo do Windows. A partir daí não
depende de nada além do sistema operacional.

### 3.11 Limpeza em massa

Exclusão de todos os registros com barra de progresso e confirmação explícita.

---

## 4. Arquitetura e stack

### 4.1 Camadas

```
src/
├─ main.tsx                    Entry point React
├─ App.tsx (1696 linhas)       Monólito: estado, UI, cálculos, relatório
├─ components/Login.tsx        Tela de login, convites, modal "Sobre"
├─ lib/
│  ├─ firebase.ts              Inicialização App / Auth / Firestore
│  ├─ auth.ts                  Wrappers de Auth
│  ├─ preventivaService.ts     CRUD Firestore + stripUndefinedDeep
│  ├─ userService.ts           Convites, perfis, primeiro admin
│  ├─ dataExport.ts            Import/export JSON
│  └─ constants.ts             Chaves de storage
└─ types.ts                    Tipos de domínio
electron/main.cjs              Janela do Electron
```

### 4.2 Tecnologias

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React | 19 |
| Linguagem | TypeScript | — |
| Build | Vite | 6 |
| Estilo | Tailwind CSS | 4 |
| Desktop | Electron | 41 |
| Banco / Auth | Firebase Firestore + Auth | 12 |
| Ícones | lucide-react | 0.546 |
| Empacotamento | electron-builder (portable) | 26 |
| Deploy | Vercel | — |

### 4.3 Modelo de dados

`Preventiva` (`types.ts:24`):

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `string` | Gerado por `uid()` (`App.tsx:35`) |
| `uid` | `string` | Dono do registro — base do isolamento |
| `data` | `string` | `YYYY-MM-DD`, convertida em `dd/mm/aaaa` na exibição |
| `tipoQuadro` | `PDT \| QDF \| QDCC \| QDGE \| string` | Aberto para extensão |
| `tipoComplemento?` | `string` | Livre (ex.: identificação do quadro) |
| `ticket` | `string` | Número da ordem de serviço |
| `temperatura` | `number` | °C do painel |
| `site` | `Site` | `nome`, `sigla`, `categoria` |
| `circuitos` | `Circuito[]` | Tabela de medição |
| `medicaoCorrente` | `MedicaoCorrente` | `total`, `r/s/t`, `viaA/viaB`, `geral` |
| `observacao?` | `string` | Limite de 2000 caracteres (`App.tsx:1201`) |
| `criadoEm` / `atualizadoEm` | `number` | Timestamps |

**Categorias de site** (`App.tsx:11-28`): `HUB`, `SWITCH CLARO`, `CENTRAL EBT`,
`MUX EBT` — **61 sites** pré-cadastrados com sigla, evitando digitação livre e
padronizando o relatório.

### 4.4 Coleções no Firestore

| Coleção | Finalidade |
|---|---|
| `preventivas` | Registros de medição |
| `invites` | Tokens de convite (`{role, used, usedBy}`) |
| `users` | Perfis (`{uid, role, inviteToken, email}`) |
| `metadata/firstAdmin` | Trava do bootstrap de admin |

### 4.5 Decisões de build

| Configuração | Valor | Efeito |
|---|---|---|
| `vite.base` | `'./'` | Caminhos relativos — **obrigatório** para carregar via `file://` no Electron |
| `outDir` | `dist-web` | Build web, servido pela Vercel |
| `manualChunks` | 6 chunks | Firebase dividido em `core`/`auth`/`firestore`, `jspdf` e `icons` isolados |
| `asar` | padrão | App empacotado em `app.asar` |
| `compression` | `store` | Sem recompressão (rápido, maior) |
| `target` | `portable` | Sem instalação |

---

## 5. Interface

Tema **escuro com acento vermelho**, denso e orientado a leitura rápida de
números em campo — monoespaçado em todos os campos de medição (`font-mono`) para
alinhar dígitos e facilitar conferência visual.

O cabeçalho (`App.tsx:844-849`) exibe logo, título "Preventivas Elétricas" e o
seletor de modo de salvamento. Abas separam **Lista** e **Novo Registro**.
Estados de salvamento são comunicados por indicador temporário que retorna a
"idle" após 1,2 s (`App.tsx:461`).

---

## 6. Segurança

### 6.1 O que está implementado

| Controle | Onde | Eficácia |
|---|---|---|
| Senha com hash (bcrypt) | Firebase Auth | Alta |
| Isolamento por `uid` | `preventivaService.ts:75` | Alta |
| Convite obrigatório | `userService.ts:27` | Alta |
| Bootstrap travado | `userService.ts:66` | Alta |
| Sessão encerrada sem perfil | `App.tsx:230` | Alta |
| Token com `crypto.getRandomValues` | `userService.ts:8` | Alta |
| Escape de HTML no relatório | `App.tsx:66` | **Média** |
| `contextIsolation` ligado | `electron/main.cjs:9` | Alta |
| `nodeIntegration` desligado | `electron/main.cjs:8` | Alta |

O escape (`escapeHtml`, `App.tsx:66`) é aplicado de forma **inconsistente**:
apenas em `tipoComplemento` (`App.tsx:157`) e `observacao`
(`App.tsx:159`). **Nomes de site e ticket são interpolados sem escape** —
`App.tsx:150` e `App.tsx:154`. Ver seção 7.

### 6.2 Pendências

- **Sem assinatura de código** — o `.exe` não é assinado, então o SmartScreen
  alerta o usuário. Documentado no README como item em aberto.
- **Sem ícone de aplicação** — `electron-builder` usa o ícone padrão do Electron.
- **Chaves do Firebase no repositório** — `firebase-applet-config.json` está
  versionado. As regras do Firebase (não as chaves) são o que protege os dados;
  recomenda-se confirmar as regras no console.
- **Dependências** — `npm audit` reporta 16 vulnerabilidades (4 moderadas,
  12 altas), concentradas em `electron` e `electron-builder`, que **não são
  usadas no build web**.

---

## 7. Achados técnicos

Nada abaixo quebra o funcionamento atual. Estão registrados porque são riscos
latentes ou dívida que afeta a manutenção futura.

### 7.1 Injeção de HTML no relatório —severidade média

**Local:** `App.tsx:150`, `App.tsx:154`

```js
<div class="subtitle">${record.site.name} (${record.site.sigla}) — Quadro ${record.tipo}...
<tr><td>Nº Ticket</td><td>${record.ticket}</td></tr>
```

`site` vem da lista fixa, mas **`ticket` é digitado livremente** e entra sem
escape. Um ticket como `<img src=x onerror=...>` é gravado no HTML exportado.

**Agravante:** o relatório é aberto via `Blob` com o mesmo contexto do app, e
não por `window.open` isolado.

**Impacto:** baixo — o usuário precisaria abrir um HTML malicioso que ele mesmo
gerou. Não há origem remota de dados.

**Correção:** aplicar `escapeHtml` em `site.name`, `site.sigla`, `ticket` e
`tipo`, em todas as linhas de `buildReportHTML`. Uma linha por campo.

### 7.2 `app.asar` de 250 MB — dependências desnecessárias

**Local:** `package.json:11-25`

O `app.asar` inclui o `node_modules` de produção inteiro, eagerly. O problema é
que dependências **de build** estão em `dependencies`, não em `devDependencies`:

| Em `dependencies` | Uso real |
|---|---|
| `vite` | Só build |
| `@vitejs/plugin-react` | Só build |
| `@tailwindcss/vite` | Só build |
| `jspdf` + `jspdf-autotable` | **Não importados** — o relatório é HTML |
| `@google/genai` | Não usado |
| `express` | Não usado |
| `dotenv` | Não usado |

Como o Electron não faz bundle — ele empacota o `node_modules` literal — tudo
isso vai para dentro do `.exe`. Mover as três de build para
`devDependencies` e remover as quatro não usadas deve reduzir
significativamente os 620,9 MB.

### 7.3 `App.tsx` com 1696 linhas

Estado, cálculos, UI, relatório, filtros e modais em um único componente, com
~50 `useState` e tipos `any` em todo o fluxo de registros — apesar de
`types.ts` definir `Preventiva` corretamente. É o principal obstáculo a
manutenção e a testes unitários.

**Encaminhamento natural:** extrair `buildReportHTML` (já é uma função pura,
linhas 80-184), os cálculos de corrente (417-453) e os subcomponentes já
presentes no arquivo.

### 7.4 `firebase.ts` sem guarda de inicialização

```ts
const app = initializeApp(config);   // App.tsx/lib/firebase.ts:4-6
```

Não há `getApps()` antes do `initializeApp`. Sob HMR do Vite, o módulo pode ser
reexecutado e lançar erro de app duplicado. Em produção ocorre uma vez, então
não há impacto no `.exe`.

### 7.5 Chave de storage duplicada

`dataExport.ts:47` usa a string literal `'preventiva-save-mode'` em vez de
`MODE_KEY` de `constants.ts:2`. Se a constante mudar, `clearLocalData()` limpa a
chave errada e o modo persiste.

### 7.6 Índice composto do Firestore pendente de verificação

`getPreventivas` combina `where('uid','==',uid)` com `orderBy('criadoEm','desc')`
(`preventivaService.ts:75`). O Firestore **exige** um índice composto para essa
combinação. O projeto tem `firestore.indexes.json`; é preciso confirmar que o
índice foi criado no console — se não, a consulta falha em runtime.

---

## 8. O que foi feito nesta sessão

### 8.1 Correções aplicadas

| # | Ação | Arquivo | Efeito |
|---|---|---|---|
| 1 | Título da página corrigido | `index.html:6` | `<title>Preventivas Elétricas</title>` no lugar do template do Google AI Studio |
| 2 | Título no build web | `dist-web/index.html` | Sincronizado |
| 3 | **`undefined` removido antes do Firestore** | `preventivaService.ts:7-20` | `stripUndefinedDeep` — o Firestore **rejeita** `undefined`; era a causa provável de falha ao salvar |
| 4 | Spread condicional no payload | `App.tsx:661` | `viaSelecionada` não é mais enviado como `undefined` |
| 5 | Erro de salvamento detalhado | `App.tsx:496-497` | Mostra a mensagem real do Firestore, não texto genérico |
| 6 | `.gitignore` restaurado | `.gitignore` | Estava reduzido a 1 linha — build outputs corriam risco de versionamento |
| 7 | `.vercelignore` criado | `.vercelignore` | Impede upload de `dist*` e do `VERCEL_OIDC_TOKEN` |
| 8 | Output do Electron → `dist` | `package.json:31` | Eliminou a pasta órfã `dist/` que nunca mais era atualizada |
| 9 | README corrigido | `README.md:50` | Afirmava assinatura via `signtool.exe` sem certificado — substituído por seção honesta |
| 10 | Configuração de assinatura | `package.json:38-46` | `signtoolOptions` com SHA-256 e carimbo RFC 3161; ativa por `CSC_LINK` / `CSC_KEY_PASSWORD` |
| 11 | gh CLI instalado | `%LOCALAPPDATA%\Programs\GitHub CLI` | Destrava `git push` (o cache npx do Vercel estava corrompido) |

### 8.2 Impacto no produto

**Correção 3 é a mais relevante.** `stripUndefinedDeep` atua em `savePreventiva`,
`updatePreventiva` e na normalização de importação. O Firestore lança
`Unsupported field value: undefined` ao gravar; isso derrubava o salvamento
inteiro — a preventive inteira, não um campo. A correção 4 atacava o mesmo
problema pelo lado do `App.tsx`, e as duas se complementam: uma garante a
limpeza no serviço, a outra evita gerar o campo.

**Correção 6 é a de maior alcance preventive.** Com `.gitignore` reduzido a uma
linha, `dist`, `dist-web`, `dist-producao`, `.env.local` e `.vercel` apareciam
como rastreáveis — qualquer `git add .` poderia versionar centenas de MB e um
token OIDC. Confirmado via `git check-ignore` após a correção.

### 8.3 Artefatos

| Artefato | Tamanho | Data |
|---|---|---|
| `dist-web/index.html` + 7 assets | 1003 KB | 02/10/2026 |
| `dist\Preventivas Elétricas 1.0.0 Portable.exe` | 620,9 MB | 02/10/2026 |
| `dist\win-unpacked\Preventivas Elétricas.exe` | 212,7 MB | 02/10/2026 |
| `dist\win-unpacked\resources\app.asar` | 250 MB | 02/10/2026 |

Título novo confirmado **por leitura binária dentro do `app.asar`** — o `.exe`
realmente abre com o título correto.

Espaço liberado: **1.745 MB** (pasta órfã `dist/` de 503 MB + `dist-producao`
de 1.241 MB).

### 8.4 Commits

```
f54298f7  build: aponta output do electron-builder para dist
da9aa0a7  fix: remove valores undefined antes de gravar no Firestore
be14008b  fix: define titulo da aplicacao como Preventivas Eletricas
77dae7d8  chore: ignora dist, segredos e artefatos do Vercel no git
```

### 8.5 Deploy

Produção em `preventivas-el-tricas.vercel.app` (time `rovateduinos-projects`).
Título novo confirmado via `vercel curl`. Build da Vercel: 32 s.

### 8.6 Correção de cache

O cache npx do Vercel CLI estava corrompido (`@vercel/cli-config` ausente),
impedindo qualquer comando. Diagnóstico por eliminação: o pacote da CLI estava
completo, mas a dependência não — cache parcial de instalação interrompida.
Removido e reinstalado.

---

## 9. Recomendações

### Prioridade alta

1. **Aplicar `escapeHtml` em `ticket`, `site` e `tipo`** no `buildReportHTML`
   (7.1) — correção pequena, elimina a única via de injeção.
2. **Confirmar o índice composto no console do Firebase** (7.6) — se ausente,
   a listagem de registros falha em produção.
3. **Publicar o `dados\Preventivas.Eletricas.1.0.0.Portable.exe` no GitHub
   Release** — o README aponta para `v1.0.0`, mas o artefato atual é de
   02/10/2026.

### Prioridade média

4. **Obter certificado de assinatura** — elimina o SmartScreen. EV (~US$ 600/ano)
   dá reputação imediata; OV (~US$ 200/ano) exigem volume de downloads para
   construir a confiança. O config já está pronto: basta exportar `CSC_LINK` e
   `CSC_KEY_PASSWORD`.
5. **Reduzir o `app.asar`** (7.2) — mover 3 dependências para
   `devDependencies` e remover 4 não usadas.
6. **Adicionar `description` e `author`** ao `package.json` — o electron-builder
   avisa a cada build.
7. **Definir um ícone `.ico`** — hoje usa o padrão do Electron.

### Prioridade baixa

8. Extrair `buildReportHTML` e os cálculos para módulos testáveis (7.3).
9. Adicionar guarda `getApps()` em `firebase.ts` (7.4).
10. Trocar a string literal por `MODE_KEY` em `dataExport.ts:47` (7.5).
11. Atualizar `<html lang="en">` para `pt-BR` — o app é inteiramente em
    português, e o idioma errado afeta leitores de tela e SEO.
12. Revisar as 16 vulnerabilidades do `npm audit` — concentradas em `electron`,
    que não participa do build web.

---

## 10. Conclusão

O sistema é **funcionalmente sólido eresolve um problema real de processo**,
com os pontos fortes que mais importam para uso em campo: cálculo automático
de corrente, funcionamento offline, relatório pronto e ausência de instalação.

A sessão corrigiu dois defeitos que afetavam o uso — o título incorreto e, mais
grave, a falha de gravação no Firestore causada por `undefined` — e fechou um
risco de versionamento acidental de segredos e artefatos de build.

Os riscos remanescentes são conhecidos e de baixa gravidade: o `.exe` sem assinatura
gera alerta do SmartScreen, e existe uma via de injeção de HTML no relatório de
baixo impacto, de correção pontual. O item de maior esforço — reduzir o
`app.asar` de 250 MB — é otimização, não correção.

O caminho mais curto para amadurecer o produto é: fechar o escape de HTML,
confirmar o índice do Firestore, publicar o Release e obter o certificado de
assinatura.

---

## 11. Sessão 15/10/2026 — status das recomendações

Verificação por código + build + teste em browser (dev server `localhost:5173`)
e revisão independente por agente.

### 11.1 Fechadas

| Rec | Item | Evidência |
|---|---|---|
| Alta #1 | `escapeHtml` em todo o relatório | `src/lib/report.ts` — `esc`/`dash` em sigla, título, data, ticket, temperatura, site, tipo, complemento, observação, circuitos, correntes e tensões |
| Baixa #8 | Extrair módulos | `buildReportHTML`, `downloadReport`, `usesTresFases`, `isViaAB`, `formatDateBR`, `getCorrenteGeralDC` agora em `src/lib/report.ts`; sem duplicatas em `App.tsx` |
| Baixa #9 | Guarda `getApps()` | `src/lib/firebase.ts:6-8` |
| Baixa #10 | `MODE_KEY` | `src/lib/dataExport.ts:1,47` |
| Baixa #11 | `lang="pt-BR"` | `index.html:2` e `dist-web/index.html` |
| Média #5 | Reduzir `app.asar` | `package.json` — `dependencies` só com `firebase`, `lucide-react`, `react`, `react-dom`; build-only movidas para `devDependencies`; `electron/main.js` morto removido |
| Média #6 | `description`/`author` | `package.json:5-6` |

Extras corrigidos nesta sessão: temperatura ausente não imprime mais
`undefined°C`; `esc()` trata `null`/`undefined`; ticket vazio vira `-`;
import não usado (`ChevronDown`) removido; linha duplicada em
`vite.config.ts:17-18`; `firebase.json` apontava hosting para `dist` em vez de
`dist-web`; chave real de Gemini removida de `.env.example`; `.gitignore` passa
a ignorar o arquivo de credencial Firebase na raiz.

### 11.2 Validação executada

- `npx tsc --noEmit` → exit 0
- `npm run build` → 1699 módulos, ~1,03 MB de assets, sem erro
- 17 asserções sobre `buildReportHTML` (escapamento, colunas por via A/B/ambas,
  PDT com R/S/T e tensão composta, campos ausentes) → todas passaram
- Smoke test real no browser: criar preventiva QDF (EBT Osasco, ticket e
  observação com payload XSS), soma automática 12,5+7,5=20,0 A / 8+3=11,0 A /
  geral 31,0 A, salvar, visualizar, exportar relatório — HTML gerado com todos
  os payloads escapados (`&lt;img src=x onerror=alert(9)&gt;`), zero `undefined`
  no output, console sem erros

### 11.3 Pendente — bloqueia fora da máquina local

| Rec | Item | Óbice |
|---|---|---|
| Alta #2 | Confirmar índice composto `uid`+`criadoEm` no console | `firestore.indexes.json` já declara o índice; não há `firebase-tools` instalado nem sessão ativa. Só se confirma no console ou com `firebase deploy --only firestore:indexes` |
| Alta #3 | Publicar `.exe` portable no Release | A pasta **não é repositório git** (sem `.git`) e não há `dist/` nem `gh` no PATH. Exige `npm run dist` + restaurar git/remote + push |
| Média #4 | Certificado de assinatura | Compra de certificado OV/EV; config já pronta via `CSC_LINK` |
| Média #7 | Ícone `.ico` | Nenhum arquivo de ícone no projeto |
| Baixa #12 | `npm audit` | ~~22 vulnerabilidades (8 moderadas, 14 altas)~~ **resolvida nesta rodada — ver §12** |

### 11.4 Achados novos (não estavam na auditoria)

1. **`criadoEm` com tipos mistos** — `App.tsx:535` grava string ISO,
   `preventivaService.ts:41,52` gravam `Date.now()` (número). `orderBy('criadoEm')`
   ordena por tipo de dado, não por data. O índice composto não resolve isso.
2. **Circuito do tipo OUTRO perde o campo `nome` no relatório** — editável em
   `App.tsx:1004`, mas `report.ts` nunca o renderiza.
3. **`id` obsoleto no documento Firestore** — `addDoc` grava o `id` gerado no
   client, que difere do doc-id real; `updatePreventiva:49` apaga o campo.
4. **`src/types.ts` dessincronizado do runtime** (`Site.nome` vs `name`,
   `tipoQuadro` vs `tipo`, campos numéricos gravados como string) e sem uso.
5. **Credenciais na raiz** — `Firebase Chave preventivas-eletricas.json` (2,4 KB,
   formato de service account) e um `GEMINI_API_KEY` real dentro de
   `.env.example` versionável. Ignorados/limpos nesta sessão, mas **devem ser
   rotacionados** se qualquer versão anterior foi enviada ao GitHub.

### 11.5 Redução do empacotamento (medida em 15/10)

| Artefato | 02/10 baseline | Só mover deps de build | + excluir `node_modules` do asar |
|---|---|---|---|
| `app.asar` | 250 MB | 162,4 MB | **1,1 MB** |
| `.exe` portable | 620,9 MB | 523,4 MB | **362,1 MB** |

O asar empacotava o `node_modules` de produção inteiro (`firebase`,
`lucide-react`, `react`, `react-dom`) embora o Electron nunca faça `require`
neles — o bundle do Vite em `dist-web` já contém esse código. `"!node_modules/**/*"`
em `package.json` (`build.files`) remove o peso morto. O que sobra no `.exe` é o
runtime do Electron, redutível apenas com `compression` (hoje `store`).

Artefato validado: o portable gerado abre, a janela renderiza com o título
"Preventivas Elétricas" e o processo responde. Copiado para
`dist\Preventivas Elétricas 1.0.0 Portable.exe`.

Obstáculo ambiental: build com saída dentro de `Documents` falha com
`EPERM ... rename win-unpacked.tmp -> win-unpacked` (handle travado). Contornado
dirigindo a saída para fora da pasta (`--config.directories.output=%TEMP%\...`).
`dist\win-unpacked.tmp` continua travado — um `npm run dist` direto falha até o
handle liberar (reboot resolve).

### 11.6 Defeito de funcionalidade corrigido (OUTRO não podia ser salvo)

`App.tsx:502` exige `tipoOutro` e `:505` grava `finalTipo = tipoOutro.toUpperCase()`,
mas **não havia input algum ligado a `tipoOutro`** no formulário — só o texto de
ajuda. Qualquer tentativa de salvar um quadro "OUTRO" era bloqueada pelo
validador. Input adicionado em `App.tsx:824-831`.

Efeito cascata: como `record.tipo` passa a ser o nome digitado (ex: `QDGE`),
relatório e visor inferiam o layout por `usesTresFases(record.tipo)` e
**descartavam as colunas S, T e o nome do circuito**. `usesTresFasesRecord` e
`hasNomesRecord` (`src/lib/report.ts`) inferem o layout pelo formato dos
circuitos; `App.tsx` (modal de visualização) usa os mesmos helpers.

Validação: 24 asserções sobre `buildReportHTML` (escapamento, vias A/B/ambas,
PDT, OUTRO com tipo custom) mais o caminho completo no browser — criar OUTRO
"QDGE", somas automáticas R/S/T, salvar, visualizar, exportar. Relatório com
colunas Nome/S/T, payloads escapados, zero `undefined`, um único `<script>`.

Correções de dados dessa rodada: `criadoEm`/`atualizadoEm` normalizados para
ISO-8601 em todos os caminhos de escrita e leitura de
`src/lib/preventivaService.ts` (antes coexistiam número de epoch e string, e o
`orderBy('criadoEm','desc')` ordenava por tipo de dado); `id` gerado no cliente
deixou de ser gravado dentro do documento (`addDoc` dá o id real); `src/types.ts`
reescrito alinhado ao shape real em runtime.

### 11.7 Import duplicava registros (Modo Local)

`handleImport` fazia `const next = [...imported, ...records]`, ou seja, reimportar
o mesmo arquivo **adicionava tudo outra vez**. Como a tabela usa `key={r.id}`,
o estado com ids repetidos produzia 4 erros React na fila
(`Encountered two children with the same key`) e edição/exclusão passavam a
mexer em linhas ambíguas.

Agora a mescla é por `id` (`src/App.tsx`, ramo `saveMode === "local"`): o registro
do arquivo vence sobre o existente, os não mencionados são preservados, a lista é
reordenada por `criadoEm` decrescente (compatível com o
`orderBy('criadoEm','desc')` do modo Firebase e com o prepend do salvamento
manual) e o aviso informa `N novos / M atualizados`.

Validado no browser contra `http://localhost:5173`: export → reimport do mesmo
arquivo mantém 4 registros e a mesma ordem; import misto (1 existente alterado +
1 novo) fecha em 5 com `ticket` atualizado, registro intocado preservado e
"ÚLT. TEMP" apontando para o mais novo. Um registro legado com `criadoEm` numérico
convive com os ISO-8601 sem corromper a ordenação.

### 11.8 Inputs de circuito não controlados

Três inputs recebiam o valor cru do circuito — `value={c.viaA}`, `value={c.viaB}`,
`value={c.r}`. Para registro recém-criado isso é `""`, mas um registro carregado
de `localStorage` ou de import pode não ter a chave (`stripUndefinedDeep` remove
`undefined`, e `loadedCircuitos` usa o objeto cru da gravação), então o React
montava o campo **não controlado** e o tornava controlado na primeira digitação:

```
A component is changing an uncontrolled input to be controlled
```

Corrigido com `|| ""` nos três. Reprodução: registro gravado com `circuitos:
[{n:1},{n:2}]` (sem `r`/`s`/`t`), aberto em edição e digitado — console limpo.

### 11.9 Import no Firebase: ids de documento por usuário

`importPreventivas` gravava `doc(COLLECTION, record.id)` com o id vindo do arquivo.
A coleção `preventivas` é global (`uid` é só campo, filtrado em `getPreventivas`),
então dois usuários importando o mesmo backup colidiam no mesmo documento: o
`firestore.rules:5` barra o `update` por uid, e o **lote inteiro** falhava com
`permission-denied`; um import avulso podia ainda reassumir a posse do documento.

O id de importação passou a ser `${uid}-import-${id}` — por usuário, determinístico
e idempotente numa reimportação pelo mesmo dono. Os lotes também foram fatiados em
400 operações (o `writeBatch` do Firestore estoura em 500).

Caminho **não exercitado** localmente: o emulador exige JDK 21 (só há JRE 1.8 na
máquina) e não há deploy autorizado, então isto está validado só por leitura de
código e regras.

### 11.10 Estado da rodada local

`npx tsc --noEmit` ok, `npm run build` ok, sessão de browser completa sem erros de
console. `localStorage` devazio ao estado inicial (0 registros, modo local).
Nenhum commit, push, Release ou deploy foi feito — tudo permanece local.

Observação de UX (não corrigida): os botões Exportar / Importar / Limpar e o
seletor de modo de salvamento só existem no painel `tab === "novo"`
(`src/App.tsx:749-780`). Na aba "Registros Salvos" eles somem, então quem está
olhando a lista não consegue exportar sem voltar à aba de cadastro.

## 12. Recomendação #12 — dependências (`npm audit`)

Estado inicial: **22 vulnerabilidades (8 moderadas, 14 altas)**. Mapa de alcance
feito a partir de `package-lock.json` (caminhos até `dependencies` /
`devDependencies`):

| Bloco | Pacotes | Alcance real |
|---|---|---|
| Runtime web | `firebase` → `@firebase/firestore`, `@firebase/firestore-compat`, `@grpc/grpc-js` | único caminho de **produção**; `@grpc/grpc-js` é dependência do build Node do SDK e **não entra no bundle** (confirmado por grep em `dist-web/assets`) |
| Toolchain de build | `electron`, `electron-builder`, `app-builder-lib`, `dmg-builder`, `@electron/get`, `global-agent`, `roarr`, `sprintf-js`, `extract-zip`, `js-yaml`, `undici`, `nanoid`, `source-map-js`, `fast-uri`, `brace-expansion`, `http-cache-semantics`, `@xmldom/xmldom` | só executam na máquina de quem empacota; ausentes do `.asar` (já coberto por `"!node_modules/**/*"`) |

### O que foi feito

1. `npm audit fix` (sem cruzar major) → `electron` 41.7.1 → **41.10.7**, `firebase`
   12.16.0 → **12.19.0**, `electron-builder` 26.15.3 → **26.17.0**, `vite` 6.2.3 →
   **6.4.3**, `react`/`react-dom` 19.0.1 → **19.2.8**, e limpa as 10 altas de
   toolchain. Restaram 12.
2. `overrides` no `package.json` para os dois nós que não têm subida direta viável:
   ```json
   "overrides": { "@grpc/grpc-js": "^1.14.6", "global-agent": "^4.1.3" }
   ```
   - `@grpc/grpc-js` ≤1.13.5 era reportado via `@firebase/firestore`, que declara
     `~1.9.0`. O "fix" sugerido pelo npm era **regrar o SDK para firebase 9.14.0**
     — inaceitável; o override sobe só o transporte Node.
   - `sprintf-js` está sem versão corrigida (`*`) e `global-agent ≤3.0.0` puxa a
     cadeia `roarr` → `sprintf-js`. `global-agent` é **optionalDependency** de
     `@electron/get@3.1.0` e não é referenciado por nenhum arquivo do pacote
     (grep vazio), e `global-agent@4.1.3` abandonou `roarr`. Subir apenas ele
     derruba as 8 moderadas de uma vez, sem tocar na API de `@electron/get` — a
     alternativa (forçar `@electron/get@5`, que já é usado pelo próprio `electron`)
     mexe na API que `app-builder-lib/out/util/electronGet.js` consome.
3. `npm install` → `added 2, removed 7`.

### Estado final e validação

`npm audit` → **found 0 vulnerabilities**.

- `npx tsc --noEmit` ok; `npm run build` ok (`firebase-firestore` 319,66 kB,
  `vendor` 342,28 kB; `@grpc/grpc-js` ausente do bundle).
- Empacotamento real com `electron-builder --win portable` (saída em `%TEMP%` para
  driblar o `EPERM` de `dist\win-unpacked.tmp`): download e extração do Electron
  41.10.7 pelo `@electron/get` **funcionam com o override**, `app.asar` continua em
  **1,1 MB** e o portable em 346 MB.
- O `.exe` regenerado foi aberto: janela `Preventivas Elétricas`, `Responding=True`,
  depois encerrado. `dist\Preventivas Elétricas 1.0.0 Portable.exe` substituído pelo
  build atual (362.793.798 bytes).
- Smoke do app em Modo Local após o bump (criar PDT com R/S/T, somas automáticas,
  salvar, console limpo); `localStorage` devolvido a vazio.

Observação do npm: `npm warn install-scripts` lista `electron`, `esbuild`,
`protobufjs`, `electron-winstaller`, `@firebase/util` com scripts de instalação
fora do allowScripts. O binário de `node_modules/electron/dist/electron.exe` está
presente, então o empacotamento não foi afetado.

Nenhum commit/deploy: `package.json` e `package-lock.json` estão alterados apenas
localmente (backups em `%TEMP%\pv-verify\`).

## 13. Rebuild do portable após a mudança de Corrente Via A/B

Gatilho: "Gerar um novo build do executável". O `.exe` em `dist/` era o da rodada
de auditoria e já não refletia os campos Corrente Via A / Via B / Geral DC.

Fonte validada antes de empacotar: `npm run build` ok (1699 módulos,
`dist-web/assets/index-Bdm1xIqW.js` 80,38 kB), 30/30 asserções do harness do
relatório, fluxo QDF no dev server com 15,0 / 27,0 / 42,0 e console limpo.

Obstáculo: `npm run dist` escreve em `dist/`, que ainda tinha `win-unpacked.tmp`
segurado por alça órfã (`default_app.asar` — "arquivo já sendo usado por outro
processo"), sem nenhum processo `Preventivas`/`electron` vivo. `mv` deu permissão
negada. Contorno usado na auditoria e repetido aqui:

```
npx electron-builder --win portable --config.directories.output=%TEMP%\pv-dist-new
```

Resultado: exit 0. Artefato 362.794.645 bytes (anterior 362.793.798, +847),
`app.asar` 1.146.685 bytes. Cópias para `dist/` conferidas por SHA-256
(`f92f48a1…dbd52` idêntico em origem e destino); o build antigo foi preservado em
`%TEMP%\pv-stale\Preventivas-1.0.0-Portable.exe.audit-build`.

Validação do empacotado: `grep` no `app.asar` retorna `Corrente Via A`,
`Corrente Via B` e `Corrente Geral DC`; `Start-Process` do portable abriu 5
processos com janela título `Preventivas Elétricas` e `Responding=True`, fechada
via `CloseMainWindow` com 0 processos restantes.

Limite registrado: a interface dentro do `.exe` não foi dirigida por automação
(o Electron empacotado não expõe CDP aqui). A garantia é indireta — o bundle
testado no dev server é byte a byte o que está dentro do asar.

Resíduos: `dist/win-unpacked.tmp` (116 KB) segue travado e libera no reinício;
`%TEMP%\pv-dist-new` (~700 MB) foi removido. Sem commit, push, Release nem deploy.

## 14. Corrente Geral DC soma as vias A e B sempre

Decisão do usuário: "Sim, some A e B sempre". `src/App.tsx:293` passou de
`(showA ? sumViaA : 0) + (showB ? sumViaB : 0)` para `sumViaA + sumViaB`. Os
campos Corrente Via A / Via B continuam condicionados ao filtro (`App.tsx:291-292`)
e o texto de apoio (`App.tsx:988`) agora informa que a geral soma sempre as duas
vias e que o filtro só define quais aparecem nos disjuntores.

Efeito sobre dados gravados: `medicaoCorrente.geral` (`App.tsx:515`) passa a
guardar A + B. Relatório e visor leem o valor persistido por
`getCorrenteGeralDC`, então **registros antigos conservam a geral da regra
anterior** — nada foi migrado. A chave `tensaoDC` continua recebendo a corrente
(em quadros via-AB) enquanto "TENSÃO DC (V)" é gravada em `tensaoAC`: dívida de
nomes herdada, exibição correta, não alterada porque mexer nela muda o esquema
persistido.

Validação local (segundo agente, navegador em `localhost:5173`, QDF, linhas com
Via A = 10/5/0 e Via B = 12/15/0):

| Filtro de via | Via A | Via B | Geral DC | Esperado |
|---|---|---|---|---|
| ambas | 15,0 | 27,0 | **42,0** | 15,0 / 27,0 / 42,0 |
| A | 15,0 | vazio | **42,0** | não colapsa para 15,0 |
| B | vazio | 27,0 | **42,0** | 42,0 |

Registro salvo → visor com Geral 42,0; relatório com `Corrente Via A 15,0`,
`Corrente Via B 27,0`, `Corrente Geral DC 42,0`. Console: 0 erros, 0 avisos
(nenhuma queixa de input não controlado nem de chave duplicada). `localStorage`
devolvido a `preventiva-records="[]"`, `preventiva-save-mode="local"`.
`npx tsc --noEmit` ok, harness do relatório 30/30, `npm run build` ok
(`dist-web/assets/index-Dnz8eAIh.js` 80,44 kB).

Executável final: 362.794.696 bytes, `app.asar` 1.146.737 bytes contendo a nova
frase de apoio; SHA-256 `2d0ffdcf…16e0` idêntico entre origem e `dist/`.
`Start-Process` abriu 5 processos, janela `Preventivas Elétricas` com
`Responding=True`, encerrados com 0 processos restantes. Os dois builds
anteriores ficaram em `%TEMP%\pv-stale\` (`.audit-build` e `.pre-geral-sempre`).
Sem commit, push, Release nem deploy.

## 15. Arquivos alterados pelo usuário + comunicação com o Firebase

Alterações encontradas (15/10 23:12–23:13): `firebase.json`, `firestore.rules`,
`package.json` (idêntico ao estado que deixei — só o carimbo de hora mudou) e um
arquivo novo `gitignore` em minúsculas.

**`firebase.json`**: ganhou o bloco `firestore` com `database` =
`ai-studio-sistemadeprevent-331e703e-b4a1-4079-a60b-e1444bda9afe`, `rules` e
`indexes`. Confirma com o cliente, que abre o Firestore pela database nomeada
(`src/lib/firebase.ts:7` usa `firebaseConfig.firestoreDatabaseId` de
`firebase-applet-config.json`). No código do firebase-tools 15.34.0
(`lib/deploy/firestore/prepare.js:43-44`) `database` ausente vira `(default)`, e
`createDatabase` cria a database se o `GET` der 404 — ou seja, sem este campo o
deploy iria para o banco errado e um id digitado errado **provisiona** um banco
novo (local `nam5`, sem delete protection, já que `location` não está declarado).
Não há `.firebaserc`, então todo `deploy` precisa de `--project preventivas-eletricas`.

**`firestore.rules`**: agora cobre `invites`, `users` e `metadata` além de
`preventivas`, e bate campo a campo com `src/lib/userService.ts`
(`createUserProfile` grava `uid/role/inviteToken/email/createdAt`; o caminho de
primeiro admin grava `inviteToken: null` + `role: 'admin'`, que é o que a regra
exige quando `metadata/firstAdmin` não existe; `markInviteAsUsed` só altera
`used/usedBy/usedAt/email`, preservando `createdBy`/`role` que a regra de update
compara). `presence` foi comentado — o app não usa a coleção.

Sondas de somente-leitura (Node, `%TEMP%\pv-verify\probe-firebase.mjs`, apiKey do
config web, nenhuma escrita):

| Sonda | Resultado | Leitura |
|---|---|---|
| `signInWithPassword` credencial inventada | HTTP 400 `INVALID_LOGIN_CREDENTIALS` | provider e-mail/senha **ligado**, Identity Toolkit alcançável |
| `GET .../preventivas?key=` anônimo | HTTP 403 `Missing or insufficient permissions` | regras em vigor no banco nomeado |
| `GET .../metadata/firstAdmin` | **HTTP 200** | `firstAdmin` **existe** → auto-cadastro de admin fechado, cadastro exige convite |
| `GET .../invites/sonda` | HTTP 404 `Document not found` | `invites` tem `get` público e o caminho do banco resolve |
| mesmo `GET` em `(default)` | HTTP 403 | o banco `(default)` tem **regras diferentes**; é o banco nomeado que serve o app |

No navegador (segundo agente, nada escrito): o app em Modo Firebase abre o
WebChannel com `database=projects/preventivas-eletricas/databases/ai-studio-…9afe`
em todas as chamadas (nunca `(default)`), a tela de cadastro mostra o campo
**Token de convite** (não o banner de primeiro admin — consistente com o 200), e a
tentativa única de login errada devolve exatamente
`Erro ao fazer login: Firebase: Error (auth/invalid-credential).`. Console sem
`permission-denied`, sem "client is offline", sem CORS. Estado devolvido a
`preventiva-save-mode="local"`, `preventiva-records=[]`.

Local: `npx tsc --noEmit` ok, `npm run build` ok, dev server 200.

**Não testado (exige credencial real)**: leitura/escrita autenticadas — salvar
preventivo, listar com `where uid + orderBy criadoEm`, gerar convite. O índice
composto de `firestore.indexes.json` (`uid` ASC + `criadoEm` DESC) casa com a
query, mas se não estiver publicado no banco nomeado o app erroa como
"requires an index" só depois do login.

**`gitignore` minúsculo**: o Git só lê `.gitignore`; o arquivo novo é inerte. O
`.gitignore` vigente já protege a chave de serviço — verificado com
`git check-ignore` num repositório descartável:
`Firebase Chave preventivas-eletricas.json` ← linha 19 `*chave*.json`, `.env` ←
`.env*`, `*.exe`, `dist/` todos ignorados. As 6 linhas que só existem no arquivo
inerte (`*adminsdk*.json`, `*.pfx`, `*.p12`, `*.pem`, `*.key`, `.firebase/`) são
as únicas que faltam no `.gitignore` real.

firebase-tools ficou só no cache do npx (`_npx\b4f1959e38407b5`), `package.json`
intocado. Continua sem commit, push, Release nem deploy.

## 16. Rodada autenticada no Firestore (conta de teste)

Conta informada: conta de teste (o domínio no chat veio com um "s"
a mais), uid omitido, papel **`user`** com `inviteToken`
presente — sem painel de admin, o que também impossibilita eu gerar convites.
A conta tinha **115 registros reais**; nenhum deles foi tocado.

CRUD completo contra o banco nomeado, via UI (browser-use):

| Ação | Observado |
|---|---|
| criar | contador 115 → 116, selo "Salvo"; QDF, Via A 10+5, Via B 12+15 |
| ler (visão) | `Corrente Via A 15.0 A`, `Corrente Via B 27.0 A`, `Corrente Geral DC 42.0 A`, `TENSÃO DC -54.2 V` — regra "geral soma A+B sempre" valendo em conta real |
| atualizar | ticket e TENSÃO DC gravados; sobreviveram a um reload que recarregou os dados do servidor |
| relatório | blob 3.312 bytes, `lang="pt-BR"`, `<title>Preventiva AAL - 16/10/2026</title>`, linhas de corrente presentes, um único `window.print` (arquivo em `%TEMP%\pv-verify\relatorio-sonda.html`) |
| excluir | 116 → 115; ausente após novo reload |

**Índice composto confirmado na prática**: a consulta `where uid == + orderBy
criadoEm desc` (`preventivaService.ts:97`) retornou os 115 documentos sem erro de
"requires an index" — o item Alta #2 da auditoria está resolvido no banco
nomeado, restando só a checagem visual no console.

Console da rodada inteira: **zero erros, zero avisos**, com 115 registros reais na
lista — a correção das chaves duplicadas se sustenta sobre dados legados.

Dois comportamentos descobertos na travessia:

1. **Logout por falha transitória de perfil.** No boot, `subscribeToAuthChanges`
   exige `users/{uid}`; tanto o documento ausente quanto um erro de leitura
   qualquer chamam `logout()` (`App.tsx:91` e `App.tsx:100-105`). Em um dos
   reloads a leitura falhou e a sessão caiu sozinha com
   "Falha ao validar autorização"; não foi reproduzido de propósito. Um ping
   momentâneo de rede desloga o técnico no meio do trabalho.
2. **Modo de salvamento volta para "local" no dev.** `useState('local')` + efeito
   que lê `MODE_KEY` (`App.tsx:186-193`) + efeito que escreve (`App.tsx:196-198`):
   com o StrictMode do `main.tsx` o segundo efeito grava `local` antes de o
   primeiro reler, e o reload perde o modo. No bundle de produção servido em
   `vite preview` (4173) o modo e a sessão **sobreviveram** ao reload com os 115
   registros — defeito exclusivo do `npm run dev`. Correção limpa: inicializar o
   estado lazy lendo `MODE_KEY` e apagar o efeito de leitura.

Não testado de propósito: criação de convite — as regras de `invites` não têm
`delete`, então um convite gerado ficaria vivo no Firestore para sempre, e a conta
de teste nem tem o painel. Estado final deixado como encontrado: logado, modo
Firebase, 115 registros, `preventiva-records` vazio, preview de 4173 encerrado.

A senha de teste é de 6 dígitos e agora está registrada nesta conversa; vale
trocar depois da validação. Não copiei credencial alguma para arquivo.
## 17. Cartão de download da tela de login x artefato real

Três divergências entre o que `Login.tsx` promete e o que o build entrega:

| Promessa (`Login.tsx`) | Realidade |
|---|---|
| `Portable · 621 MB` (linha 221) | `dist/Preventivas Elétricas 1.0.0 Portable.exe` = 362.794.696 B ≈ **346 MiB** |
| `Assinado digitalmente` (linhas 240/249) e `Executável assinado` no texto do cartão | o log do `electron-builder` informa **signing skipped** — não há certificado `.pfx`/conta de code signing, então nada está assinado |
| `downloadUrl` (linha 94) aponta para `…/releases/download/v1.0.0/Preventivas.Eletricas.1.0.0.Portable.exe` | ainda não existe repositório git nem Release; e mesmo criando, o nome enviado precisa ser esse — o build gera `Preventivas Elétricas 1.0.0 Portable.exe` (espaços + acento), então o link daria 404 |

Correções possíveis, todas locais e sem deploy: ajustar o peso exibido para o valor
do artefato, trocar "assinado digitalmente" por texto honesto enquanto não houver
certificado, e fixar `build.artifactName` no `package.json` (ex.:
`Preventivas.Eletricas.${version}.Portable.exe`) para que o nome do arquivo case com
a URL da Release. Nada foi alterado — aguardando decisão, porque mexe no texto de
marketing e no nome do binário.


## 18. Rodada dos 7 itens (16/10/2026) — local, sem commit e sem deploy

Backups de tudo que foi alterado em `%TEMP%\pv-verify\` (`App.tsx.pre-item3.bak`,
`firestore.rules.pre-item4.bak`, `userService.pre-item4.bak`, `Login.pre-item5.bak`,
`README.pre-item5.bak`, `gitignore.real.bak`).

### 18.1 Item 1 — `.gitignore`

6 linhas mescladas no `.gitignore` real (21-26) e o arquivo solto `gitignore`
apagado. Validacao em repositorio descartavel com `git check-ignore -v`:

| Caminho | Resultado |
|---|---|
| `Firebase Chave preventivas-eletricas.json` | `.gitignore:19:*chave*.json` |
| `.env` / `.env.local` | `.gitignore:12:.env*` |
| `app.exe` | `.gitignore:17:*.exe` |
| `dist/index.html` | `.gitignore:3:dist/` |
| `x.pfx` / `x.p12` / `server.pem` / `secret.key` | linhas 22/23/24/25 |
| `firebase-adminsdk-1a2b3.json` | `.gitignore:21:*adminsdk*.json` |
| `.firebase/hosting.json` | `.gitignore:26:.firebase/` |
| `.env.example` | `.gitignore:13:!.env.example` → **nao ignorado** |

`git add -A -n` num repo descartavel so oferece `.env.example` e `.gitignore`.

### 18.2 Item 2 — `presence`

`grep -rn "presence" src electron` → **saida vazia, exit 1**. Busca
case-insensitive no projeto inteiro (sem `node_modules`/`dist`): apenas
`firestore.rules:57,59` (comentario de desativacao), `AUDITORIA.md:840` e duas
frases soltas em `CONTINUE.md`. Nenhum uso de codigo. Nada a fazer alem do que ja
esta comentado nas regras.

### 18.3 Item 3 — erro transitorio nao derruba mais a sessao

`src/App.tsx:64-65` (`PROFILE_RETRY_MAX = 3`, `PROFILE_RETRY_BASE_MS = 2000`),
efeito de boot em `src/App.tsx:81-174`, estados/refs em `:186-190` e aviso em
`src/App.tsx:849-855`. Regras implementadas: desloga **somente** quando a leitura
conclui e `snapshot.exists() === false`; erro de leitura mantem `user`, fixa papel
`'user'`, agenda ate 3 releituras (2 s, 4 s, 8 s) e mostra aviso nao bloqueante;
releitura bem-sucedida aplica `profile.role` e limpa o aviso sem reload.
`authGeneration` invalida ciclos antigos (StrictMode / re-auth) e o cleanup cancela
o timer pendente.

Teste real (nao so typecheck), com service worker de sonda temporario
(`public/__probe-sw.js`, **removido** ao final, registrations e caches zerados) para
cortar o Firestore do lado da rede e sobreviver ao reload:

| Observacao | Evidencia |
|---|---|
| Boot a frio sem rede no Firestore | banner `[role=status]`: "Nao foi possivel confirmar sua autorizacao no Firebase. Voce continua logado com acesso padrao." |
| Sessao mantida | cabecalho com a conta de teste, nenhum `input[type=password]` na tela, sem navegacao |
| Caminho de erro exercitado | console: `Erro ao ler perfil do usuario; mantendo a sessao: FirebaseError: Failed to get document because the client is offline.` + SDK `code=unavailable` |
| Maximo 3 tentativas | aviso permanece depois do backoff (nao ha nova leitura sem novo ciclo de auth) |
| Recuperacao sem reload | com a rede liberada durante o backoff, o banner sumiu e a sessao continuou de pe |
| Sem regressao | reload com rede livre: 115 registros, zero avisos, zero erros no console |

Detalhe descoberto no teste: **o transporte e `fetch`, nao XHR**, e a leitura do
perfil so falha a frio — com o SDK ja conectado ele serve `users/{uid}` do cache de
memoria e resolve sem tocar a rede. Num aparelho sem sinal, o `getDoc` do boot pode
ficar **pendurado** em vez de rejeitar (na ha timeout configurado no SDK): a sessao
nao cai (objetivo cumprido), mas o aviso e o backoff nem chegam a rodar. Ficou como
decisao pendente adicionar `withTimeout(...)` em `getUserProfile`.

### 18.4 Item 4 — convites revogaveis

`firestore.rules:23` (bloco completo em 13-24): `allow list, delete` para admin, com
`get/create/update` originais intactos. `src/lib/userService.ts:49-60`:
`listUnusedInvites()` (query `where used == false`) e `revokeInvite(token)`.
UI em `src/App.tsx:766-795` (handlers) e `:911-960` (painel "Convites pendentes",
token truncado, data, botao Revogar com confirmacao inline Confirmar/Cancelar),
renderizado apenas quando `userRole === 'admin'`.

Testado: **nao aparece** para o papel `user` — painel ausente do DOM e sem os botoes
de admin, tanto em modo local quanto em Firebase. **Nao testado contra o Firebase
real**: as regras novas ainda nao foram publicadas (sem deploy autorizado), entao
`list` e `delete` continuam negados pelo servidor; e a conta de teste e `user`, sem
como exercitar a renderizacao admin nem uma revogacao de verdade.

### 18.5 Item 5 — textos honestos

`src/components/Login.tsx`: `downloadUrl` → `.../releases/latest` (linha 94), badge
`Portable · 346 MB` (221), celula "Seguranca" → "Dados isolados por conta" (249),
feature "Seguranca Total" → "Autenticacao por usuario UID e registros isolados por
conta no Firestore." (100), rodape do modal → "Executavel portatil · Relatorios
tecnicos · Backup sempre" (390). `README.md:3` badge → `releases/latest`; a secao
"Assinatura de codigo (pendente)" (51-69) permanece como estava.

Tamanho real medido: `dist/Preventivas Eletricas 1.0.0 Portable.exe` =
362.794.696 B = 346 MiB (o que o Explorer exibe). Verificado no navegador com a tela
de login e o modal abertos: `621` ausente, `assinad` ausente em todo texto visivel,
`href` do cartao = `https://github.com/rovateduino/Preventivas-El-tricas/releases/latest`.
O link ainda aponta para uma Release inexistente (404 ate publicar) — agora sem nome
de arquivo inventado.

### 18.6 Item 6 — analise do campo `geral` (sem alteracao de codigo)

(a) Onde vive:
- escrita: `src/App.tsx:586` (`medicaoCorrente.geral` a partir de `correnteGeral`) e
  `src/App.tsx:609` (`tensaoDC` recebe a mesma corrente em quadros via-AB — divida
  de nomes herdada);
- calculo: `src/App.tsx:356-365` (`sumViaA`/`sumViaB` → `geral = sumViaA + sumViaB`);
- leitura: `getCorrenteGeralDC` (`src/lib/report.ts:21-25`, fallback em `tensaoDC`),
  usado no relatorio (`report.ts:65`), ao abrir para edicao (`App.tsx:553`) e no
  visor; `src/types.ts:27` declara o campo.

(b) Versao da regra (`regraGeral: 2`): entraria no objeto `medicaoCorrente` junto de
`geral` (escrita em `App.tsx:582-587`), com ausente equivale a regra 1 na leitura;
o relatorio passaria a rotular a linha (ex.: "Corrente Geral DC (A+B)" versus
"Corrente Geral DC (via selecionada)"); o fallback de `getCorrenteGeralDC` precisaria
respeitar a versao para nao reformular numeros antigos, e a edicao de um registro
antigo nao deveria recalcular a geral ate o tecnico mexer nos disjuntores. Custo: um
campo a mais persistido e, sem migracao, a informacao vale apenas para gravacoes
novas.

(c) Medido na conta de teste por exportacao em memoria (nada escrito): 115
registros, todos via-AB (70 QDF + 45 QDCC), todos com `geral` preenchido.
**Em 115/115 o `geral` gravado ja e igual a soma(Via A) + soma(Via B) dos
disjuntores do proprio registro** — zero registros divergem da regra nova.
Distribuicao de `viaSelecionada` salva: 36 "ambas", 35 "A", 5 "B", 39 ausente
(anteriores ao fix do spread condicional). Motivo: em campo ninguem preenche a via
oculta, entao as duas regras produzem o mesmo numero. Hoje nao existe registro que a
migracao alteraria.

### 18.7 Item 7 — deploy preparado, nao executado

`.firebaserc` criado com `{"projects":{"default":"preventivas-eletricas"}}` (nao e
peg pelo `.gitignore`: `.firebase/` so casa com diretorio). `firebase.json` intocado:
continua **sem** `location` — o valor tem de vir do console do Firebase (a database
nomeada ja existe; um `location` errado ou ausente na criacao de banco novo cai em
`nam5` por default do CLI).

Comando para o Rafael rodar (nao fui eu):
`npx firebase-tools deploy --only firestore --project preventivas-eletricas`
→ publica `firestore.rules` e os indices de `firestore.indexes.json` **na database
nomeada** `ai-studio-sistemadeprevent-331e703e-b4a1-4079-a60b-e1444bda9afe`, gracas
ao bloco `firestore.database`. Com o `.firebaserc` criado, o `--project` passa a ser
opcional. Exige `firebase login` (sessao interativa dele).

### 18.8 Estado

`npx tsc --noEmit` exit 0 e `npm run build` exit 0 (1699 modulos,
`index-BZAIEMFf.js` 84,12 kB — +3,7 kB pelo novo bloco de auth). Nenhum commit,
push, Release, deploy Vercel ou `firebase deploy`. Navegador devolvido como estava:
logado, modo local, `preventiva-records` vazio, service worker de sonda removido e
sem registration.

## 19. Revisão de alinhamento O1–O5 (17/10/2026) — somente leitura

Nada foi corrigido nesta seção. Todas as linhas abaixo são evidência de leitura de
código, saída de comando ou sonda de rede. O que não foi reproduzido está marcado
como **não verificado**. Escopo: nenhum commit, push, Release, deploy Vercel ou
`firebase deploy`; nenhuma escrita em Firestore, no Auth ou em disco fora desta
seção e de backups/sondas em `%TEMP%\pv-verify\`. `Firebase Chave
preventivas-eletricas.json` não foi aberto. Nenhuma credencial foi lida ou repetida.

### 19.1 Veredito por objetivo

| # | Objetivo | Veredito | Evidência principal |
|---|---|---|---|
| O1 | Uso em campo com sinal ruim; Modo Local íntegro; Firebase não perde dados nem derruba sessão | **PARCIAL** | Sessão: retrabalho do item 3 validado em rodada anterior sob corte real de rede. Dados: `src/lib/firebase.ts:7` usa `getFirestore` sem cache local e `src/App.tsx:429-434` trata a falha apenas com mensagem — não há fila. Local íntegro: `src/App.tsx:405-408` |
| O2 | Isolamento por usuário, cadastro por convite, admin controlado, zero segredo no repo/bundle/.exe | **PARCIAL** | Isolamento e isolamento anônimo provados por sonda (19.3). Zero segredo no `.exe` e no `dist-web` (19.2). Ressalvas: `firestore.rules:14` (`get: if true` em invites), regras novas de `list/delete` ainda não publicadas, backup real de dados solto na raiz (19.5) |
| O3 | Relatório correto: cálculos, sem `undefined`, HTML escapado | **ALINHADO** | 30/30 asserções + 19 casos de borda na versão viva do módulo (19.4). Duas quebras de robustez só com documento sem `circuitos`/`site`, caminho impossível pelo import validado (`src/lib/dataExport.ts:34`) |
| O4 | Nenhum texto promete algo que o código/build não entrega | **PARCIAL** | 6 afirmações falsas ou exageradas enumeradas em 19.6, incluindo `README.md:29` (jsPDF) e `README.md:31` ("armazenamento duplo") |
| O5 | Manutenção viável, dívidas priorizadas sem bloquear a 1ª versão | **PARCIAL** | Dívidas reais listadas em 19.7; uma das sugeridas ("chave de storage duplicada") **não existe** no estado atual (`src/lib/constants.ts:1-2` é a única definição). `App.tsx` tem 86.044 B; `tsconfig.json` não declara `strict` nem `include` |

### 19.2 A) Segredos

1. Grep (`BEGIN PRIVATE KEY`, `private_key`, `GEMINI`, `AIza…`, `client_secret`,
   `api_key`, `secret`) em todo o projeto exceto `node_modules`, `dist`, `dist-web`,
   `.vercel`, a chave de serviço e `.map`. Arquivos com correspondência e o que são:

| Arquivo | Linha | Natureza |
|---|---|---|
| `.env.example` | 3 | `GEMINI_API_KEY=""` — placeholder vazio, sem valor |
| `firebase-applet-config.json` | 4 | `apiKey` web pública do Firebase (formato `AIza…`, valor não repetido aqui) |
| `metadata.json` | 5 | `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` — nome de capacidade do manifesto do AI Studio, não chave |
| `CONTINUE.md` | 4787, 9263 | despejo de listagem de ferramentas MCP (contém a palavra `secret` em nomes de ferramenta) |
| `AUDITORIA.md` | 144, 274, 847, 927 | prosa sobre login/senha; nenhum valor de credencial |
| `README.md` | 63 | `<senha-do-pfx>` — placeholder literal dentro do exemplo de assinatura |

   Nenhum `private_key`, `BEGIN RSA PRIVATE KEY`, `client_secret` ou token real em
   arquivo rastreável. As senhas de teste não foram copiadas para nenhum arquivo
   (verificado por contagem: zero ocorrências do e-mail de teste e zero do literal da
   senha em `CONTINUE.md`, `AUDITORIA.md`, `README.md`, `src/App.tsx`,
   `src/lib/firebase.ts`).

2. Artefatos de build. **`dist/win-unpacked/resources/app.asar` não existe mais** — a
   árvore de unpack foi removida e sobrou apenas `dist/win-unpacked.tmp/`, cujo único
   `.asar` é `default_app.asar` (111.073 B, padrão do Electron). O artefato real é
   `dist/Preventivas Elétricas 1.0.0 Portable.exe` (362.794.696 B, 15/10 19:53),
   escaneado binariamente: `service_account` 0, `private_key_id` 0,
   `firebase-adminsdk` 0, `client_secret` 0, "Chave preventivas" 0,
   `BEGIN RSA PRIVATE` 0; `private_key` 3 (internos do Electron/Node — sem qualquer
   marca de conta de serviço ao lado), `AIza` 2 (a config web, esperada).
   `dist-web/` tem 8 arquivos (index.html + 6 JS + CSS + PNG) e nas varreduras:
   `private_key` 0, `BEGIN RSA` 0, `firebase-adminsdk` 0, `client_secret` 0. A string
   `123456` aparece 4× nos bundles e foi rastreada até `src/lib/userService.ts:14`
   (alfabeto base62 do gerador de token), não a uma senha.
   `package.json:26-31` confirma a causa: `build.files` é allowlist
   (`dist-web/**/*`, `electron/**/*`, `package.json`), então a chave de serviço e
   `.env` nunca entrariam no `.asar`.

3. `firebase-applet-config.json` contém apenas chaves de cliente web: `apiKey`,
   `appId`, `authDomain`, `firestoreDatabaseId`, `messagingSenderId`, `projectId`,
   `recaptchaSiteKey`, `storageBucket`. Não há `client_email`, `client_secret`,
   `private_key` nem `type: service_account`.

**Achado A-1 (risco, não é segredo):** `preventivas-export-2026-10-16T03-41-39.json`
(488.457 B, 115 registros reais de campo com `uid`) está na raiz e **nenhum padrão de
`.gitignore:1-26` o cobre**. Num `git add .` ele entra no repositório.

**Achado A-2 (higiene) — RESOLVIDO na Rodada 3:** as duas ocorrências do endereço da
conta de teste (`AUDITORIA.md:883` e `:997`) e o uid que estava na linha 884 foram
substituídos por "conta de teste" / "uid omitido". Nenhuma senha nunca esteve em
arquivo. `grep -c -E "preventiva@|AgtXPrbRqgSc" AUDITORIA.md` → `0`.

### 19.3 B) Operações Firestore × regras

| Operação | Arquivo:linha | Coleção | Ator | Regra que autoriza |
|---|---|---|---|---|
| `getDoc` convite | `userService.ts:23` | `invites` | anônimo (pré-login) | `rules:14` `allow get: if true` || `setDoc` convite | `userService.ts:30` | `invites` | admin | `rules:15` (checa `users/{uid}.role == 'admin'`) |
| `updateDoc` marcar usado | `userService.ts:41` | `invites` | usuário se cadastrando | `rules:16-21` |
| `getDocs` lista não usados | `userService.ts:50` | `invites` | admin | `rules:23` — **não publicada** |
| `deleteDoc` revogar | `userService.ts:58` | `invites` | admin | `rules:23` — **não publicada** |
| `getDoc` perfil | `userService.ts:63` | `users` | próprio uid | `rules:27` |
| `setDoc` criar perfil | `userService.ts:69` | `users` | anônimo→recém-logado | `rules:28-43` |
| `getDoc firstAdmin` | `userService.ts:80` | `metadata` | anônimo | `rules:51` |
| `setDoc firstAdmin` | `userService.ts:86` | `metadata` | primeiro admin | `rules:52-56` |
| `addDoc` salvar | `preventivaService.ts:54` | `preventivas` | usuário | `rules:6` |
| `setDoc(merge)` atualizar | `preventivaService.ts:61-65` | `preventivas` | usuário | `rules:8-10` |
| `writeBatch.set` importar | `preventivaService.ts:86-90` | `preventivas` | usuário | `rules:6` (create) / `rules:8` (reimport do mesmo id) |
| `getDocs` listar | `preventivaService.ts:97-98` | `preventivas` | usuário | `rules:5` + índice composto `firestore.indexes.json:5-10` |
| `deleteDoc` um | `preventivaService.ts:103` | `preventivas` | usuário | `rules:5` |
| `getDocs` + `writeBatch.delete` limpar | `preventivaService.ts:107-114` | `preventivas` | admin (gate de UI `App.tsx:889`) | `rules:5` |

- **(a) operação sem regra publicada:** `listUnusedInvites` e `revokeInvite`
  (`userService.ts:50,58`). A regra existe em `firestore.rules:23` mas, se não foi
  republicada depois de 15/10, o botão "Ver lista" do painel admin devolve
  `PERMISSION_DENIED` em produção. Estado publicado **não verificado** (exige sessão
  admin do Rafael).
- **(b) regra sem uso no código:** `allow update` de `users` (`rules:44-47`) e
  `list` de `metadata` (inexistente e inexistente no código). Nada escreve em
  `presence` — `grep -rn "presence" src electron` sem correspondência, bloco
  comentado em `rules:59-63`.
- **(c) regra mais permissiva do que o necessário:** `allow get: if true` em
  `invites` (`rules:14`). O app só precisa ler o convite durante o cadastro; o efeito
  colateral é que qualquer pessoa com o token lê `role`, `createdBy`, `used`,
  `usedBy` e o e-mail do beneficiado. O token tem 48 hex de `crypto.getRandomValues`
  (`userService.ts:6-11`), então o risco é de divulgação, não de adivinhação.
- **Sequência do resgate (achado B-1):** `Login.tsx:61-62` cria o perfil **antes** de
  marcar o convite como usado. Se `markInviteAsUsed` falhar (rede, regra, interrupção),
  `rules:40` ainda vê `used == false` e um segundo cadastro com o mesmo token é
  aceito. O convite vira reutilizável até alguém revogá-lo.

### 19.4 C) Sondas anônimas no banco nomeado

REST `v1/projects/preventivas-eletricas/databases/ai-studio-…9afe/documents`, sem
nenhum cabeçalho de credencial:

| Sonda | HTTP | Esperado pelas regras locais | Divergência |
|---|---|---|---|
| `GET metadata/firstAdmin` | 200 (documento existe; campos `createdBy`, `role`, `createdAt`) | 200 por `rules:51` | nenhuma |
| `GET invites/<token-falso>` | 404 `NOT_FOUND` | 404 — `get: if true` deixa perguntar | nenhuma |
| `GET users/<uid-falso>` | 403 `PERMISSION_DENIED` | 403 por `rules:27` | nenhuma |
| `GET preventivas/<id-falso>` | 403 | 403 por `rules:5` | nenhuma |
| `GET presence/<uid-falso>` | 403 | 403 (bloco comentado, default deny) | nenhuma |
| `list preventivas` / `invites` / `users` / `presence` / `metadata` | 403 em todas | 403 — nenhuma `list` anônima | nenhuma |

`runQuery` anônimo não pôde ser exercido no formato REST usado (o servidor respondeu
400 `INVALID_ARGUMENT` antes de avaliar regras); a listagem anônima foi então medida
por `GET` na coleção, que mapeia a mesma permissão `list`. **Nenhuma divergência
entre regras locais e comportamento publicado nas sondas anônimas.** O que as sondas
anônimas não conseguem provar é o caminho autenticado (admin `list/delete` de
convites) — **não verificado**.

### 19.5 D) Offline e troca de modo

1. **Salvar no Modo Firebase sem rede: falha com erro, não vai para fila, não é
   persistido.** Decisão está em `src/lib/firebase.ts:7` — `getFirestore(app, id)`
   sem `initializeFirestore(..., {cache: new MemoryLocalCache()})`, portanto não
   existe fila de escrita offline. Em `src/App.tsx:403-435`: em caso de exceção
   `setFormError(...)`, `setSaveState("idle")`, `return false`; `handleSave`
   (`App.tsx:619-621`) só chama `resetForm()` quando `saved === true`, então o
   formulário continua preenchido — a perda acontece se o técnico recarregar, fechar
   a janela ou trocar de aba antes de salvar de novo. Nada grava o rascunho: as
   únicas chaves usadas são `preventiva-records` e `preventiva-save-mode`
   (`src/lib/constants.ts:1-2`, usos em `App.tsx:259,268,298,394`).
   Ler no Modo Firebase sem rede também falha: `App.tsx:318-321` zera a lista e mostra
   "Não foi possível carregar registros do Firebase."
2. **Mensagens de confirmação:** `App.tsx:407` "Registro salvo localmente ✓" /
   "Registro atualizado localmente ✓" contra `App.tsx:426` "Registro salvo no
   Firebase ✓" / "Registro atualizado no Firebase ✓". O estado aparece ainda em
   `App.tsx:873-877` ("Registros ficam armazenados no dispositivo atual…" vs
   "Salvando no Firebase como <e-mail>"). Nenhum texto diz "sincronizado" — não há
   sincronização para ser prometida. **Sustentado.**
3. **Troca de modo esconde, não migra (reproduzido no navegador):** com a conta de
   teste logada e 1 registro em `preventiva-records`, clicar na pílula "Firebase"
   recarrega a lista a partir do Firestore (`App.tsx:291-328`, dependência
   `[saveMode, user]`): a listagem passou a mostrar os 115 documentos da nuvem e o
   registro local sumiu da tela, enquanto `localStorage` manteve o item
   (`localRecords: 1`, `probeVisivel: false`, sem erro). Voltar para "Local" restaurou
   a contagem 1. **Nenhum registro é apagado ou duplicado**, mas o técnico que
   coletou medições offline e ativa o Firebase vê a lista "vazia" e pode concluir que
   perdeu dados; a única ponte é Exportar JSON → Importar JSON, sem aviso na interface.
   Duplicação na volta só existe via import, e `importDocId`
   (`preventivaService.ts:71-75`) deduplica por `uid-import-<id>`.
4. **Apagar em lote pode reportar mais do que apagou:** `App.tsx:736-740` engole cada
   falha com `catch {}` e `App.tsx:751` mostra `records.length` como apagados. O
   resultado (toast otimista) é legível em código; **não reproduzido** em runtime.

### 19.6 E) Cálculos e relatório

Asserções executadas contra o módulo **vivo** (`node node_modules/esbuild/bin/esbuild
src/lib/report.ts --bundle --format=esm --platform=neutral` →
`%TEMP%\pv-verify\report.mjs`, 6.296 B), não contra cópia antiga:

```
PASS  payload do ticket escapado          PASS  OUTRO com tipo custom mostra colunas S e T
PASS  apenas o script legitimo de auto-print  PASS  OUTRO com tipo custom mostra coluna Nome
PASS  complemento e observacao escapados  PASS  OUTRO renderiza nome do circuito escapado
PASS  escapa aspas e angulares            PASS  OUTRO exibe correntes de fase S e T
PASS  tensao DC usa tensaoAC              PASS  OUTRO detectado via shape do circuito
PASS  temperatura renderizada             PASS  QDF nunca ganha coluna Nome
PASS  titulo sem markup cruo              PASS  PDT sem nome não cria coluna Nome
PASS  via A oculta coluna B no corpo      PASS  QDF ambas imprime Corrente Via A
PASS  via A oculta header Via B           PASS  QDF ambas imprime Corrente Via B
PASS  via B oculta header Via A           PASS  QDF ambas imprime Corrente Geral DC
PASS  PDT tem colunas S e T               PASS  QDF restrito a Via A omite a linha da Via B
PASS  PDT tem tensao composta             PASS  QDF restrito a Via B omite a linha da Via A
PASS  PDT sem coluna Via                  PASS  QDF sem medicaoCorrente ainda imprime a geral
PASS  PDT sem payload cruo
PASS  campos ausentes viram dash          PASS  getCorrenteGeralDC prioriza medicaoCorrente.geral
PASS  getCorrenteGeralDC cai para tensaoDC
TODOS OS TESTES PASSARAM  (exit 0)
```

Casos de borda (19 checagens, `edge-report.mjs`):

| Caso | Resultado |
|---|---|
| `circuitos: []` | PASS — sem `undefined`, cabeçalho preservado, tbody vazio |
| vírgula decimal (`12,5` / `19,75`) | PASS — o relatório repete a string cru (`<td>12,5</td>`, `19,75 A`); nenhuma conversão de ponto. Os cálculos de soma aceitam vírgula (`App.tsx:59-62` `Number(value.replace(',', '.'))`) |
| HTML puro em campo de circuito | PASS — `&lt;img src=x onerror=alert(1)&gt;`, um único `<script>` (auto-print), nada cru |
| `OUTRO` sem `tipoOutro` | PASS — o app bloqueia antes (`App.tsx:578`); se o `tipo` cru `OUTRO` chegar ao relatório, ganha colunas S/T e "Quadro OUTRO", sem `undefined` |
| 200 circuitos | PASS — 200 linhas, `<td>200</td>` sem truncar, `<td>07</td>` com `padStart`, HTML < 400 KB |
| documento legado sem `circuitos` | **FALHA** — `TypeError: Cannot read properties of undefined (reading 'map')` (`report.ts:46`) |
| documento legado sem `site` | **FALHA** — `TypeError: ... (reading 'sigla')` (`report.ts:92`) |
| `data: ''` | PASS — `formatDateBR` devolve `-` (`report.ts:4-8`) |
| `medicaoCorrente.geral = 0` | retorna `"0"` (não cai em `tensaoDC`) — comportamento correto para leitura zero; a asserção que eu tinha escrito estava errada, não o código |

Os dois `TypeError` são inalcançáveis pelo caminho de import (`dataExport.ts:34`
exige `id`, `data`, `site`, `tipo`, `ticket`) e o backup real confirma 0/115 registros
sem `circuitos` ou `site`. Ficam como fragilidade de robustez, não como defeito
observado.

### 19.7 F) Honestidade dos textos

Varredura (`assinad|segur|backup|offline|criptograf|100%|garant|sempre|nunca|sincroniz|nuvem`)
em `src`, `electron`, `README.md`, `index.html`, `firebase.json`:

| Texto | Arquivo:linha | Veredito | Motivo |
|---|---|---|---|
| "Build: Vite 6 + jsPDF" | `README.md:29` | **FALSA** | jsPDF não está em `package.json:13-18`, nem em `node_modules`; o PDF é feito pelo "Salvar como PDF" do navegador (`App.tsx:1673`) |
| "Armazenamento duplo: localStorage (local) + Firebase Firestore (nuvem)" | `README.md:31` | **FALSA** | os modos são excludentes — `App.tsx:405` retorna no ramo local e `App.tsx:411-424` só fala com o Firestore; nada escreve nos dois |
| "Segurança Total" | `Login.tsx:100` | **PARCIAL** | a descrição ("Autenticação por UID e registros isolados por conta") é exata e provada em 19.4; o título exagera — não há assinatura de código, 2FA nem blindagem de Electron (19.8) |
| "Garantia de Qualidade" | `Login.tsx:389` | **PARCIAL** | não há suíte de testes nem CI versionada; as asserções do relatório vivem fora do repo |
| "Executável portátil · Relatórios técnicos · Backup sempre" | `Login.tsx:390` | **FALSA** em "Backup sempre" | o backup é manual (Exportar JSON, `App.tsx:652-659`); nenhuma rotina automática de backup existe |
| "Campos Ilimitados" | `Login.tsx:104` | **FALSA** | o próprio texto ao lado diz "1 a 60 disjuntores"; `App.tsx:466` limita a 200/60 |
| "Relatório Profissional — Imprima ou salve em PDF" | `Login.tsx:98` | **PARCIAL** | o auto-print existe no HTML gerado (`report.ts:144`), mas PDF só sai pelo diálogo "Salvar como PDF" do navegador; nada no Electron chama `webContents.print`/`printToPDF`, e imprimir não foi exercido nesta revisão |
| "Exporte e importe todos os registros com 1 clique" | `Login.tsx:101` | **PARCIAL** | exige abrir modal, escolher arquivo e confirmar |
| "Modo local: dados salvos apenas neste dispositivo" | `Login.tsx:192`, `App.tsx:873-874` | **SUSTENTADA** | `localStorage` apenas, `App.tsx:394` |
| "Nuvem ou Local" | `Login.tsx:99` | **SUSTENTADA** | pílulas `App.tsx:863-870` |
| "O `.exe` ainda não é assinado" + instruções SmartScreen | `README.md:51-69`, `README.md:41-44` | **SUSTENTADA** | `package.json:34-39` só configura signtool; nenhuma assinatura produzida |
| "Dados isolados por conta" | `Login.tsx:249` | **SUSTENTADA** | `rules:5-10` + sondas 403 |
| "100%" | `report.ts:98` | **SUSTENTADA** | CSS (`width: 100%`), não promessa |
| "sempre" em "soma sempre as vias A e B" | `App.tsx:1143` | **SUSTENTADA** | `App.tsx:364` calcula, `report.ts:21-25,65` exibe — conforme a decisão tomada |
| "irreversível / recomenda-se exportar backup" | `App.tsx:1473` | **SUSTENTADA** | conselha, não promete |
| "Limpar Banco de Dados" (título) | `App.tsx:1458`, `App.tsx:709` | **PARCIAL** | apaga só os documentos do próprio uid (`preventivaService.ts:107`); o corpo do modal corrige ("associado à sua conta", `App.tsx:1468-1471`) |
| "criptograf", "nunca", "sincroniz", "offline" como promessa | — | **nada encontrado** | nenhum texto afirma criptografia ou sincronização automática |

### 19.8 G) Electron (`electron/main.cjs`, 734 B)

| Item | Estado | Evidência / comentário |
|---|---|---|
| `nodeIntegration` | **false explícito** ✓ | `main.cjs:10` |
| `contextIsolation` | **true explícito** ✓ | `main.cjs:11` |
| `sandbox` | **não declarado** | padrão do Electron 41 é ligado, mas nada no arquivo garante isso (`main.cjs:9-12`); não verificado em runtime |
| `webSecurity` | não declarado (padrão true) | ok |
| CSP | **ausente** | nenhum `<meta http-equiv>` em `index.html:3-7` e nenhum `onHeadersReceived`/`webRequest` no main; `dist-web/index.html` também não tem |
| `setWindowOpenHandler` | **ausente** | `Login.tsx:198` usa `target="_blank"` com `rel="noopener noreferrer"`; num `.exe` isso abre uma `BrowserWindow` do próprio app apontando para o GitHub, em vez do navegador do sistema |
| `will-navigate` | **ausente** | nada impede navegar a janela principal para fora do app — sensível porque a tela é de login |
| `shell.openExternal` | não usado | nenhum `require('electron').shell` no arquivo; validação de destino é desnecessária porque nada abre destino externo controlado — mas ver `setWindowOpenHandler` acima |
| Como o relatório é aberto/impresso | download de `.html` | `report.ts:149-160` cria Blob, ancora `<a download>` e clica; o HTML gerado imprime sozinho (`report.ts:144` `<script>window.onload … window.print()`). Dentro do Electron o clique vira download (não há `will-download`/`savePath`), e o `window.print()` roda apenas se o técnico abrir o arquivo no navegador — o que `App.tsx:1673` diz corretamente |
| Preload/IPC | nenhum | não existe `preload.js` e nenhum `ipcMain`/`ipcRenderer` no projeto — superfície de IPC zerada, o que é o ideal aqui |
| Dev server no `.exe` em modo dev | **quebrado** | `main.cjs:16` carrega `http://localhost:3000`, mas `vite.config.ts:35-41` não fixa `server.port` → o Vite escuta em 5173 (confirmado: `netstat` só tem 5173 LISTENING e `curl localhost:3000` falha com exit 7; `curl localhost:5173` devolve `<title>Preventivas Elétricas</title>`) |

### 19.9 H) Dívidas

**BLOQUEIA a primeira Release**

| Dívida | Justificativa |
|---|---|
| Artefato mais velho que o código: `Portable.exe` 15/10 19:53 vs `src/App.tsx` 16/10 00:37, `Login.tsx` 00:38, `firestore.rules` 00:35 | publicar o `.exe` atual distribui o logout-forçado e os textos antigos que a rodada 18 corrigiu |
| `dist/win-unpacked` apagado, sobrando `win-unpacked.tmp` travado | não dá para inspecionar/rempacotar sem reconstruir; o `.tmp` precisa sair do caminho |
| Regras `invites list/delete` (`rules:23`) não publicadas | a função nova de revogar convite falha em produção para todo admin |
| `preventivas-export-*.json` fora do `.gitignore` | um `git add .` commita 115 registros reais com `uid` |
| `README.md:29` (jsPDF) e `README.md:31` ("armazenamento duplo") | O4 é objetivo do produto; texto falso na página do instalador |
| Ordem do resgate de convite (`Login.tsx:61-62`) | um convite pode ficar reutilizável se a segunda escrita falhar |

**PODE esperar**

| Dívida | Justificativa |
|---|---|
| `src/App.tsx` com 86 KB / ~1700 linhas | dificulta manutenção, mas não afeta o comportamento entregue |
| `tsconfig.json` sem `strict` e sem `include` | `tsc --noEmit` (exit 0, verificado) não cobre os `record: any` de `report.ts:38` e cia |
| Asserções de relatório fora do repo (`%TEMP%\pv-verify`) | perda de histórico de teste; versionar é ganho de processo |
| `allow get: if true` em `invites` (`rules:14`) | expõe metadados do convite a quem tem o token; token de 48 hex torna adivinhação inviável |
| `allow update` de `users` sem uso (`rules:44-47`) | regra ociosa, inofensiva |
| Sem fila de escrita offline (`firebase.ts:7`) | decisão de produto ainda não tomada pelo Rafael |
| Ausência de `setWindowOpenHandler`/CSP | endurecimento recomendado; o app não renderiza conteúdo externo |
| Assinatura de código pendente | sem `.pfx`, é item do Rafael |
| Dossiê `CONTINUE.md` 577 KB e `AUDITORIA.md` 55 KB versionáveis | ruído no repositório; §8.3 lista artefatos que já não existem (`dist/win-unpacked/...`) |
| "chave de storage duplicada" | **não existe**: `preventiva-records`/`preventiva-save-mode` são definidos uma única vez em `src/lib/constants.ts:1-2` e importados por `App.tsx:8` e `dataExport.ts:1` |

### 19.10 I) Ordem do que falta para publicar

Depende de código (posso fazer local, você valida):

1. Adicionar `preventivas-export-*.json` ao `.gitignore` e mover o backup real para fora da árvore.
2. Reconstruir (`npm run build && npm run dist`) e eliminar `dist/win-unpacked.tmp`; o `.exe` da Release tem de nascer depois dessas correções.
3. Corrigir `README.md:29,31` e os títulos de `Login.tsx:100,103,390`.
4. Inverter a ordem em `Login.tsx:61-62` (marcar o convite como usado antes de criar o perfil) ou embrulhar as duas escritas numa transação.
5. Alinhar `main.cjs:16` com a porta real do Vite (ou fixar `server.port`) e acrescentar `setWindowOpenHandler` + `will-navigate` + CSP.
6. Decidir e implementar o comportamento offline do Modo Firebase (cache local do Firestore ou fila própria em `localStorage`), com texto honesto na UI.

Depende do Rafael:

7. `firebase deploy --only firestore:rules` (ou `firestore`) para publicar `rules:23`, e o teste real do painel "Convites pendentes" com sessão de admin.
8. Decisão de negócio sobre a fila offline (item 6) e sobre restringir `get` de `invites`.
9. Certificado `.pfx` para assinatura; sem ele a Release sai sem assinatura com o aviso do README já corrigido.
10. Recriar o repositório git (não há `.git`), fazer o primeiro commit aprovado e criar a Release com o `.exe` novo.
11. Deploy Vercel/Firebase Hosting depois do build reconstruído (a produção ainda serve o bundle antigo).

### 19.11 O que eu faria diferente do plano atual

- **Concordo** com: a correção de sessão do item 3 (falha transitória não derruba login, ausência real de perfil desloga), a regra Corrente Geral DC = A + B sempre, a decisão de deixar a dívida de nomes `tensaoDC`/`tensaoAC`, o `README` honesto sobre assinatura, e o `firebase deploy` restrito a firestore.
- **Faria primeiro** a publicação das regras de convite (item 7) antes de qualquer release com o botão "Revogar" visível: hoje a UI promete ao admin uma função que o backend ainda nega.
- **Faria** a fila de escrita offline antes do primeiro uso em campo, não depois: é exatamente o cenário O1 que motivou o Modo Local, e hoje uma queda de rede em Modo Firebase deixa o registro só na memória da aba.
- **Versionaria** o `edge-report.mjs`/`test.mjs` como `src/lib/report.test.mjs` + `npm run test:report`; as 30 asserções são o único contrato do relatório e não estão no repositório.
- **Não** abriria `allow get` de `invites` para `used == false` sem antes confirmar que a tela de cadastro funciona com `get` autenticado, para não quebrar o fluxo de quem recebe convite por link.

### 19.12 Três listas

**TESTADO DE FATO (executado agora)**

- 30/30 asserções de `buildReportHTML` contra o bundle vivo de `src/lib/report.ts` (saída em 19.6, exit 0).
- 19 casos de borda do relatório, incluindo as 2 quebras documentadas em 19.6.
- 11 sondas anônimas de leitura no banco nomeado (19.4): 1× 200, 1× 404, 9× 403 — nenhuma divergência com as regras locais.
- Varredura binária de `Portable.exe` e `dist-web/` atrás de `service_account`, `private_key_id`, `firebase-adminsdk`, `client_secret`, "Chave preventivas", `BEGIN RSA PRIVATE` (todos 0) e rastreamento das strings `AIza`/`123456` até suas origens reais.
- Troca de Modo Local → Firebase → Local com 1 registro em `preventiva-records`, no navegador, logado na conta de teste: a lista passou a mostrar os 115 documentos da nuvem, o registro local saiu da tela, `localStorage` permaneceu íntegro e nada foi gravado no Firestore. Estado devolvido como estava (0 registros, modo local).
- `npx tsc --noEmit` → exit 0, sem diagnóstico, na árvore atual.

**SÓ LIDO NO CÓDIGO (sem reprodução em runtime)**

- Ausência de fila offline em Modo Firebase (`firebase.ts:7`, `App.tsx:429-434`) e o sumiço do formulário só após recarregar.
- Toast de "N registro(s) apagado(s)" com falhas engolidas por `catch {}` (`App.tsx:736-740,751`).
- Regras × operações da tabela 19.3 (as quatro coleções foram lidas em `firestore.rules`, o código em `userService.ts`/`preventivaService.ts`).
- Todos os itens de `main.cjs` (19.8): ausência de CSP, `setWindowOpenHandler`, `will-navigate`, `sandbox` não declarado.
- Vereditos de honestidade de 19.7 (são textos, não comportamento).

**NÃO FOI POSSÍVEL TESTAR**

- `list`/`delete` de convites como admin autenticado: exige sessão de login do console do Rafael **e** as regras de `rules:23` publicadas. Estado publicado das regras permanece **não verificado**.
- Verificar se as regras locais batem com o publicado para usuários autenticados (sondas anônimas não alcançam esse caminho).
- `runQuery` anônimo no formato REST esperado (o servidor respondeu 400 antes de avaliar regras).
- Comportamento do `.exe` assinado, janela de print do Electron e `sandbox` em runtime — o único artefato existente é mais velho que o código, então testá-lo não mediria o estado atual.
- Escrita em Firestore/Auth: proibida pelo escopo desta revisão.

## 20. Rodada 3 (2026-10-17) — higiene, convite atômico, rascunho offline v1.0

Backups de cada arquivo editado em `%TEMP%\pv-verify\rod3\`. Nada foi commitado, publicado,
deployado ou reconstruído nesta rodada. Nenhuma escrita em Firestore e nenhuma criação de
usuário: os testes de runtime usaram somente `localStorage` do perfil do navegador de dev.

### 20.1 Item 1 — correção de rótulo e movedura do export

- Rótulo corrigido: `.env.example` **NÃO É IGNORADO**. `git check-ignore -q .env.example`
  sai com código 1 e `git add -A -n` lista o arquivo; a linha `.gitignore:13`
  (`!.env.example`) é a **negação** que o mantém rastreado. O que a rodada anterior registrou
  como "IGNORADO <- .gitignore:13" estava errado.
- `preventivas-export-2026-10-16T03-41-39.json` foi **movido** (não apagado) para
  `C:\Users\Rovati\Documents\Backups-Preventivas\` sem abrir o conteúdo. SHA-256 idêntico antes
  e depois: `e39745fe8f1b83d13dcfed3d08d298199faf58d9f4320c78b87e758f5f7d78f6` (488.457 B).
- Identificadores de conta removidos de `AUDITORIA.md` (`:883`, `:884`, `:997` → "conta de
  teste" / "uid omitido"); `grep -c -E "<e-mail>|<uid>" AUDITORIA.md` = 0.
- `ls public` → somente `fundo-site.png`; `public/__probe-sw.js` ausente; `grep -o -i probe` em
  `dist-web` = 0 ocorrências; nenhum service worker referenciado no código.

### 20.2 Item 2 — cadastro por convite em um único `writeBatch`

`src/lib/userService.ts:39-59` (`redeemInviteAndCreateProfile`) grava `users/{uid}` e marca
`invites/{token}` no mesmo commit; `markInviteAsUsed` foi removido e `updateDoc` saiu dos
imports. Ordem mantida (perfil primeiro, convite depois), porque `get()` dentro de um batch vê
o estado **anterior** ao commit. `firestore.rules` não foi alterado: o batch passa em
`rules:28-43` (create de `users`, incluindo o `get()` do convite) e em `rules:16-21` (update do
convite, que exige `used == false` no documento pré-commit); se o convite já estiver usado,
`rules:17` aborta o commit inteiro. Caminho do primeiro admin (`createUserProfile` +
`markFirstAdminCreated`) intacto. **Não testado contra o Firebase** — exige login real.

### 20.3 Item 3 — rascunho automático e aviso de registros somente locais

- `src/lib/constants.ts:3` — `DRAFT_KEY = 'preventiva-draft'` (`STORAGE_KEY`/`MODE_KEY` intactos).
  `src/lib/firebase.ts` não foi tocado: continua sem cache persistente nem fila de escrita.
- `src/App.tsx:241-245` — estados `pendingDraft`, `failedRecord`, `localOnlyCount` e os refs
  `draftHydrated`, `draftPending`.
- `src/App.tsx:530-596` — `buildFormSnapshot()` (26 campos), `isFormEmpty()`, `clearDraft()`,
  leitura do rascunho no boot e autosave com debounce de 800 ms **somente para registro novo**
  (bloqueado por `editingId` e enquanto houver rascunho pendente de decisão).
- `src/App.tsx:598-611` + `:1035-1043` — em Modo Firebase, aviso com a contagem real de
  `preventiva-records` e a ponte Exportar JSON → Importar JSON. A palavra "sincronização" não
  aparece em nenhum texto novo.
- `src/App.tsx:613-658` — `restoreDraft()` / `discardDraft()`; o aviso do boot traz
  Restaurar/Descartar e diz "Há um rascunho não salvo" com ticket e data.
- `src/App.tsx:660-675` + `:1435-1450` — `saveFailedRecordLocally()` grava o MESMO registro em
  `preventiva-records` e o botão "Salvar neste dispositivo (Modo Local)" é oferecido na falha do
  Modo Firebase, com confirmação "Salvo só neste dispositivo. NÃO foi enviado ao Firebase."
- `src/App.tsx:773-781` — o rascunho é apagado depois de salvar um registro novo com sucesso
  (uma atualização de registro não apaga o rascunho de um registro diferente).

Teste real no navegador (`http://localhost:5173`, modo Local, sem escrita externa):
rascunho gravado 800 ms depois de digitar; reload mostra o aviso com Restaurar/Descartar;
Restaurar devolve data, ticket, temperatura e site; o rascunho passa a acompanhar a edição;
Descartar apaga a chave; "Limpar" apaga a chave; salvar um registro novo no Modo Local apaga o
rascunho e grava `preventiva-records`. O aviso de contagem mostrou o texto exato com 2 registros
locais. `npx tsc --noEmit` = 0 erros; console sem erros nem avisos; `preventiva-records` e
`preventiva-draft` devolvidos a vazio/local ao final.

**Pendente de decisão (não inventado):** com o canal de escrita do Firestore inacessível,
`savePreventiva` **não rejeita** — o SDK reabre `/Firestore/Write/channel` em backoff e a
promessa fica pendurada (11 tentativas em ~90 s com `fetch` bloqueado; 10 tentativas em ~40 s
com o host trocado por `127.0.0.1:9`, porta recusada; em nenhum caso saiu requisição para
`firestore.googleapis.com`). Enquanto isso, a UI fica em "Salvando no Firebase…" e o botão de
fallback nunca aparece. Dá para o aviso do Item 3.1 (rascunho) já cobre o pior cenário — o
registro sobrevive ao reload — mas o botão só dispara quando o SDK realmente rejeita (por
exemplo `permission-denied`). Um timeout de gravação é decisão de negócio: depois do timeout o
canal ainda pode abrir e gravar, o que criaria duplicado com o arquivo local.

### 20.4 Item 4 — textos que prometem o que não existe (aplicados)

- `README.md:21` — tabela diz `Vite 6` (a versão real instalada é 6.4.3; `package.json` confere).
- `README.md:31-34` — "Dois modos excludentes": Modo Local (`localStorage`, só neste computador)
  **ou** Modo Firebase (Firestore, por conta); o app salva em um dos dois por vez e **não existe
  cópia automática entre eles**; a ponte manual é Exportar JSON → Importar JSON. Não há mais
  nenhuma frase de "sincronização" ou "backup automático" no README.
- `src/components/Login.tsx:97` — card "Relatório em HTML": "Baixe o relatório em HTML para
  imprimir ou salvar em PDF pelo navegador" (descreve o que `downloadReport` faz de fato:
  `report.ts:153-164` gera um `.html` por blob + `<a download>`, e o print é o do navegador).
- `src/components/Login.tsx:99` — card "Segurança": "Autenticação por usuário UID e registros
  isolados por conta no Firestore" (nada sobre criptografia em repouso, 2FA ou auditoria).
- `src/components/Login.tsx:103` — card de circuitos: "Até 200 circuitos (QDF/QDCC) ou 60
  (PDT/OUTRO)", com a fonte real em `src/App.tsx:472` (`maxCircuitos = isViaAB(tipo) ? 200 : 60`).
- `src/components/Login.tsx:389` — rodapé do modal de boas-vindas passou a listar
  "Exportação e importação em JSON" em vez de "Backup".
- `src/App.tsx:1106` e `:1683` — botão e título do modal agora dizem "Limpar meus registros";
  `src/App.tsx:1695` — corpo "no Firebase, somente os registros da sua conta."; `src/App.tsx:883`
  — toast "Apenas administradores podem limpar os registros." O texto bate com
  `deleteAllPreventivas(uid)`, que filtra `where('uid','==',uid)` (`userService.ts`).

**Proposto, NÃO aplicado** (falta aprovação do Rafael): o card `Login.tsx:381-389` ainda tem o
título "Garantia de Qualidade", que sugere um processo de certificação/QA que não existe no
repositório, e o corpo "Executável portátil · Relatórios técnicos · Exportação e importação em
JSON". Substituição sugerida, cada termo verificável no repo:

- título: **Distribuição**
- corpo: **Executável portátil para Windows, sem instalação e sem assinatura de código ·
  Relatório em HTML para imprimir ou salvar em PDF pelo navegador · Exportação e importação em
  JSON**

O "sem assinatura de código" é o que já está em `README.md` (seção "Assinatura de código
(pendente)"); trocar só o título sem mudar o corpo manteria a promessa vaga.

### 20.5 Item 5 — Electron e Vite

- `vite.config.ts:35-43` — `server.port = 5173` com `strictPort: true` (antes o Electron apontava
  para 3000, porta que nenhum script do projeto sobe). O comentário corrompido (mojibake) foi
  reescrito em ASCII; a lógica de `hmr`/`watch` condicionada a `DISABLE_HMR` está intacta.
- `electron/main.cjs` (58 linhas) — `sandbox: true` somado a `nodeIntegration: false` e
  `contextIsolation: true`; `setWindowOpenHandler` permite **somente** `https://github.com/rovateduino/`
  via `shell.openExternal` e nega o resto; `will-navigate` bloqueia navegação fora da URL do app
  (dev: `http://localhost:5173`; prod: `file://…/dist-web/index.html`); a URL de dev foi alinhada
  para 5173.
- Executado de verdade: `npx electron .` (produção) abriu a janela e o único aviso no stderr foi
  o `Insecure Content-Security-Policy` do próprio Electron; `NODE_ENV=development npx electron .`
  mostrou `[vite] connected.` e o app montado. Os encerramentos com "Renderer process crashed /
  Network service crashed" apareceram **só** nas execuções cortadas por `timeout` (SIGTERM,
  exit 143); em reexecução limpa não ocorreram.
- **Proposta de CSP (não aplicada, não testada):** `<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'
  data: blob:; font-src 'self'; connect-src 'self'
  https://identitytoolkit.googleapis.com https://securetoken.googleapis.com
  https://firestore.googleapis.com; form-action 'self'; base-uri 'self'; object-src 'none'">`.
  Inventário real dos hosts: `grep` de URLs externas em `src` só devolve
  `http://www.w3.org/2000/svg` (namespace de SVG, não rede) e o link de releases no rodapé;
  `firebase.ts:1-8` usa apenas Auth + Firestore, então os três hosts acima são o tráfego de
  rede. `style-src 'unsafe-inline'` é necessário hoje (Tailwind 4 + estilos inline nos cards do
  Login). Roteiro de validação antes de aplicar: (1) `npm run build` e `npx electron .` — login,
  cadastro por convite, salvar/ler no Modo Firebase e exportar JSON/relatório; (2) mesma bateria
  em dev com HMR, que vai **quebrar** se a meta entrar sem liberar `ws://localhost:5173` e
  `http://localhost:5173` — por isso a sugestão é injetar a meta só no build de produção; (3) o
  `<script>` de auto-print do relatório vive num documento à parte (blob baixado), que não herda
  a CSP do app. Nada disso foi exercitado: a meta não foi escrita.

### 20.6 Item 6 — robustez do relatório e contrato de testes

- `src/lib/report.ts:29-42` e `:50-69` — `usesTresFasesRecord`, `hasNomesRecord` e
  `buildReportHTML` tratam `record.circuitos` ausente/`não-array` como lista vazia, `record.site`
  ausente vira `{}`, e cada célula usa `c?.n`, `c?.viaA` etc.; `dash()`/`esc()` produzem `-` ou
  texto escapado. `downloadReport` (`:159`) usa `record.site?.sigla || 'sem-site'` e
  `record.data || 'sem-data'` no nome do arquivo.
- `src/lib/report.test.mjs` (novo, versionado) + `package.json` `"test:report":
  "node src/lib/report.test.mjs"` — roda direto no Node 24 (type-stripping do `.ts` importado),
  sem build. Saída atual: **56 asserções PASS**, sem falhas.
- `tsconfig.json` — bloco `"include": ["src", "vite.config.ts"]` adicionado sem ligar `strict`;
  `npx tsc --noEmit` = 0 erros.

### 20.7 Item 7 — leitura de perfil com teto de 10 s e retomada quando a rede volta

- `src/lib/userService.ts:74-91` — `PROFILE_READ_TIMEOUT_MS = 10000`, `withTimeout()` e
  `getUserProfile` envolvendo o `getDoc`. O motivo está comentado no arquivo: uma leitura sem
  resposta não pode ser lida como "documento ausente", sob pena de deslogar quem só estava sem
  rede.
- `src/App.tsx:113-146` — `readProfile` captura o erro, mantém a sessão (`setUserRole('user')`) e
  chama `scheduleProfileRetry`, que avisa "Falha ao ler sua autorização no Firebase (tentativa N
  de 3). A sessão foi mantida." e agenda 2 s / 4 s / 8 s; na quarta entrada o texto passa a
  "Não foi possível confirmar sua autorização no Firebase. Você continua logado com acesso
  padrão." `src/App.tsx:167-175` — listener `online` relê **uma** vez, só se há aviso na tela,
  nenhum leitura em andamento e nenhum retry agendado; `src/App.tsx:84-87` — `showWarning()`
  espelha o texto em `profileWarningText` justamente para essa guarda. O cleanup
  (`src/App.tsx:178-183`) incrementa `authGeneration`, limpa o timer, remove o listener e
  cancela o subscribe de Auth.
- Teste real no navegador com um probe temporário de `window.fetch` (devolve `Promise` que nunca
  resolve para `firestore.googleapis.com` enquanto `pv-probe-block === '1'`), login pré-existente
  preservado (Auth usa `identitytoolkit`, não bloqueado):
  1. reload a frio → 10 s depois `console.error` com `Error: profile-timeout` (o stack do
     navegador aponta para o módulo servido por Vite, `/src/lib/userService.ts?t=…:62:43` — linha
     da transformação, não a linha-fonte `userService.ts:80`) e o banner `[role=status]` na tela;
  2. o SDK do Firestore também logou o próprio teto de 10 s ("Could not reach Cloud Firestore
     backend… operate in offline mode"), e as tentativas seguintes rejeitaram na hora com
     `Failed to get document because the client is offline` — ou seja, depois do primeiro timeout
     as tentativas são baratas. O banner foi lido aos ~12 s já em "tentativa 3 de 3" e depois no
     texto final de acesso padrão; as tentativas 1 e 2 não foram amostradas uma a uma, a escada
     é o que os três `console.error` em sequência mostram.
  3. sessão **não** derrubada (cabeçalho seguiu com a conta de teste e "Sair");
  4. liberado o bloqueio e disparado `window.dispatchEvent(new Event('online'))` **sem reload**:
     uma única releitura, banner sumiu (`document.querySelector('[role=status]')` → `null`),
     nenhum erro novo no console.
  O probe foi removido em seguida: `index.html` confere byte a byte com o backup
  (`diff` vazio, SHA-256 `2ae3eb1657361ea9…5f2838` igual ao `.bak`) e `pv-probe-block` foi apagado
  do `localStorage`.

### 20.8 Item 8 — rótulo "Geral DC (A+B)"

- Decisão aplicada: só o **rótulo** muda. `src/lib/report.ts:69` (linha do relatório),
  `src/App.tsx:1322` (campo do formulário, `aria-label` alinhado em `:1324`) e `src/App.tsx:1800`
  (visor) agora dizem `Geral DC (A+B)`. Sem campo de versão, sem migração, sem mexer em
  `getCorrenteGeralDC` (`report.ts:21-25`) nem na chave persistida `medicaoCorrente.geral`.
- `grep -rn "Corrente Geral DC" src` = 1 ocorrência, e é a asserção negativa do teste
  (`report.test.mjs:96`, "rotulo antigo nao aparece mais"). Em `AUDITORIA.md` e `CONTINUE.md` as
  ocorrências antigas ficam como registro histórico das rodadas anteriores.
- Asserções novas em `report.test.mjs:95-97` e `:103`: rótulo presente com o valor `30.0 A`,
  rótulo antigo ausente, linha única, e o caso sem `medicaoCorrente` continua imprimindo a geral
  sem `undefined`. Suite: **56 PASS**.
- Prova em runtime (não só no teste): formulário QDF mostra o rótulo novo (`label` lido do DOM =
  `Geral DC (A+B)`), um registro salvo em Modo Local com Via A 15,0 + Via B 27,0 exibiu
  "Geral DC (A+B) 42.0 A" no visor, e o HTML real gerado por `buildReportHTML` dentro do navegador
  contém `<tr><td>Geral DC (A+B)</td><td>42.0 A</td></tr>`. O registro de teste foi apagado na
  sequência; `preventiva-records` voltou a `[]` sem rascunho nem chave de probe.
- **Nota de cobertura (o que o rótulo garante):** a verificação "geral = soma(Via A) +
  soma(Via B)" dos §18.6/20.8 mede **115/115 registros da conta de teste**, todos via-AB
  (70 QDF + 45 QDCC). Não é medição de todas as contas nem do dataset histórico completo, e não
  houve recontagem nesta rodada. O rótulo "Geral DC (A+B)" afirma a regra de cálculo do app — que
  é o que o formulário sempre gravou (`App.tsx` soma `sumViaA + sumViaB`) —, e não uma auditoria
  dos números já salvos por outros usuários. Registros legados anteriores ao fix do spread
  condicional (39 sem `viaSelecionada`, contados na conta de teste) seguem com o valor
  aritmético igual, mas isso também só foi conferido nessa conta.

## 21. Rodada 4 (2026-10-17) — cartão "Distribuição", id de criação no cliente e aviso soft de 15 s

Restrições vigentes nesta rodada: nada de commit/push/Release/deploy Vercel/`firebase deploy`;
nada de escrita em Firestore ou no Auth; nenhuma credencial lida ou repetida; backup com SHA-256
antes de cada edição. **Todos os quatro backups desta rodada foram tirados ANTES da edição
correspondente** e os hashes abaixo são dos próprios arquivos de backup (recomputados no fim).

Backup em `%TEMP%\pv-verify\rod4\`:

| Arquivo | SHA-256 do backup (pré-edição) | SHA-256 após a edição |
|---|---|---|
| `index.html` | `2ae3eb1657361ea90277606410f1d765aa33eaff11b793f25bdf0b4a255f2838` | idêntico (sonda removida, byte a byte igual) |
| `src/App.tsx` | `9995d5239f5ff675a16806932dbb148ac3f25a6e73eaac5931d20703df2c46e3` | `253a128f7c0f38f9fa81153923c933bc6926e2cc75b4c6767330a7394776f7f2` |
| `src/lib/preventivaService.ts` | `f7b1e3eb9a7ffc636fca7f2a1ca78b6c07649076b5264bad99afe36c0922562f` | `e853d84855bd58500de6311bda36d4ff82302635bfb5f1a89bc142a577776fea` |
| `src/components/Login.tsx` | `0e01b5c8f7ca6c1bd761c966f6686c557bef55288252ad00056d36ad104b4835` | `1e07913d4a5e1c58280ed3ec95dad33aa28408a1a7c1789241518aabe9c13b73` |

### 21.1 Item 1 — cartão de distribuição do Login

Texto aprovado aplicado em `src/components/Login.tsx:388-389` (duas linhas alteradas, nada mais no
arquivo): o título `Garantia de Qualidade` passa a **`Distribuição`** e o corpo passa a **`Executável
portátil para Windows, sem instalação e sem assinatura de código · Relatório em HTML para imprimir ou
salvar em PDF pelo navegador · Exportação e importação em JSON`**. Lido no DOM da tela de login
renderizada, antes do build.

### 21.2 Item 2 — criação com id do cliente + aviso de não-confirmação (soft, 15 s)

**Serviço** (`src/lib/preventivaService.ts:53-58`): `newPreventivaDocId()` deriva o id de
`doc(collection(db, COLLECTION))` pelo SDK, sem rede. `savePreventiva` recebe o id como segundo
argumento e grava com `setDoc(doc(db, COLLECTION, docId), payload)`; o campo `id` do formulário
continua **fora do payload** (spread `...rest`), então o que a regra enxerga é o `uid` do documento.
`addDoc` saiu do import. `updatePreventiva`, `importPreventivas`, `getPreventivas`,
`deletePreventiva` e `deleteAllPreventivas` ficaram intocados.

**Tela** (`src/App.tsx`): `SAVE_SOFT_CONFIRM_MS = 15000` (`:66`); estado/refs novos em `:259-263`
(`unconfirmedSave`, `pendingCreateId`, `saveSoftTimer`, `createAttempt`, `locallySavedIds`); helpers
`clearSaveSoftTimer`, `abandonCreateAttempt` (`:436`) e `reconcileLateCreate` (`:443`); ramo de
criação de `persist` reescrito (`:475-497`). O timer **dispara o aviso sem rejeitar nem cancelar a
promessa**: o `await savePreventiva(...)` segue em aberto e o `finally` (`:486-489`) limpa timer e
aviso quando ela finalmente resolve. `abandonCreateAttempt()` é chamado no fim de `resetForm()`
(`:596`) e na primeira linha de `startEdit()` (`:776`), então trocar de registro nunca contamina o formulário
em uso; se a escrita antiga confirmar depois, `reconcileLateCreate` recarrega a lista e avisa da
possível duplicidade sem tocar no formulário atual. Rascunho: `handleSave` só chama `clearDraft()`
quando `persist` devolve `true` (`:872-876`) — **o rascunho é apagado somente com confirmação do
servidor** e permanece durante o aviso.

**Regras de segurança (prova por leitura, zero escrita):** `firestore.rules:4-10` tem
`allow create: if request.auth != null && request.auth.uid == request.resource.data.uid` e **não
impõe nenhuma forma para `{preventivaId}`**. `setDoc` em documento inexistente é classificado como
**create**, então o caminho novo satisfaz a regra exatamente como `addDoc` satisfazia (payload com
`uid == user.uid`, injetado em `App.tsx:485`). Uma segunda tentativa com o mesmo id é classificada
como **update**, e a cláusula `update` (`resource.data.uid == request.resource.data.uid`) também é
satisfeita porque o `uid` gravado é o mesmo. Conclusão: `addDoc` → `setDoc` com id do cliente **não
exige alterar `firestore.rules`**. Status de implantação das regras no projeto Firebase: informado
pelo Rafael, **não verificado por mim** nesta rodada.

**Teste no navegador sem escrever no Firebase:** sonda temporária em `index.html` interceptando
`fetch` **apenas** para `firestore.googleapis.com` (Auth e securetoken liberados; sessão
preservada). Resultados medidos: o aviso não-bloqueante apareceu em **16,8 s** (timer de 15 s +
granularidade do `setInterval` de 50 ms usado para observar); os dois botões funcionaram ("Continuar
aguardando" fecha o aviso e mantém a promessa e o id reservado; "Salvar neste dispositivo (Modo
Local)" grava em `localStorage` e mostra o toast que avisa explicitamente que o envio original ainda
pode chegar e criar duplicata); `preventiva-draft` **permaneceu** enquanto o aviso esteve ativo.
Evidências de que nada chegou ao servidor: contagem da sonda **10 chamadas bloqueadas / 0 não
bloqueadas**; recarregamento com o bloqueio ainda ativo (descarta a fila, pois o Firestore daqui não
usa cache persistente); a leitura somente-consulta `getPreventivas` da conta de teste seguiu
retornando **115 registros** e nenhum ticket de teste apareceu. Ao final a sonda foi removida e
`index.html` voltou a ser byte-idêntico ao backup (SHA-256 acima; `grep -c pv-probe` = 0).

**Não verificado por teste:** o reuso efetivo do mesmo id ao salvar duas vezes o mesmo formulário —
observar isso exigiria duas escritas reais no Firestore, proibidas nesta rodada. A garantia é de
leitura: `pendingCreateId.current` só é renovado quando está `null` (`App.tsx:477`) e volta a `null`
somente após confirmação bem-sucedida (`:495`) ou abandono da tentativa.

### 21.3 Item 3 — git, varredura de segredos e validações

`git status --short` **não pôde ser executado**: `git rev-parse --is-inside-work-tree` responde
`fatal: not a git repository (or any of the parent directories): .git` e não há `.git` em
`Preventivas-Eletricas`, `Projetos AI` nem `Documents`. O repositório dito criado pelo Rafael não
está neste caminho — **pendente confirmar onde o repositório fica** antes de qualquer commit.
Evidência substituta (simulação fiel fora do projeto, com cópia do `.gitignore` e
`git check-ignore -q` por caminho): dos 51 arquivos reais (excluindo `node_modules/` e `.git/`),
**38 ficariam rastreáveis** e **13 ignorados**. Entre os ignorados estão exatamente os proibidos:
`Firebase Chave preventivas-eletricas.json`, `CONTINUE.md`, `dist/**`, `dist-web/**`; `.env*` é
ignorado com a exceção `!.env.example` (rastreável por design).

Varredura de padrões de segredo **somente nos 38 rastreáveis** (contagens; nenhum valor foi lido ou
impresso): `service_account` 3, `private_key_id` 2, `firebase-adminsdk` 4, `client_secret` 6,
`BEGIN RSA PRIVATE` 3, `BEGIN PRIVATE KEY` 1 — **todas as ocorrências em `AUDITORIA.md`** e apenas
como menções narrativas desta auditoria. Checagem estrutural de `AUDITORIA.md`: 0 marcadores PEM
exatos, 0 strings `AIza` com 30+ caracteres, 0 tokens `ya29.`/`GOCSPX-`, 0 linhas de corpo PEM.
`firebase-applet-config.json` contém 1 `AIza`: a `apiKey` **pública** de app web do Firebase (junto
de `appId`, `authDomain`, `storageBucket`, `recaptchaSiteKey`, `oAuthClientId`); 0 ocorrências de
`type`, `client_email` ou `private_key`; é importada por `src/lib/firebase.ts:4` como config de
cliente, não segredo. `.env.example` só tem placeholders, com aviso explícito de não pôr chave real.
**Nenhum segredo, export JSON, `CONTINUE.md`, `dist/` nem `node_modules/` entre os rastreáveis.**
Ressalva: dois HTMLs gerados por download antigo estão rastreáveis e mereceriam uma regra de ignore
antes de um commit — `preventiva-AAL-2026-10-16.html` e `dados/preventiva-OCO-SA-2026-08-24.html`
(decisão do Rafael).

Validações com saída real colada na resposta da rodada: `npx tsc --noEmit` → sem saída, exit 0;
`npm run test:report` → **TODOS OS TESTES PASSARAM (56)**, exit 0, sem ajuste porque o Item 2 não
tocou `src/lib/report.ts`; `npm run build` → `vite v6.4.3`, 1699 módulos transformados, 8 chunks,
`built in 4.94s`, exit 0.

### 21.4 Item 4 — **item 4 não executado**

O reinício do PC não foi confirmado pelo Rafael nesta rodada, então o rebuild do `.exe`, as buscas
em `app.asar`, a varredura binária de segredos, o `Start-Process` e a checagem de limpeza **não foram
feitos**. Registro para a próxima rodada: `dist/win-unpacked.tmp` **ainda existe** (1 arquivo,
116 KB: `resources/default_app.asar`), resíduo de execução interrompida do electron-builder;
`dist/Preventivas Elétricas 1.0.0 Portable.exe` também segue presente. Ambos ignorados pelo git.

### 21.5 Achaques desta rodada (nada corrigido sem autorização)

1. **Modo Local volta sozinho após recarregar — só em dev.** `src/main.tsx` sempre renderiza
   `<StrictMode>`; o duplo-mount de desenvolvimento corre `App.tsx:280` (restaura `MODE_KEY`) contra
   `App.tsx:290` (persiste `saveMode`) e o modo recai em `local` no F5. Em build de produção não há
   double-invoke e a persistência já foi verificada na porta 4173. Contornado no teste re-clicando
   "Firebase" na UI; não re-verificado em produção porque exigiria login real em outra origem,
   proibido pela regra da rodada.
2. Escrita no Firestore usa o stream `/Firestore/Write/channel` e o SDK retenta em backoff
   indefinido: a promessa de escrita **não rejeita** quando a rede cai. Por isso o Item 2 foi
   desenhado como aviso *soft*, que não cancela nem trata a ausência de confirmação como falha.
3. `index.html` é o único ponto de entrada e voltou byte-idêntico; nenhuma sonda sobreviveu.

### 21.6 As três listas da rodada

**TESTADO DE FATO (navegador/CLI, com evidências acima):** texto novo do cartão "Distribuição" no
DOM; aviso soft aos ~15 s com os dois botões; rascunho mantido durante o aviso e apagado só com
confirmação; salvamento local com toast de risco de duplicata; nenhuma escrita no Firebase (10/0 na
sonda + lista ainda com 115 registros); sessão mantida durante todo o teste; `index.html` restaurado
byte-idêntico; `tsc`, `test:report` (56 PASS) e `build` com exit 0; varredura de segredos nos
rastreáveis.

**SÓ LIDO NO CÓDIGO:** compatibilidade de `setDoc` com as cláusulas `create`/`update` de
`firestore.rules:4-10`; reuso do id dentro do mesmo formulário (`:477`/`:495`); invalidação por
`createAttempt` e `reconcileLateCreate` quando a promessa antiga confirma depois do abandono;
limpeza do timer no `finally`; o texto do aviso e dos botões confere com o aprovado.

**NÃO FOI POSSÍVEL TESTAR:** `git status --short` (repositório ausente neste caminho); reuso real de
id com duas escritas confirmadas; o aviso contra um Firebase real com queda de rede (exigiria
escrita); rebuild do `.exe` e checagens do Item 4 (reinício não confirmado); persistência de modo em
produção após F5 (exigiria login real em outra origem).

## 22. Ícone e marca do app (2026-10-18) — antes não existia nenhum

**Diagnóstico com evidência (estado anterior):** o projeto não tinha ícone algum. `package.json` →
`build.win` só tinha `target`/`signtoolOptions`, sem a chave `icon`; `electron/main.cjs` criava o
`BrowserWindow` sem `icon`; `index.html` não tinha `<link rel="icon">`; e a busca por `*.ico`,
`*.icns`, `favicon*` no repo devolveu 0 arquivos. Consequência: o `.exe`, a barra de tarefas e a aba
do navegador mostravam o ícone padrão do Electron. Na UI, a "marca" era o raio `Zap` da lucide-react
sobre um quadrado `bg-red-600` (cabeçalho e bloco de marca do login) e um `Shield` branco no tile
esmeralda do modal "Sobre" — cores que não conversavam com o tema esmeralda/teal do resto da tela.

**Armadilha evitada:** `.gitignore:2` ignora `build/`, que é justamente o diretório-padrão do
electron-builder (`directories.buildResources`). Um `build/icon.ico` entraria no repositório como
nada e, num clone limpo, o `.exe` voltaria silenciosamente ao ícone do Electron. Os ativos foram
colocados em caminhos rastreados (verificado com `git check-ignore -q` na simulação: os cinco
arquivos novos retornam RASTREADO).

**Arquivos novos:**

| Caminho | Papel | Conteúdo |
|---|---|---|
| `src/assets/app-mark.svg` | fonte única da arte (256×256, viewBox próprio) | SVG: quadrado arredondado com gradiente esmeralda (#34d399→#10b981→#0d9488), contorno de quadro elétrico branco a 30% e raio branco com sombra interna |
| `icons/icon.ico` | ícone embutido no `.exe` | ICO tipo 1, 8 entradas PNG (16/24/32/48/64/96/128/256), 115.645 B |
| `electron/icon.png` | ícone da janela em runtime | PNG 256×256 (dentro de `electron/**/*`, que é empacotado) |
| `public/favicon.ico` | aba do navegador / `file://` | ICO com entradas 16/24/32/48/64, 14.199 B |
| `public/app-touch-icon.png` | `apple-touch-icon` | PNG 180×180 |

**Rasterização sem instalar dependência:** sem ImageMagick/Inkscape/rsvg no ambiente, os PNGs saíram
do próprio Chromium do Electron (`node_modules/electron/dist/electron.exe`) numa janela offscreen:
SVG → `Image` → `canvas.drawImage` → `toDataURL('image/png')` por tamanho, e o `.ico` foi montado em
Node puro (cabeçalho + entradas apontando para os PNGs). O script ficou em
`%TEMP%\pv-verify\rod5\raster\` (fora do projeto, nada de dependência nova adicionada).

**Edições:**
- `package.json` → `build.win.icon = "icons/icon.ico"`.
- `electron/main.cjs` → `icon: join(__dirname, 'icon.png')` no `BrowserWindow`.
- `index.html` → `<link rel="icon" href="./favicon.ico" sizes="any">` e
  `<link rel="apple-touch-icon" href="./app-touch-icon.png">`. O `./` é obrigatório:
  `vite.config.ts` usa `base: './'` e o app empacotado carrega `file://.../dist-web/index.html`.
- `src/App.tsx` → import `appMark` + `<img src={appMark}>` no lugar do quadrado vermelho; `Zap`
  removido do import (era usado só ali).
- `src/components/Login.tsx` → mesma marca no bloco de entrada e no tile do modal "Sobre"; `Shield`
  removido do import (usado só nos dois lugares trocados). `Zap` continua no import porque ainda
  alimenta a lista de recursos (`Login.tsx:96`).

**Provas obtidas (todas locais, nenhuma escrita em Firebase):**
1. `npx tsc --noEmit` exit 0; `npm run build` exit 0 com 1700 módulos (antes 1699 — o SVG entrou no
   grafo) e o SVG embutido como data URI no bundle (Vite inlina assets < 4 kB; `find dist-web -name
   '*.svg'` = 0 arquivos soltos).
2. Estrutura do `.ico` reanalisada por parser próprio: tipo 1, entradas consistentes, sem
   sobreposição, último byte usado = tamanho do arquivo, assinatura PNG conferida em cada entrada.
3. `require('app-builder-lib/out/util/iconConverter.js').convertIcon({sources:['icons/icon.ico'],
   format:'ico'})` → `{isFallback:false, icons:[{file:'icons\\icon.ico', size:256}]}`. Ou seja: o
   electron-builder aceita o ICO diretamente (o código exige tamanho máximo ≥ 256 e **não** chama o
   conversor externo nesse caminho) — prova de que o próximo `npm run dist` vai embutir este ícone.
4. `nativeImage.createFromPath` no Electron: `electron/icon.png` → 256×256 não-vazio;
   `icons/icon.ico` → 256×256 não-vazio; janela criada com o ícone sem erro.
5. Navegador (build servido em 4173): `link[rel=icon]` resolve, `favicon.ico` responde 200 com
   `image/x-icon` e decodifica no Chrome (64×64 = maior entrada ≤ 64), `app-touch-icon.png` decodifica
   180×180, `<img>` da marca com `naturalWidth` 256, console sem nenhuma mensagem.
6. Render real no Electron com o bundle de produção via `file://`: captura offscreen do **cabeçalho**
   (marca a 36 px) e, forçando `preventiva-save-mode=firebase` sem sessão, da **tela de login** com a
   marca a 56 px — as duas mostram o logo novo. Único console-erro do run offscreen é o aviso
   "Insecure Content-Security-Policy", que só aparece fora do pacote e é esperado (CSP continua sem
   aplicar, decisão registrada em §20.5).
7. Tailwind: os utilitários novos (`shadow-emerald-950/50`, `ring-emerald-300/30`) existem no CSS
   gerado e os antigos do bloco vermelho (`shadow-red-950/50`, `ring-red-400/30`) **sumiram** — prova
   de que a marca antiga foi realmente removida e de que a nova está estilizada de verdade.

**Não verificado:** o ícone como aparece no Explorador do Windows e na barra de tarefas depois do
rebuild — depende do `npm run dist`, que exige o reinício do PC confirmado (Item 4 da Rodada 4, ainda
pendente). O raio a 16 px fica macio (o contorno do quadro quase desaparece); se o Rafael quiser, dá
para gerar uma variante simplificada só para 16/24 px.

**Achaques para decisão (nada alterado):** o vermelho forte não estava só na marca — ele é a cor de
ação do app inteiro: botão "Entrar" (`Login.tsx:171`), selo "Elétrica" do modal (`Login.tsx:301`), os
dois chips de modo de salvamento (`App.tsx:1181`/`1185`, ambos `bg-red-600` quando ativos), barra de
progresso (`App.tsx:1813`) e os botões de apagar/exportar/importar/limpar (`App.tsx:1593`, `1702`,
`1724`, `1845`, `2012`). Com a marca agora esmeralda, o chip "Local" vermelho e o botão "Entrar"
vermelho passam a brigar com o logo — é decisão de identidade, não bug. O tile da tarjeta de download
(`Login.tsx:206`) mantém o ícone `Download`, que é semântico e não foi trocado.

**Estado do ambiente ao final:** dev server reativado em 5173 (servindo o `App.tsx` novo, favicon 200)
e preview do build em 4173. Perfis Electron temporários criados pelas validações
(`%APPDATA%\pv-raster`, `pv-iconcheck`, `pv-prodcheck`, `pv-prodshot`, `pv-prodshot2`) foram apagados.
Nenhum commit, push, deploy ou `firebase deploy`; nenhum `.exe` reconstruído **até este momento** — o
rebuild e a validação do ícone no `.exe` estão registrados em §22.8.

### 22.8 Build de produção executado e validado (18/10, complementa e corrige §22)

**Decisão do Rafael registrada:** manter o vermelho das ações exatamente como está ("mantém o vermelho,
caso eu não goste depois eu mudo"). **Nenhuma alteração de código foi feita** para os itens de cor — os
achaques de identidade do parágrafo anterior continuam válidos e abertos.

**1) `npm run dist` padrão falhou por motivo ambiental, não pelo ícone.** Saída real (log
`%TEMP%\pv-verify\rod5\build3.log`):

```
⨯ Failed to move directory from ...\dist-producao\win-unpacked.tmp to ...\dist-producao\win-unpacked:
EBUSY: resource busy or locked, unlink '...\win-unpacked.tmp\resources\default_app.asar';
last rename error: EPERM: operation not permitted, rename ...
  at moveDirAtomic (node_modules\app-builder-lib\src\util\electronGet.ts:243)
  at extractArchive (...\electronGet.ts:321)
  at unpack (...\electron\ElectronFramework.ts:259)
```

Diagnóstico com evidência: a falha é sempre no `moveDirAtomic` do *unpack do Electron*; `ReadAllBytes`
do `default_app.asar` funciona (111.073 bytes) mas abrir com `FileShare.None` falha com "sendo usado por
outro processo" — ou seja, existe alça aberta apenas sobre arquivos `.asar` **dentro do workspace**;
nenhum `electron.exe` do projeto estava rodando (só o `esbuild` do dev server, PID 25240) e
`MsMpEng` (4140), `MpDefenderCoreService` (4208), `NisSrv` (5660) e `SearchIndexer` (5536) estão ativos.
O mesmo `default_app.asar` em `node_modules\electron\dist\resources\` está travado da mesma forma, e um
`rm` dentro de `%TEMP%` nunca falhou — o lock é localizado no diretório do workspace.

**2) Contorno usando recurso documentado do próprio electron-builder.** Config temporária
`%TEMP%\pv-verify\rod5\pv-build-temp.json` com `electronDist` apontando para
`node_modules/electron/dist` (versão 41.10.7, igual a `node_modules/electron/package.json` e ao
arquivo `dist/version`) e `directories.output` em `%TEMP%\pv-verify\rod5\exe-out`. Motivo técnico lido
em `app-builder-lib/out/electron/ElectronFramework.js:189-197`: quando `electronDist` é um diretório
já-descompactado, o fluxo é `emptyDir` + `copyDir`, que **não** passa por `moveDirAtomic`.

**3) Build concluído.** `VITE_EXIT=0` e `BUILDER_EXIT=0` (log `build4.log`), com
`using custom unpacked Electron distribution` e
`building target=portable file=...\exe-out\Preventivas Elétricas 1.0.0 Portable.exe`.
Artefato: 363.236.958 bytes, SHA-256
`eb1a45ace2822299915445e89a0daa3d442f50de86d26dade99061eac9dc83e4`.

**4) Prova de que o ícone entrou no `.exe` de verdade:**
- 8 de 8 payloads PNG de `icons/icon.ico` (16/24/32/48/64/96/128/256) encontrados **byte-idênticos**
  dentro do `Preventivas Elétricas 1.0.0 Portable.exe` (varredura de buffer em Node).
- `[System.Drawing.Icon]::ExtractAssociatedIcon` no `.exe` final devolve 32×32 e o PNG salvo
  (`rod5/icone-exe-novo.png`) é a marca esmeralda — leitura direta do recurso PE, sem cache do Explorer.
- Captura da janela real do app executando (`rod5/exe-novo-janela.png`): ícone da barra de título e da
  barra de tarefas = marca nova; cabeçalho do app = marca nova; pill "Local" e sublinhado da aba
  continuam vermelhos, conforme a decisão do Rafael.
- `Start-Process` do `.exe`: `Responding=True`, janela "Preventivas Elétricas"; fechamento por
  `CloseMainWindow` com `restantes=0`.

**5) Checklist do Item 4 da Rodada 4, agora sobre o `app.asar` empacotado**
(`exe-out/win-unpacked/resources/app.asar`, 1.283.337 bytes): presentes — "Geral DC (A+B)" 3×,
"Salvar neste dispositivo" 2×, "Distribuição" 2×, "Sem confirmação do servidor" 1×; ausentes —
"assinado digitalmente" 0×, "Garantia de Qualidade" 0×, "jsPDF" 0×. Sobre "621": no bundle aparecem 10
coincidências de substring dentro de constantes numéricas de bibliotecas (`BigInt(-62135596800)` do
cálculo de datas, `V(62114,...)` do Firestore, `262144` como flag do React) e **0 ocorrências** em
`src/` e `electron/` — não há nenhuma alegação textual com "621" no app. Varredura de segredos no
`app.asar`: `service_account`, `private_key_id`, `firebase-adminsdk`, `client_secret`,
`BEGIN RSA PRIVATE`, `BEGIN PRIVATE KEY` = **0** ocorrências cada.

**6) `dist/` atualizado com verificação.** O `.exe` novo foi copiado para
`dist/Preventivas Elétricas 1.0.0 Portable.exe` e o SHA-256 do destino conferido byte a byte contra a
fonte (`eb1a45ac…c83e4` em ambos). O `.exe` anterior (15/10, 362.794.696 bytes, SHA-256
`2d0ffdcf…1816e0`) permanece íntegro em `%TEMP%\pv-verify\rod5\exe-backup\` — conferido antes e depois.

**Correção do parágrafo "Não verificado" de §22:** o item "ícone como aparece no Explorador/barra de
tarefas depois do rebuild" está **verificado** pelos itens 4 acima.

**Resíduo que eu criei e não consegui remover:** os esqueletos `dist/win-unpacked`,
`dist/win-unpacked.tmp`, `dist-producao/win-unpacked` e `dist-producao/win-unpacked.tmp`, cada um
segurando um `resources/default_app.asar` com alça aberta (`rm` → "Device or resource busy"). São
cascos vazios (só `default_app.asar`), não contêm o app. Removê-los exige liberar a alça — o reinício
do PC é o caminho. O `exe-teste.exe` de 223 MB da prova anterior foi apagado.

**Pendente:** o `npm run dist` **padrão** continua bloqueado até o reinício; a variante simplificada do
raio para 16/24 px continua opcional, a critério do Rafael. Nenhum commit, push, deploy Vercel ou
`firebase deploy` foi executado; nenhuma gravação em Firestore/Auth.
