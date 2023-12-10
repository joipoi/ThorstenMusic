-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: thorsten_music
-- ------------------------------------------------------
-- Server version	8.0.18

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
-- Table structure for table `song`
--

DROP TABLE IF EXISTS `song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `song` (
  `name` varchar(50) DEFAULT NULL,
  `artist` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `songID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`songID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `song`
--

LOCK TABLES `song` WRITE;
/*!40000 ALTER TABLE `song` DISABLE KEYS */;
INSERT INTO `song` VALUES ('sureshot','test2','hiphop',2019,1),('Anxiety','Anxiety','Rock',2018,29),('Blanketship','Diiv','Rock',2017,36),('By Myselfbba','Fidlar','HipHop',2018,37),('Crazy Energy Night','Pom Poko','Pop',2018,38),('Apocalyptica','En Route To The Night','Metal',2018,39),('Dont cling To Life','Murder Capital','Rock',2019,40),('Fear Inoclum','Tool','Pop',2019,41),('Gacked on Anger','Amyl and the sniffers','Pop',2020,42),('Hate Me','AlienBlaze','Rock',2020,43),('Heaven &amp; Hell &amp; Fire','Rotting Christ','Metal',2020,44),('House of Glass','Cage the Elephant','Rock',2019,45),('I will Depart','Abigail Williams','Pop',2019,46),('I wish I was Stephen Malkmus','Beabadoobee','Rock',2018,47),('hej','asd','asdaa',2018,49),('testaa','dasdas','jazz',2018,51),('bla','test','test',2018,53);
/*!40000 ALTER TABLE `song` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'joel','joel'),(2,'thorsten','thorsten'),(3,'admin','admin'),(4,'samuel','samuel');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote` (
  `songID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  KEY `songID` (`songID`),
  KEY `userID` (`userID`),
  CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`songID`) REFERENCES `song` (`songID`),
  CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
INSERT INTO `vote` VALUES (37,1,7),(38,1,7),(39,1,7),(47,1,5),(49,1,5),(51,1,5),(37,2,4),(38,2,4),(39,2,4),(47,2,4),(49,2,4),(51,2,4),(40,1,3),(41,1,3),(45,1,2),(46,1,2),(53,2,4);
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'thorsten_music'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-10 10:24:38
