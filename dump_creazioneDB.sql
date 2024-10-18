-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: gestioneautisti
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `assegnazioni`
--

DROP TABLE IF EXISTS `assegnazioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assegnazioni` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dataPartenza` datetime DEFAULT NULL,
  `dataArrivo` datetime DEFAULT NULL,
  `idAutista` varchar(45) NOT NULL,
  `idMezzo` varchar(45) DEFAULT NULL,
  `idTratta` varchar(45) DEFAULT NULL,
  `stato` varchar(45) DEFAULT NULL,
  `reportId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assegnazioni`
--

LOCK TABLES `assegnazioni` WRITE;
/*!40000 ALTER TABLE `assegnazioni` DISABLE KEYS */;
INSERT INTO `assegnazioni` VALUES (1,NULL,NULL,'1','2','3','completata',NULL),(3,'2024-10-08 08:00:00','2024-10-08 12:00:00','1','2','1','completata',NULL),(4,NULL,NULL,'1','2','1','completata',NULL);
/*!40000 ALTER TABLE `assegnazioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `autista`
--

DROP TABLE IF EXISTS `autista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autista` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `codFiscale` varchar(255) DEFAULT NULL,
  `numPatente` varchar(255) DEFAULT NULL,
  `scadenzaPatente` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autista`
--

LOCK TABLES `autista` WRITE;
/*!40000 ALTER TABLE `autista` DISABLE KEYS */;
INSERT INTO `autista` VALUES (1,'idsssssssssa','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','asia.germi@gmail.com','+393403289787'),(2,'idsssssssssa','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','3403289787'),(4,'ida','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','1234567890'),(5,'idsssssssssa','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','asia.germi@gmail.com','393403289787'),(6,'idsssssssssa','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','asia.germi@gmail.com','393403289787'),(7,'ida','Rossi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','1234567890'),(8,'ida','germi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','1234567890'),(9,'ida','germi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','1234567890'),(10,'ida','germi','RSSMRA80A01H501Z','123456789','2025-05-01','mario.rossi@example.com','1234567890');
/*!40000 ALTER TABLE `autista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corse`
--

DROP TABLE IF EXISTS `corse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `corse` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `indirizzoPartenza` varchar(45) DEFAULT NULL,
  `indirizzoArrivo` varchar(45) DEFAULT NULL,
  `descrizione` varchar(45) DEFAULT NULL,
  `cadenza` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corse`
--

LOCK TABLES `corse` WRITE;
/*!40000 ALTER TABLE `corse` DISABLE KEYS */;
INSERT INTO `corse` VALUES (1,'Via roaaaaaaaaaaaa, 10','Via Milano, 20','Corsa giornaliera per pendolari','Settimanale');
/*!40000 ALTER TABLE `corse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utenti`
--

DROP TABLE IF EXISTS `utenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti`
--

LOCK TABLES `utenti` WRITE;
/*!40000 ALTER TABLE `utenti` DISABLE KEYS */;
INSERT INTO `utenti` VALUES (1,'admin','$2b$10$K/q1PmQJN6w3QOarF/3oxe/7PK3MbEQ6uKbhc9e9nKFEwsTMo5o3K','admin@example.com','2024-10-18 09:09:27'),(5,'admin1','$2b$10$7Sj0VOLjz/c.OJBt62nWxOT8NHmCe8aRjpmmOKBq69qVeg20CyHia',NULL,'2024-10-18 09:54:03');
/*!40000 ALTER TABLE `utenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veicoli`
--

DROP TABLE IF EXISTS `veicoli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veicoli` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `modello` varchar(45) DEFAULT NULL,
  `capienza` int DEFAULT NULL,
  `targa` varchar(45) DEFAULT NULL,
  `scadenzaBollo` date DEFAULT NULL,
  `scadenzaAssicurazione` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veicoli`
--

LOCK TABLES `veicoli` WRITE;
/*!40000 ALTER TABLE `veicoli` DISABLE KEYS */;
INSERT INTO `veicoli` VALUES (2,'ida car',15,'AB123CD','2024-11-01','2024-10-16'),(3,'Fiat Panda',15,'AB123CD','2025-10-10','2025-08-30');
/*!40000 ALTER TABLE `veicoli` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-18 11:58:14
