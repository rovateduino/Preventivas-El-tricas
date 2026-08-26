<div align="center">

[![Download](https://img.shields.io/badge/%F0%9F%93%82%20Download-Portable.exe-16a34a?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/rovateduino/Preventivas-El-tricas/releases/download/v1.0.0/Preventivas.Eletricas.1.0.0.Portable.exe)
[![GitHub Release](https://img.shields.io/github/v/release/rovateduino/Preventivas-El-tricas?style=for-the-badge&logo=github&color=6366f1)](https://github.com/rovateduino/Preventivas-El-tricas/releases/latest)

<br/>

</div>

---

## 🎯 Visão Geral

Sistema desktop profissional para cadastro, medição e relatórios de manutenção preventiva em quadros elétricos. Elimina planilhas desordenadas e oferece um fluxo completo — do cadastro à impressão do relatório técnico.

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS v4 |
| **Desktop** | Electron 41 (Portable, sem instalação) |
| **Backend** | Firebase Firestore + Auth |
| **Build** | Vite 6 + jsPDF |

---

## ✨ Funcionalidades

- **Tipos de Quadro:** `PDT` · `QDF` · `QDCC` · `OUTRO`
- **Tabela dinâmica:** 1 a 200 circuitos (QDF/QDCC) ou 1 a 60 (PDT/OUTRO)
- **Cálculo automático:** soma de correntes por Via A/B ou por Fase R/S/T
- **Tensões condicionais:** campos variam conforme o tipo de quadro
- **Armazenamento duplo:** localStorage (local) + Firebase Firestore (nuvem)
- **Autenticação:** login por UID com sistema de convites para administradores
- **Relatórios:** impressão profissional via template HTML + exportação JSON
- **Modo Local:** acesso sem login para uso individual

---

## 🚀 Instalação

1. Baixe o `.exe` no botão acima
2. Clique duas vezes para executar — **sem instalação**
3. Se o SmartScreen bloquear, clique em **"Mais informações" → "Executar assim mesmo"**

---

## 🛡️ Segurança

- Autenticação por UID com isolamento por usuário no Firestore
- Sistema de convites: cadastro controlado por administrador
- Assinatura digital via `signtool.exe`

---

## 📄 Licença

Software **proprietário**. Reprodução ou distribuição sem autorização não é permitida.

---

<div align="center">

**Feito com ⚡ por [rovateduino](https://github.com/rovateduino)**

</div>
