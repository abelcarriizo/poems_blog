/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: poems_blog
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(10) NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `username` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES (1,'Abel','Carrizo','abelcarrizo','abelcarrizo@example.com','scrypt:32768:8:1$LNNTTfw2Y3SZcyxk$a850ec3b146d109411c32b77599b29edc3f9ceef1f103257fb69007f234d8f0c1353ddd9ed683cdfba4671ec772b4e21f1cf34f68f187972be2fb22db9d766cd'),(2,'Esteban','Quito','esteban_quito','estebanquito@example.com','scrypt:32768:8:1$f7x7B2Dg8ebzD5wN$f54f3a5de5a589a5634e8e27bf7aca71b5ac347557495284881ae388402086905ce2923f1495264abbdfd0ad5c983c6bdc7d1880b035b834be268ad9d4556eb3');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Poems`
--

DROP TABLE IF EXISTS `Poems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Poems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `author_id` int(11) NOT NULL,
  `genre` varchar(50) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `Poems_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Poems`
--

LOCK TABLES `Poems` WRITE;
/*!40000 ALTER TABLE `Poems` DISABLE KEYS */;
INSERT INTO `Poems` VALUES (1,'Reflections at Dawn',1,'Philosophy','2024-12-01 16:23:09','Thoughts inspired by the sunrise.','As the sun breaks the horizon, the shadows of the night fade away.'),(2,'Journey Within',1,'Inspirational','2024-12-01 16:23:09','A self-discovery tale.','Each step I take, a revelation, the path unknown but enlightening.'),(3,'Whispers of the Wind',2,'Nature','2024-12-01 16:23:09','An ode to the elements.','The wind sings softly through the trees, a melody of freedom and peace.'),(4,'Dreamer’s Horizon',2,'Fantasy','2024-12-01 16:23:09','Exploring the realms of imagination.','Beyond the stars lies a world unknown, where dreams take flight.'),(5,'Code and Poetry',3,'Technology','2024-12-01 16:23:09','Blending the art of coding with poetic thought.','In lines of logic, beauty unfolds, a masterpiece in ones and zeroes.'),(6,'Algorithmic Love',3,'Romance','2024-12-01 16:23:09','A romantic poem for tech lovers.','If love is an algorithm, then you are my infinite loop.'),(7,'Fields of Glory',4,'Sports','2024-12-01 16:23:09','A celebration of triumphs and defeats.','Victory’s roar, defeat’s lesson, the game of life continues.'),(8,'Team Spirit',4,'Motivational','2024-12-01 16:23:09','A tribute to teamwork.','Together we rise, united in our purpose, strong and steadfast.'),(9,'Tales of the Page',5,'Literature','2024-12-01 16:23:09','A love letter to books.','Within the pages, a universe unfolds, stories of wonder untold.'),(10,'Bookworm’s Delight',5,'Personal','2024-12-01 16:23:09','A reflection on the joy of reading.','Hours dissolve as words weave their magic, transporting the soul.'),(11,'Code Symphony',6,'Technology','2024-12-01 16:23:09','The harmony of software development.','Lines of code, a melody of creation, a symphony in digital form.'),(12,'Debugging Life',6,'Humor','2024-12-01 16:23:09','A programmer’s perspective on life.','Life is a bug, and I am its debugger.'),(13,'Melodies of the Heart',7,'Music','2024-12-01 16:23:09','An ode to the power of music.','Each note, a story, each chord, an emotion, together, they heal.'),(14,'Symphony of Stars',7,'Nature','2024-12-01 16:23:09','Music inspired by the night sky.','The stars hum a tune, a celestial symphony echoing in the night.'),(15,'Wanderlust',8,'Travel','2024-12-01 16:23:09','A poem for those who roam.','The road beckons, whispers of lands unknown, a call to adventure.'),(16,'Postcards of Memories',8,'Reflection','2024-12-01 16:23:09','A collection of travel reflections.','Each journey, a story, each destination, a memory cherished.'),(17,'The Traveler’s Tale',9,'Travel','2024-12-01 16:23:09','A travel blogger’s experiences.','With every step, a tale unfolds, written in the sands of time.'),(18,'Exploring Horizons',9,'Adventure','2024-12-01 16:23:09','On the beauty of exploration.','Beyond the horizon, lies a world waiting, calling to the curious.'),(19,'Shuttered Moments',10,'Photography','2024-12-01 16:23:09','Capturing life through a lens.','A click, a frame, a moment immortalized, life frozen in time.'),(20,'Colors of the World',10,'Art','2024-12-01 16:23:09','A celebration of diversity through photography.','Through my lens, I see the world, a palette of endless hues.'),(21,'Artistic Whispers',11,'Art','2024-12-01 16:23:09','A tribute to creativity.','Each brushstroke, a word, each canvas, a story untold.'),(22,'Designing Dreams',11,'Inspirational','2024-12-01 16:23:09','Merging art and dreams.','From mind to canvas, dreams come alive in vibrant hues.'),(23,'Wired Thoughts',12,'Technology','2024-12-01 16:23:09','A tech enthusiast’s musings.','Circuits and codes, the language of the future, shaping our tomorrow.'),(24,'Innovation’s Edge',12,'Technology','2024-12-01 16:23:09','The thrill of technological breakthroughs.','With every leap, a barrier falls, humanity soars higher.'),(25,'Trails of Serenity',13,'Nature','2024-12-01 16:23:09','Finding peace in the wilderness.','Amidst the trees, a serenity dwells, nature’s embrace soothes.'),(26,'Mountain Echoes',13,'Adventure','2024-12-01 16:23:09','Hiking through rugged landscapes.','Each step, an echo of resolve, each peak, a testament to will.'),(27,'Screenplay of Life',14,'Movies','2024-12-01 16:23:09','Life as seen through cinema.','On the silver screen, life’s stories unfold, reflections of our soul.'),(28,'Reel Emotions',14,'Drama','2024-12-01 16:23:09','The emotional power of films.','In each scene, a universe stirs, a journey of heart and mind.'),(29,'Nature’s Symphony',15,'Nature','2024-12-01 16:23:09','The harmony of the natural world.','The rustle of leaves, the whisper of streams, nature’s music eternal.'),(30,'Seasons of Change',15,'Reflection','2024-12-01 16:23:09','The beauty of changing seasons.','Each season, a chapter, each change, a lesson in time.'),(31,'Gaming Realms',16,'Gaming','2024-12-01 16:23:09','Exploring virtual worlds.','In pixelated landscapes, adventures await, challenges to conquer.'),(32,'The Player’s Quest',16,'Fantasy','2024-12-01 16:23:09','The journey of a gamer.','Through dungeons and realms, victory lies in courage and skill.'),(33,'The Digital Muse',17,'Social Media','2024-12-01 16:23:09','Life in the digital age.','Filters and likes, a reflection of our virtual selves.'),(34,'Influencer’s Path',17,'Lifestyle','2024-12-01 16:23:09','The story of an influencer.','Through posts and stories, a connection is forged, spanning worlds.'),(35,'Web of Dreams',18,'Technology','2024-12-01 16:23:09','Building the internet’s fabric.','Lines of code weave connections, bridging hearts and minds.'),(36,'Developer’s Diary',18,'Reflection','2024-12-01 16:23:09','The daily life of a web developer.','Challenges arise, but solutions bloom, progress never ceases.'),(37,'Words Unwritten',19,'Writing','2024-12-01 16:23:09','A writer’s struggle to create.','The blank page stares, yet the mind dreams, stories yearning to be born.'),(38,'Editing the Soul',19,'Reflection','2024-12-01 16:23:09','A metaphor for personal growth.','In each rewrite, the self transforms, becoming clearer, stronger.'),(39,'Fashion Forward',20,'Fashion','2024-12-01 16:23:09','The evolution of style.','Threads of time, colors of passion, woven into identity.'),(40,'Runway Dreams',20,'Inspirational','2024-12-01 16:23:09','Chasing dreams in the world of fashion.','With every step, confidence grows, dreams walk the runway.');
/*!40000 ALTER TABLE `Poems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `poem_id` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `stars` int(11) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  KEY `poem_id` (`poem_id`),
  CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `Poems` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ratings`
--

LOCK TABLES `Ratings` WRITE;
/*!40000 ALTER TABLE `Ratings` DISABLE KEYS */;
INSERT INTO `Ratings` VALUES (1,1,3,'2024-12-01 16:23:15',4,'Inspiring, but I was hoping for a bit more excitement.'),(2,2,6,'2024-12-01 16:23:15',5,'A perfect poem! I really related to it.'),(3,3,1,'2024-12-01 16:23:15',3,'Interesting approach, though a bit short.'),(4,4,4,'2024-12-01 16:23:15',5,'A poem that motivated me to face challenges.'),(5,5,8,'2024-12-01 16:23:15',4,'Good narrative, but could have gone into more depth.'),(6,6,2,'2024-12-01 16:23:15',5,'The best expression of imagination I\'ve ever read.'),(7,7,12,'2024-12-01 16:23:15',3,'A good poem, but it lacked some spark.'),(8,8,14,'2024-12-01 16:23:15',5,'It perfectly reflects the magic of cinema.'),(9,9,10,'2024-12-01 16:23:15',4,'Interesting perspective, especially in the colors.'),(10,10,16,'2024-12-01 16:23:15',5,'It made me think about games and their adventures.'),(11,11,18,'2024-12-01 16:23:15',2,'Didn\'t connect much with the topic, but good technique.'),(12,12,20,'2024-12-01 16:23:15',4,'Good use of language and structure.'),(13,13,7,'2024-12-01 16:23:15',5,'The music and emotions combined perfectly.'),(14,14,11,'2024-12-01 16:23:15',4,'Creative and with an interesting artistic vision.'),(15,15,9,'2024-12-01 16:23:15',3,'Could have had a deeper message.'),(16,16,5,'2024-12-01 16:23:15',5,'Amazing, made me reflect on my love for books.'),(17,17,13,'2024-12-01 16:23:15',4,'Captured the serenity of nature beautifully.'),(18,18,15,'2024-12-01 16:23:15',5,'Amazing description of the changing of seasons.'),(19,19,17,'2024-12-01 16:23:15',3,'Interesting take on digital life.'),(20,20,19,'2024-12-01 16:23:15',4,'It reflected the writer\'s passion with authenticity.'),(21,10,19,'2024-12-01 16:23:15',5,'Perfectly captures the art of photography and how it immortalizes moments.'),(22,9,17,'2024-12-01 16:23:15',4,'Very moving and well written, made me think about my own travel experiences.'),(23,9,18,'2024-12-01 16:23:15',5,'Exploring horizons is a beautiful way to show how the world calls us to adventure.'),(24,8,15,'2024-12-01 16:23:15',4,'A poem that captures the essence of travel, very evocative.'),(25,8,16,'2024-12-01 16:23:15',5,'A perfect way to reflect on travel memories!'),(26,7,13,'2024-12-01 16:23:15',5,'Beautiful ode to music, it really touched my heart.'),(27,7,14,'2024-12-01 16:23:15',3,'The topic is interesting, but the poem could have been deeper.'),(28,6,11,'2024-12-01 16:23:15',4,'A poem celebrating art and creativity.'),(29,6,12,'2024-12-01 16:23:15',5,'Excellent humor for a programmer, made me laugh a lot!'),(30,5,9,'2024-12-01 16:23:15',4,'A tribute to books that captures the magic of reading.'),(31,5,10,'2024-12-01 16:23:15',5,'I loved the emotional connection with the act of reading, truly inspiring.'),(32,4,7,'2024-12-01 16:23:15',5,'Excellent motivational poem about teamwork, really inspiring.'),(33,4,8,'2024-12-01 16:23:15',3,'A poem that celebrates team spirit, but with a somewhat simplistic approach.'),(34,3,5,'2024-12-01 16:23:15',4,'A beautiful tribute to literature, I loved the style.'),(35,3,6,'2024-12-01 16:23:15',2,'I didn\'t connect with the subject, but the technique is impressive.'),(36,2,3,'2024-12-01 16:23:15',3,'Interesting mix of technology and poetry, though it could go deeper into emotion.'),(37,2,4,'2024-12-01 16:23:15',4,'A well-done reflection on the nature of life.'),(38,1,1,'2024-12-01 16:23:15',4,'A reflective poem that captures the essence of sunrise.'),(39,1,2,'2024-12-01 16:23:15',5,'Very inspiring, made me think about my own journey of self-discovery.'),(40,10,20,'2024-12-01 16:23:15',4,'A beautiful poem about diversity, although some points could be clearer.');
/*!40000 ALTER TABLE `Ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(10) NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `username` varchar(40) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `description` varchar(100) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'John','Doe','johndoe','Male','A regular user','johndoe@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(2,'Jane','Smith','janesmith','Female','Another regular user','janesmith@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(3,'Alice','Johnson','alicejohnson','Female','Loves programming','alicej@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(4,'Bob','Williams','bobwilliams','Male','Enjoys sports','bobwilliams@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(5,'Charlie','Brown','charliebrown','Male','Enjoys reading books','charlieb@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(6,'Diana','Davis','dianadavis','Female','A software developer','dianadavis@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(7,'Eve','Martinez','evemartinez','Female','Enjoys music','evem@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(8,'Frank','Garcia','frankgarcia','Male','Loves traveling','frankg@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(9,'Grace','Hernandez','gracehernandez','Female','Travel blogger','graceh@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(10,'Harry','Lopez','harrylopez','Male','Photographer','harryl@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(11,'Ivy','Gonzalez','ivygonzalez','Female','Artist and designer','ivygonzalez@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(12,'Jack','Wilson','jackwilson','Male','Tech enthusiast','jackw@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(13,'Kathy','Anderson','kathyanderson','Female','Likes hiking','kathy@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(14,'Leo','Thomas','leothomas','Male','Enjoys movies','leothomas@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(15,'Megan','Jackson','meganjackson','Female','Loves nature','meganj@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(16,'Nick','White','nickwhite','Male','Likes games','nickw@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(17,'Olivia','Martin','oliviamartin','Female','Social media influencer','oliviam@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(18,'Paul','Lee','paullee','Male','Web developer','paullee@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(19,'Quinn','Perez','quinnperez','Female','Writer and editor','quinnperez@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde'),(20,'Rita','Clark','ritaclark','Female','Fashion enthusiast','ritac@example.com','scrypt:32768:8:1$YuwiymS0NQc0DYxu$7043bb6991d39e03984034118db57a20ca34cbb07796b2199a4ae80b603f82c77cf7faa1859bc933243f7d3015d26ea15326baf2f78edde18514251b35d67cde');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01 16:29:19
