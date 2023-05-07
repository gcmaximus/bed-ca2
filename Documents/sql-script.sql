CREATE DATABASE  IF NOT EXISTS `sp_air` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_air`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_air
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `airportid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`airportid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_airportid` (`airportid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES (1,'Changi Airport','Singapore','Main International Airport of Singapore'),(2,'Vietnam Airport','Vietnam','Main International Airport of Vietnam'),(3,'Seoul Airport','Korea','Main International Airport of Korea'),(4,'Malaysia Airport','Malaysia','Main International Airport of Malaysia'),(5,'Japan Airport','Japan','Main International Airport of Japan'),(6,'Finland Airport','Finland','Main International Airport of Finland'),(7,'Hong Kong Airport','Hong Kong','Main International Airport of Hong Kong'),(8,'Taiwan Airport','Taiwan','Main International Airport of Taiwan'),(9,'Switzerland Airport','Switzerland','Main International Airport of Switzerland'),(10,'Sweden Airport','Sweden','Main International Airport in Sweden'),(11,'Ireland Airport','Ireland','Main International Airport of Ireland'),(12,'New York Airport','USA','Main International Airport of USA');
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `bookingid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `passport` varchar(45) NOT NULL,
  `nationality` varchar(45) NOT NULL,
  `age` int NOT NULL,
  `fk_userid` int NOT NULL,
  `fk_flightid` int NOT NULL,
  PRIMARY KEY (`bookingid`,`fk_userid`,`fk_flightid`),
  KEY `fk_userid_idx` (`fk_userid`),
  KEY `fk_flightid_idx` (`fk_flightid`),
  CONSTRAINT `booking_fk_flightid` FOREIGN KEY (`fk_flightid`) REFERENCES `flight` (`flightid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_fk_userid` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,'Bob','E123Z','Singaporean',33,6,7),(2,'Tom','E555Z','Malaysian',32,8,2),(3,'Lily','E404Z','Singaporean',29,7,7);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `flightid` int NOT NULL AUTO_INCREMENT,
  `flightCode` varchar(45) NOT NULL,
  `aircraft` varchar(45) NOT NULL,
  `originAirport` int NOT NULL,
  `destinationAirport` int NOT NULL,
  `embarkDate` varchar(45) NOT NULL,
  `travelTime` varchar(45) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`flightid`),
  UNIQUE KEY `flightCode_UNIQUE` (`flightCode`),
  KEY `fk_originAirport_idx` (`originAirport`),
  KEY `fk_destinationAirport_idx` (`destinationAirport`),
  CONSTRAINT `fk_destinationAirport` FOREIGN KEY (`destinationAirport`) REFERENCES `airport` (`airportid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_originAirport` FOREIGN KEY (`originAirport`) REFERENCES `airport` (`airportid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES (1,'SP670','BOEING 737',3,1,'2022/08/23 21:30','6 hours 40 mins',855.50),(2,'SP690','Airbus A320',5,6,'2022/10/28 09:00','6 hours 55 mins',910.50),(3,'SP420','Airbus A320',7,8,'2023/04/20 16:20','6 hours 10 mins',795.50),(4,'SP800','Airbus A320',6,3,'2022/08/23 17:30','12 hours 10 mins',1030.50),(5,'SP320','BOEING 737',1,8,'2022/09/21 15:30','2 hours',280.50),(6,'SP990','BOEING 737',3,7,'2022/12/20 19:30','5 hours 30 mins',670.00),(7,'SP404','BOEING 737',1,3,'2022/08/26 01:00','6 hours 40 mins',830.00),(8,'SP303','BOEING 737',3,1,'2022/08/23 08:00','6 hours 40 mins',850.50);
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_flightid` int NOT NULL,
  `discounted_price` decimal(10,2) NOT NULL,
  `start_period` date NOT NULL,
  `end_period` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_flightid_idx` (`fk_flightid`),
  CONSTRAINT `promotion_fk_flightid` FOREIGN KEY (`fk_flightid`) REFERENCES `flight` (`flightid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,2,750.00,'2022-09-25','2022-09-28'),(2,2,720.00,'2022-09-12','2022-09-13'),(3,1,800.00,'2022-11-03','2022-11-08');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contact` int NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Terry Tan','terrytan@gmail.com',92827262,'123','Customer',NULL,'2022-04-03 08:56:09'),(2,'johntan123','john@gmail.com',98181818,'123','Customer',NULL,'2022-05-20 08:56:09'),(3,'maryL','mary@gmail.com',87651234,'123','Customer',NULL,'2022-05-20 08:56:09'),(4,'dave79','dave@mail.com',99998888,'123','Customer',NULL,'2022-05-20 08:56:09'),(5,'peterparker123','peter@gmail.com',92837462,'123','Admin',NULL,'2022-05-20 08:56:09'),(6,'bobby','bob@gmail.com',94238903,'bob','Admin','https://preview.redd.it/bn5vwyls39m81.jpg?auto=webp&s=a8ef02e5de1ed980279141b7649a76c1fb2945dd','2022-05-20 09:23:41'),(7,'lilytayyzzz','lilytay@gmail.com',98761724,'lily','Customer','https://external-preview.redd.it/iSpSIg6Vu4paQxA77pKwfwMcOx9iRkVr8tIUVvsjsBs.png?format=pjpg&auto=webp&s=7e23a2aacc1f3e583c42080b0daa03438290eeae','2022-05-20 11:12:40'),(8,'tom','tom@gmail.com',91832341,'tom','Customer','https://pbs.twimg.com/profile_images/1430517286855659522/5AfEDfcm_400x400.jpg','2022-06-29 06:04:16');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-07 13:10:17
