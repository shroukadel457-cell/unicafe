-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: unicafe
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `openingHours` varchar(100) NOT NULL,
  `workDays` varchar(100) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `color` varchar(20) NOT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Red Hall','8:00 AM - 4:00 PM','Sun - Thu','Building2','#E86060','open','2026-05-16 13:09:42'),(2,'Blue Hall','8:00 AM - 4:00 PM','Sun - Thu','School','#4DA8DA','open','2026-05-16 13:09:42'),(3,'Student Affairs','8:00 AM - 4:00 PM','Sun - Thu','Users','#4CAF7D','open','2026-05-16 13:09:42'),(4,'Food Court','8:00 AM - 4:00 PM','Sun - Thu','UtensilsCrossed','#F0A030','open','2026-05-16 13:09:42');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems`
--

DROP TABLE IF EXISTS `menuitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitems` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `branchId` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` enum('main_course','sandwiches','salads','drinks','desserts','coffee','breakfast','snacks') NOT NULL,
  `priceEGP` decimal(10,2) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `popular` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems`
--

LOCK TABLES `menuitems` WRITE;
/*!40000 ALTER TABLE `menuitems` DISABLE KEYS */;
INSERT INTO `menuitems` VALUES (1,1,'chicken','hot','main_course',74.95,'Beef',1,0,'2026-05-16 13:01:41'),(2,1,'Classic Burger','Juicy beef patty with lettuce, tomato, and cheese','main_course',65.00,'Beef',1,1,'2026-05-16 13:13:56'),(3,1,'Chicken Sandwich','Grilled chicken breast with mayo and fresh veggies','sandwiches',45.00,'Sandwich',1,1,'2026-05-16 13:13:56'),(4,1,'Caesar Salad','Fresh romaine lettuce with Caesar dressing and croutons','salads',35.00,'Salad',1,0,'2026-05-16 13:13:56'),(5,1,'Coca Cola','Refreshing cold soft drink','drinks',15.00,'CupSoda',1,1,'2026-05-16 13:13:56'),(6,1,'Chocolate Cake','Rich chocolate layered cake with frosting','desserts',40.00,'Cake',1,0,'2026-05-16 13:13:56'),(7,1,'French Fries','Crispy golden fries with ketchup','snacks',25.00,'Fries',1,1,'2026-05-16 13:13:56'),(8,1,'Falafel Plate','Traditional falafel with tahini sauce and pita','main_course',40.00,'ChefHat',1,0,'2026-05-16 13:13:56'),(9,1,'Orange Juice','Freshly squeezed orange juice','drinks',20.00,'GlassWater',1,0,'2026-05-16 13:13:56'),(10,2,'Grilled Chicken','Marinated grilled chicken with rice and vegetables','main_course',75.00,'Drumstick',1,1,'2026-05-16 13:13:56'),(11,2,'Tuna Sandwich','Tuna salad with lettuce on toasted bread','sandwiches',40.00,'Fish',1,0,'2026-05-16 13:13:56'),(12,2,'Greek Salad','Mixed greens with feta cheese and olives','salads',38.00,'Salad',1,1,'2026-05-16 13:13:56'),(13,2,'Latte','Creamy espresso with steamed milk','coffee',30.00,'Coffee',1,1,'2026-05-16 13:13:56'),(14,2,'Cheesecake','New York style cheesecake with berry sauce','desserts',45.00,'CakeSlice',1,1,'2026-05-16 13:13:56'),(15,2,'Pancakes','Fluffy pancakes with maple syrup','breakfast',50.00,'Cookie',1,0,'2026-05-16 13:13:56'),(16,2,'Espresso','Strong Italian espresso','coffee',20.00,'Coffee',1,0,'2026-05-16 13:13:56'),(17,2,'Lemonade','Fresh lemonade with mint','drinks',18.00,'GlassWater',1,0,'2026-05-16 13:13:56'),(18,3,'Koshari','Traditional Egyptian koshari with spicy sauce','main_course',35.00,'ChefHat',1,1,'2026-05-16 13:13:56'),(19,3,'Shawarma Wrap','Chicken shawarma with garlic sauce in pita','sandwiches',50.00,'Sandwich',1,1,'2026-05-16 13:13:56'),(20,3,'Mixed Salad','Fresh garden salad with seasonal vegetables','salads',30.00,'Salad',1,0,'2026-05-16 13:13:56'),(21,3,'Cappuccino','Rich cappuccino with foam art','coffee',28.00,'Coffee',1,1,'2026-05-16 13:13:56');
/*!40000 ALTER TABLE `menuitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `orderId` bigint unsigned NOT NULL,
  `menuItemId` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `priceEGP` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (1,30002,1,2,74.95),(2,30003,1,1,74.95),(3,30004,1,1,74.95);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint unsigned NOT NULL,
  `branchId` bigint unsigned NOT NULL,
  `totalEGP` decimal(10,2) NOT NULL,
  `status` enum('pending','preparing','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,40084,1,65.00,'completed','2026-05-16 13:14:39'),(2,40086,1,20.00,'completed','2026-05-16 13:14:39'),(3,40087,3,7.20,'completed','2026-05-16 13:14:39'),(4,40087,3,43.20,'completed','2026-05-16 13:14:39'),(30001,70084,1,260.00,'completed','2026-05-16 13:14:39'),(30002,2,1,149.90,'completed','2026-05-16 13:19:36'),(30003,2,1,74.95,'completed','2026-05-16 16:00:08'),(30004,2,1,74.95,'completed','2026-05-16 16:58:14');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'shrouk','shrouk@unicafe.edu','$2b$10$kODTiQKYQG6qUCK.prUmV.CQXeJelbK7Fl7NhHowftJJQE0iQ5Nyy','admin','2026-05-16 12:56:37'),(2,'retal','retal@unicafe.edu','$2b$10$tqj1khZI/bfi5nsLtUzRjunTkp9eJNOK6uegth7V/zv7GlUUMGb0G','student','2026-05-16 13:19:06'),(3,'Admin','shrouk@admin.edu','$2b$10$wBK4MylgdHGzI5OJeHRb3u4NV2pAhCR2GdS/uF.log4z0yy446zIG','admin','2026-05-16 16:00:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 20:57:29
