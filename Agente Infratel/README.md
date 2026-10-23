# 🤖 Agente Infratel
> Automação inteligente e preenchimento técnico para sistemas Infratel/Claro.

O **Agente Infratel** foi desenvolvido para eliminar o erro humano e acelerar o fluxo de trabalho em campo. Ele automatiza o preenchimento de formulários, validação de medições e geração de relatórios diretamente nos portais técnicos.

---

### 🚀 Como Usar (Início Rápido)

Para garantir que o agente funcione corretamente em qualquer computador sem necessidade de instalar programas adicionais (como Python ou Node), siga estes passos:

1.  **Baixe o Pacote**: Faça o download do arquivo `Agente_Infratel_v1.0_Completo.zip`.
2.  **Extraia Tudo**: Clique com o botão direito no arquivo baixado e selecione **"Extrair Tudo"**. 
3.  **Execute**: Abra a pasta extraída e dê um clique duplo no arquivo `agente_infra_portable.exe`.
4.  **Pronto**: Na primeira execução, o robô criará automaticamente um atalho na sua **Área de Trabalho** para facilitar os próximos acessos.

---

### ✨ Funcionalidades Chave

- **Integração Direta**: Conexão nativa com portais Infratel/Claro.
- **Preenchimento Automático**: Insere dados de UPS, QDCA e MT com precisão cirúrgica.
- **Zero Instalação**: Versão *portable* que roda direto do pendrive ou pasta local.
- **Atalho Inteligente**: Cria seu próprio acesso rápido no primeiro uso.

---

### ⚠️ Riscos e Considerações

Para uma experiência sem interrupções, atente-se aos seguintes pontos:

*   **Extração Manual**: O robô depende da pasta `.playwright-browsers` que vem no pacote. Se você tentar rodar o `.exe` de dentro do arquivo ZIP sem extrair, ele não encontrará o navegador e fechará com erro.
*   **Alertas de Antivírus**: Como o Agente Infratel realiza automações de sistema e cria atalhos automaticamente, o Windows Defender ou outros antivírus podem exibir um alerta de "Fornecedor Desconhecido". Se isso ocorrer, clique em **"Mais informações"** e depois em **"Executar assim mesmo"**.
*   **Primeiro Uso**: O atalho na Área de Trabalho só aparecerá após a primeira vez que você abrir o executável de dentro da pasta extraída.

---

### 🛠️ Informações Técnicas

- **Versão**: 1.0.0
- **Tecnologia**: Python / Playwright (Chromium)
- **Segurança**: Credenciais criptografadas localmente no arquivo `.env`.

---
*Desenvolvido para transformar produtividade técnica em realidade.*
