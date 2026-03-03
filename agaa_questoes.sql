CREATE DATABASE  IF NOT EXISTS `agaa_questoes` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `agaa_questoes`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: agaa_questoes
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alternativa`
--

DROP TABLE IF EXISTS `alternativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternativa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `questao_id` bigint NOT NULL,
  `letra` char(1) NOT NULL,
  `texto` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_alternativa_questao` (`questao_id`),
  CONSTRAINT `fk_alternativa_questao` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativa`
--

LOCK TABLES `alternativa` WRITE;
/*!40000 ALTER TABLE `alternativa` DISABLE KEYS */;
/*!40000 ALTER TABLE `alternativa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gabarito`
--

DROP TABLE IF EXISTS `gabarito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gabarito` (
  `questao_id` bigint NOT NULL,
  `alternativa_id` bigint DEFAULT NULL,
  `res_esperada` text,
  `fonte_oficial` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`questao_id`),
  KEY `fk_gabarito_alternativa` (`alternativa_id`),
  CONSTRAINT `fk_gabarito_alternativa` FOREIGN KEY (`alternativa_id`) REFERENCES `alternativa` (`id`),
  CONSTRAINT `fk_gabarito_questao` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gabarito`
--

LOCK TABLES `gabarito` WRITE;
/*!40000 ALTER TABLE `gabarito` DISABLE KEYS */;
/*!40000 ALTER TABLE `gabarito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prova`
--

DROP TABLE IF EXISTS `prova`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prova` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo_prova` varchar(30) NOT NULL,
  `fase` varchar(20) NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `ano` smallint NOT NULL,
  `dia` varchar(20) DEFAULT NULL,
  `data_aplicacao` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_prova_unica` (`ano`,`codigo_prova`,`fase`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prova`
--

LOCK TABLES `prova` WRITE;
/*!40000 ALTER TABLE `prova` DISABLE KEYS */;
INSERT INTO `prova` VALUES (1,'PAES2026_OBJ','UNICA','OBJETIVA_REDAÇÃO',2026,'DOMINGO','2025-11-30');
/*!40000 ALTER TABLE `prova` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questao`
--

DROP TABLE IF EXISTS `questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questao` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prova_id` bigint NOT NULL,
  `numero_na_prova` int NOT NULL,
  `tipo` enum('OBJETIVA','DISCURSIVA') NOT NULL,
  `area_conhecimento` varchar(80) NOT NULL,
  `disciplina` varchar(80) NOT NULL,
  `assunto` varchar(120) NOT NULL,
  `enunciado` text NOT NULL,
  `dificuldade` enum('FACIL','MEDIO','DIFICIL') NOT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_questao_prova` (`prova_id`,`numero_na_prova`),
  CONSTRAINT `fk_questao_prova` FOREIGN KEY (`prova_id`) REFERENCES `prova` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questao`
--

LOCK TABLES `questao` WRITE;
/*!40000 ALTER TABLE `questao` DISABLE KEYS */;
INSERT INTO `questao` VALUES (1,1,56,'OBJETIVA','CIÊNCIAS DA NATUREZA','QUÍMICA','PROPRIEDADES QUÍMICAS DA ÁGUA DO MAR (pH)','Ao tomar banho de mar, percebe-se que a pele fica mais ressecada e os olhos ardem. Isso acontece por causa da composição química da água do mar... que possui um pH aproximadamente igual a 8,1. Em relação às propriedades químicas da água do mar e os efeitos sentidos no corpo humano, pode-se afirmar que:','FACIL',NULL);
/*!40000 ALTER TABLE `questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulado`
--

DROP TABLE IF EXISTS `simulado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulado` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantidade_questoes` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_simulado_usuario` (`usuario_id`),
  CONSTRAINT `fk_simulado_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulado`
--

LOCK TABLES `simulado` WRITE;
/*!40000 ALTER TABLE `simulado` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulado_questao`
--

DROP TABLE IF EXISTS `simulado_questao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulado_questao` (
  `simulado_id` bigint NOT NULL,
  `questao_id` bigint NOT NULL,
  PRIMARY KEY (`simulado_id`,`questao_id`),
  KEY `fk_sq_questao` (`questao_id`),
  CONSTRAINT `fk_sq_questao` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`),
  CONSTRAINT `fk_sq_simulado` FOREIGN KEY (`simulado_id`) REFERENCES `simulado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulado_questao`
--

LOCK TABLES `simulado_questao` WRITE;
/*!40000 ALTER TABLE `simulado_questao` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulado_questao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `perfil` enum('ADMINISTRADOR','USUARIO') NOT NULL DEFAULT 'USUARIO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email_unico` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02 21:41:40
