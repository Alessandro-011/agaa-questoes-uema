CREATE DATABASE IF NOT EXISTS agaa_questoes;
USE agaa_questoes;

CREATE TABLE prova (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_prova VARCHAR(30) NOT NULL,
    ano SMALLINT NOT NULL,
    area_conhecimento VARCHAR(80) NOT NULL,
    data_aplicacao DATE,
    tipo_prova VARCHAR(40) NOT NULL,
    observacoes TEXT,
    UNIQUE idx_prova_unica (ano, codigo_prova)
);

CREATE TABLE questao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prova_id BIGINT NOT NULL,
    numero_na_prova INT NOT NULL,
    disciplina VARCHAR(80) NOT NULL,
    assunto VARCHAR(120) NOT NULL,
    enunciado TEXT NOT NULL,
    dificuldade ENUM('FACIL', 'MEDIO', 'DIFICIL') NOT NULL,
    ano SMALLINT NOT NULL,
    area_conhecimento VARCHAR(80) NOT NULL,
    FOREIGN KEY (prova_id) REFERENCES prova(id) ON DELETE CASCADE,
    UNIQUE idx_questao_prova_numero (prova_id, numero_na_prova),
    INDEX idx_busca_filtro (ano, area_conhecimento),
    INDEX idx_busca_conteudo (disciplina, assunto, dificuldade)
);

CREATE TABLE alternativa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    questao_id BIGINT NOT NULL,
    letra CHAR(1) NOT NULL,
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE,
    UNIQUE idx_alternativa_questao_letra (questao_id, letra)
);

CREATE TABLE gabarito (
    questao_id BIGINT PRIMARY KEY,
    alternativa_correta_id BIGINT,
    fonte_oficial VARCHAR(255),
    FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE,
    FOREIGN KEY (alternativa_correta_id) REFERENCES alternativa(id)
);

CREATE TABLE simulado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantidade_questoes INT NOT NULL
);

CREATE TABLE simulado_questao (
    simulado_id BIGINT NOT NULL,
    questao_id BIGINT NOT NULL,
    PRIMARY KEY (simulado_id, questao_id),
    FOREIGN KEY (simulado_id) REFERENCES simulado(id) ON DELETE CASCADE,
    FOREIGN KEY (questao_id) REFERENCES questao(id) ON DELETE CASCADE
);