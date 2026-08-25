<div align="center">

![Electron](https://img.shields.io/badge/Electron-41-blue?logo=electron)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Version](https://img.shields.io/badge/version-1.0.0-green)

<br/>

<img width="100%" alt="Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />

<h1>⚡ Preventivas Elétricas</h1>

**Sistema desktop profissional para cadastro, medição e relatórios de manutenção preventiva em quadros elétricos.**

<br/>

[![Download](https://img.shields.io/badge/%F0%9F%93%82%20Download-Portable.exe-16a34a?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/rovateduino/Preventivas-El-tricas/releases/download/v1.0.0/Preventivas.Eletricas.1.0.0.Portable.exe)
[![GitHub Release](https://img.shields.io/github/v/release/rovateduino/Preventivas-El-tricas?style=for-the-badge&logo=github&color=6366f1)](https://github.com/rovateduino/Preventivas-El-tricas/releases/latest)

<br/>

</div>

---

## 🎯 Visão Geral

<table>
<tr>
<td width="50%" valign="top">

### Por que este sistema?

Manutenção preventiva em quadros elétricos exige **precisão, rastreabilidade e relatórios profissionais**. Este sistema elimina planilhas desordenadas e oferece um fluxo completo — do cadastro à impressão do relatório técnico — em uma única aplicação desktop.

</td>
<td width="50%" valign="top">

### Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS v4 |
| **Desktop** | Electron 41 (Portable, sem instalação) |
| **Backend** | Firebase Firestore + Auth |
| **Build** | Vite 6 |
| **Relatórios** | jsPDF + Template HTML profissional |

</td>
</tr>
</table>

---

## ✨ Funcionalidades

### 📋 Cadastro de Preventivas

| Recurso | Detalhes |
|---------|----------|
| **Tipos de Quadro** | `PDT` · `QDF` · `QDCC` · `OUTRO` |
| **Multi-site** | Lista completa de Hubs, Switches, EBTS e MUX com siglas |
| **Disjuntores** | Tabela dinâmica de **1 a 200 circuitos** (QDF/QDCC) ou **1 a 60** (PDT/OUTRO) |
| **Cálculo Automático** | Soma de correntes por Via A/B ou por Fase R/S/T em tempo real |
| **Campos** | Ticket, Temperatura, Data, Complemento do Quadro |

### ⚡ Tensões Condicionais por Tipo

| Tipo de Quadro | Campos Exibidos |
|----------------|-----------------|
| **QDF / QDCC** | Tensão DC (V) + Corrente Geral DC |
| **PDT / OUTRO** | Fase R, S, T (V) + Compostas RS, ST, TR (V) + Correntes por Fase |

### 🗄️ Armazenamento Duplo

```
┌─────────────────────────────────────────────────────────┐
│  LOCAL (localStorage)     │  FIREBASE (Firestore)       │
│  • Sem login necessário   │  • Login por UID            │
│  • Dados no dispositivo   │  • Sync na nuvem            │
│  • Ideal para testes      │  • Backup automático        │
└─────────────────────────────────────────────────────────┘
```

### 🔐 Sistema de Autenticação

- **Login + Cadastro** com email e senha via Firebase Auth
- **Sistema de Convites:** apenas administradores podem criar novos usuários
- **Primeiro Admin:** o primeiro usuário cadastrado é promovido automaticamente
- **Modo Local:** acesso sem login para uso individual

### 📊 Visualização e Relatórios

- **Modal de visualização** com paridade total de layout (formulário ↔ view ↔ PDF)
- **Impressão profissional:** template HTML com formatação técnica
- **Exportação JSON** para backup e compartilhamento
- **Importação JSON** com validação de integridade

### 🧹 Gestão de Dados

- **Limpar Banco:** ação destrutiva com dupla confirmação (digite `LIMPAR`)
- **Barra de progresso** em tempo real durante exclusão
- **Fallback garantido:** `writeBatch` atômico + deleção unitária como backup

---

## 📸 Interface

<table>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/ darktheme-slate--950-1e293b?style=for-the-badge" alt="Dark Theme"/>
<br/>
<sub>Tema escuro profissional com Tailwind CSS</sub>
</td>
<td align="center">
<img src="https://img.shields.io/badge/responsivo-mobile--first-0ea5e9?style=for-the-badge" alt="Responsive"/>
<br/>
<sub>Layout responsivo para qualquer tela</sub>
</td>
</tr>
</table>

---

## 🚀 Instalação e Uso

### Opção 1 — Executável Portable (Recomendado)

1. Baixe o arquivo `.exe` acima
2. Clique duas vezes para executar — **sem instalação**
3. Se o SmartScreen aparecer, clique em **"Mais informações" → "Executar assim mesmo"**

> 💡 O executável é assinado digitalmente via `signtool.exe` para garantir autenticidade.

### Opção 2 — Desenvolvimento

**Pré-requisitos:** [Node.js](https://nodejs.org/) v18+

```bash
# Clone o repositório
git clone https://github.com/rovateduino/Preventivas-El-tricas.git
cd Preventivas-El-tricas

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Empacotar como .exe
npm run dist
```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção (web) |
| `npm run dist` | Build + empacotamento Electron (.exe) |

---

## 🔒 Convite de Acesso (Firebase)

O modo Firebase utiliza um sistema de convites para controle de acesso:

```
Administrador → Gera Token → Compartilha com usuário → Usuário se cadastra
```

| Regra | Descrição |
|-------|-----------|
| ✅ Primeiro cadastro | Promovido automaticamente a **administrador** |
| ✅ Gerar convites | Apenas **administradores** podem gerar tokens |
| ✅ Usar convite | Novos usuários precisam de um token válido |
| ✅ Modo local | Sempre disponível **sem necessidade de login** |

---

## 🏗️ Arquitetura

```
src/
├── App.tsx                    # Componente principal (UI + lógica)
├── types.ts                   # Definições de tipo TypeScript
├── main.tsx                   # Entry point React
├── index.css                  # Estilos globais (Tailwind)
├── components/
│   └── Login.tsx              # Tela de autenticação
└── lib/
    ├── auth.ts                # Firebase Auth (login, register, logout)
    ├── firebase.ts            # Configuração Firebase
    ├── constants.ts           # Constantes (chaves de storage)
    ├── dataExport.ts          # Exportação/Importação JSON
    ├── preventivaService.ts   # CRUD de preventivas (Firestore)
    └── userService.ts         # Perfis de usuário + sistema de convites
```

---

## 📦 Build e Distribuição

| Artefato | Caminho | Tamanho |
|----------|---------|---------|
| **Portable.exe** | `dist-producao/Preventivas Elétricas 1.0.0 Portable.exe` | ~621 MB |
| **Web (Vite)** | `dist-web/` | ~730 KB (gzip: ~180 KB) |
| **Electron Unpacked** | `dist-producao/win-unpacked/` | ~620 MB |

### Assinatura Digital

Todos os binários são assinados via `signtool.exe`:
- `electron.exe`
- `elevate.exe`
- `esbuild.exe`
- `Preventivas Elétricas.exe`

---

## 📈 Métricas

<table>
<tr>
<td align="center">
<h3>4</h3>
<sub>Tipos de Quadro</sub>
</td>
<td align="center">
<h3>200</h3>
<sub>Máx. Disjuntores</sub>
</td>
<td align="center">
<h3>2</h3>
<sub>Modos de Storage</sub>
</td>
<td align="center">
<h3>0</h3>
<sub>Dependências de Instalação</sub>
</td>
</tr>
</table>

---

## 🛡️ Segurança

- **Autenticação por UID** — cada usuário acessa apenas seus dados
- **Firestore Rules** — isolamento por UID na collection `preventivas`
- **Sistema de Convites** — cadastro controlado por administrador
- **Assinatura Digital** — executável verificável via `signtool.exe`
- **Sem dados sensíveis** — apenas registros de manutenção

---

## 🤝 Contribuição

1. Faça um `fork` do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

---

## 📄 Licença

Este é um software **proprietário**. Não é permitida a reprodução, distribuição ou uso comercial sem autorização explícita do desenvolvedor.

---

<div align="center">

**Feito com ⚡ por [rovateduino](https://github.com/rovateduino)**

<br/>

![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078d4?style=for-the-badge&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-41-47848f?style=for-the-badge&logo=electron&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

</div>
