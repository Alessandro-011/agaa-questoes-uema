# agaa-questoes-uema

Sistema de Banco de Questões do PAES UEMA - Requisitos e Modelagem de Dados

📚 AGAA QUESTÕES - UEMA

Sistema focado no armazenamento e consulta de questões das provas da UEMA.

---

🛠️ Estrutura do Banco

O projeto tem as seguintes entidades principais:

• Prova: Cadastro de exames por ano e código.
• Questão: Enunciados vinculados a provas com controle de dificuldade.
• Alternativa: Opções de A a E para questões objetivas.
• Gabarito: Respostas oficiais.
• Simulado: Geração de provas personalizadas para treino.


---

🚀 Como usar

1. Banco de Dados

1. Abra o arquivo .mwb no MySQL Workbench para visualizar o diagrama.
2. Execute o script .sql para criar o banco de dados e as tabelas com todas as regras de unicidade e integridade.


---

2. Backend (Spring Boot)

1. Configure o Maven adicionando ao PATH:$env:PATH += ";C:\Users\Colossoscomputer\Downloads\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin"

2. Acesse a pasta do backend:cd "C:\Users\Colossoscomputer\Downloads\agaa-questoes-uema-main\agaa-questoes-uema-main\agaa-questoes"

3. Execute o servidor:mvn spring-boot:run



👉 O backend estará disponível em: http://localhost:8080

---

3. Frontend

1. Acesse a pasta do frontend:cd "C:\Users\Colossoscomputer\Documents\AGAA - Frontend\agaa-frontend"

2. Instale as dependências:npm install

3. Execute o servidor de desenvolvimento:npm run dev



👉 O frontend estará disponível em: http://localhost:5173 (ou porta definida pelo Vite/React/Vue)

---

📌 Observações

• Certifique-se de ter Node.js e npm instalados.
• O backend deve estar rodando antes do frontend para que a comunicação funcione corretamente.
• Ajuste as configurações de conexão com o banco no application.properties do Spring Boot.


---

💻 Tecnologias Utilizadas

• Java 17
• Spring Boot (API REST, persistência e segurança)
• Maven (gerenciamento de dependências e build)
• MySQL (banco de dados relacional)
• Node.js (ambiente de execução do frontend)
• npm (gerenciador de pacotes)
• Vite (ferramenta de build e servidor de desenvolvimento)
• Vue.js / React (framework frontend, conforme versão usada)