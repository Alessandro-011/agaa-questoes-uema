# agaa-questoes-uema
Sistema de Banco de Questões do PAES UEMA - Requisitos e Modelagem de Dados

📚 AGAA QUESTÕES - UEMA

Sistema focado no armazenamento e consulta de questões das provas da UEMA.
🛠️ Estrutura do Banco

O projeto tem as seguintes entidades principais:
* Prova: Cadastro de exames por ano e código.
* Questão: Enunciados vinculados a provas com controle de dificuldade.
* Alternativa: Opções de A a E para questões objetivas.
* Gabarito: Respostas oficiais.
* Simulado: Geração de provas personalizadas para treino.

🚀 Como usar

    Abre o arquivo .mwb no MySQL Workbench para ver o diagrama.
    2. Executa o script .sql pra criar o banco de dados e as tabela com todas as regras de unicidade e integridade.
