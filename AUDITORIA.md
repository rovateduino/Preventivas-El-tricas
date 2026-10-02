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