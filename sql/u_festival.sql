-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2026 at 11:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u_festival`
--

-- --------------------------------------------------------

--
-- Table structure for table `acts`
--

CREATE TABLE `acts` (
  `id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `tagline_nl` varchar(200) DEFAULT NULL,
  `tagline_en` varchar(200) DEFAULT NULL,
  `description_nl` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `begin_time` time NOT NULL,
  `end_time` time NOT NULL,
  `artist_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `acts`
--

INSERT INTO `acts` (`id`, `day_id`, `stage_id`, `name`, `tagline_nl`, `tagline_en`, `description_nl`, `description_en`, `video_url`, `begin_time`, `end_time`, `artist_id`) VALUES
(1, 1, 1, 'Armin van Buuren', 'trance icon', 'trance icon', 'Vijfvoudig \'World\'s No. 1 DJ\' en trance-icoon. Armin levert euforische, energieke sets die headlinen op Tomorrowland en Ultra. Zijn meeslepende melodieën en perfecte mixing houden crowds urenlang aan het dansen.', 'Five-time World\'s No. 1 DJ and trance icon. Armin delivers euphoric, high-energy sets headlining Tomorrowland and Ultra. His uplifting melodies and impeccable mixing keep crowds dancing for hours.', 'https://www.youtube.com/watch?v=TxvpctgU_s8', '10:30:00', '12:00:00', 1),
(2, 1, 1, 'Kensington', 'indie rock anthems', 'indie rock anthems', 'Rotterdamse indie-rockband bekend om meeslepende refreinen en krachtige gitaarriffs. Hits als \'Streets\' en \'Riddles\' laten hun talent zien voor arena-waardige hooks.', 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs. Hits like \'Streets\' and \'Riddles\' showcase their knack for arena-ready hooks.', 'https://www.youtube.com/watch?v=IH77eOyV95o', '12:30:00', '14:00:00', 2),
(3, 1, 1, 'De Staat', 'experimentele rock innovators', 'experimental rock innovators', 'Experimentele rockband uit Nijmegen met funky grooves, hoekig gitaarwerk en theatrale energie. Tracks als \'Witch Doctor\' laten hun genre-overstijgende aanpak zien.', 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work and theatrical stagecraft. Tracks like \'Witch Doctor\' highlight their genre-bending approach.', 'https://www.youtube.com/watch?v=0ttGgIQpAUc', '14:30:00', '16:30:00', 3),
(4, 1, 1, 'Navarone', 'harde Utrechtse rockband', 'hard-hitting rock four-piece', 'Utrechtse rockband met riff-gedreven anthems en dynamische vocalen. Bekend om hun rauwe intensiteit op het podium.', 'Utrecht\'s hard-hitting rock four-piece delivering riff-driven anthems and dynamic vocals, tailor-made for late-night main stages.', 'https://www.youtube.com/watch?v=EvLpaCSnc4k', '17:00:00', '18:30:00', 4),
(5, 1, 1, 'Dotan', 'folk-pop singer-songwriter', 'folk-pop singer-songwriter', 'Singer-songwriter wiens intieme stem en akoestische arrangementen hem platina verkopen en uitverkochte shows opleverden. Zijn oprechte verhalen raken diep.', 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements have earned platinum sales and sell-out shows. His heartfelt storytelling connects deeply.', 'https://www.youtube.com/watch?v=FZEuqzW16Nw', '19:15:00', '21:15:00', 5),
(6, 1, 1, 'Froukje', 'openhartige pop songwriter', 'candid pop songwriter', 'Doorbraak popsongwriter die openhartige teksten combineert met catchy synth-gedreven hooks. Sinds haar debuut in 2021 is ze de stem van haar generatie.', 'Breakthrough pop singer combining candid lyrics with catchy synth-driven hooks. Since her 2021 debut she has become a defining voice of her generation.', 'https://www.youtube.com/watch?v=g4PlReX9e-E', '22:00:00', '24:00:00', 6),
(7, 1, 3, 'Talent set 1', 'The Lake', 'The Lake', 'Talent set 1.', 'Talent set 1.', '', '10:00:00', '11:00:00', NULL),
(8, 1, 3, 'Talent set 2', 'The Lake', 'The Lake', 'Talent set 2.', 'Talent set 2.', '', '11:30:00', '13:00:00', NULL),
(9, 1, 3, 'Talent set 3', 'The Lake', 'The Lake', 'Talent set 3.', 'Talent set 3.', '', '13:30:00', '15:00:00', NULL),
(10, 1, 3, 'Talent set 4', 'The Lake', 'The Lake', 'Talent set 4.', 'Talent set 4.', '', '15:30:00', '17:00:00', NULL),
(11, 1, 3, 'Talent set 5', 'The Lake', 'The Lake', 'Talent set 5.', 'Talent set 5.', '', '17:30:00', '18:30:00', NULL),
(12, 1, 3, 'Talent set 6', 'The Lake', 'The Lake', 'Talent set 6.', 'Talent set 6.', '', '19:15:00', '20:45:00', NULL),
(13, 1, 3, 'Talent set 7', 'The Lake', 'The Lake', 'Talent set 7.', 'Talent set 7.', '', '21:30:00', '23:00:00', NULL),
(14, 1, 2, 'Comedy', 'The Club', 'The Club', 'Comedy show.', 'Comedy show.', '', '12:15:00', '13:00:00', NULL),
(15, 1, 2, 'Lecture', 'The Club', 'The Club', 'Lezing.', 'Lecture.', '', '13:30:00', '14:30:00', NULL),
(16, 1, 2, 'Theater', 'The Club', 'The Club', 'Theater voorstelling.', 'Theater performance.', '', '15:15:00', '16:45:00', NULL),
(17, 1, 2, 'Movie', 'The Club', 'The Club', 'Filmvertoning.', 'Movie screening.', '', '17:30:00', '19:30:00', NULL),
(18, 1, 2, 'Performance', 'The Club', 'The Club', 'Live performance.', 'Live performance.', '', '20:15:00', '21:15:00', NULL),
(19, 1, 2, 'Illusionist', 'The Club', 'The Club', 'Illusionist show.', 'Illusionist show.', '', '22:00:00', '23:00:00', NULL),
(20, 1, 4, 'DJ set 1', 'Hanggar', 'Hanggar', 'DJ set 1.', 'DJ set 1.', '', '10:00:00', '11:00:00', NULL),
(21, 1, 4, 'DJ set 2', 'Hanggar', 'Hanggar', 'DJ set 2.', 'DJ set 2.', '', '11:00:00', '12:30:00', NULL),
(22, 1, 4, 'DJ set 3', 'Hanggar', 'Hanggar', 'DJ set 3.', 'DJ set 3.', '', '12:30:00', '14:00:00', NULL),
(23, 1, 4, 'DJ set 4', 'Hanggar', 'Hanggar', 'DJ set 4.', 'DJ set 4.', '', '14:00:00', '15:30:00', NULL),
(24, 1, 4, 'DJ set 5', 'Hanggar', 'Hanggar', 'DJ set 5.', 'DJ set 5.', '', '15:30:00', '17:30:00', NULL),
(25, 1, 4, 'DJ set 6', 'Hanggar', 'Hanggar', 'DJ set 6.', 'DJ set 6.', '', '17:30:00', '19:30:00', NULL),
(26, 1, 4, 'DJ set 7', 'Hanggar', 'Hanggar', 'DJ set 7.', 'DJ set 7.', '', '19:30:00', '21:30:00', NULL),
(27, 1, 4, 'DJ set 8', 'Hanggar', 'Hanggar', 'DJ set 8.', 'DJ set 8.', '', '21:30:00', '24:00:00', NULL),
(28, 2, 1, 'Martin Garrix', 'elektronisch fenomeen', 'electronic phenomenon', 'Martin Garrix is een van de meest invloedrijke DJ\'s ter wereld. Met hits als \'Animals\' veroverde hij de wereld.', 'Martin Garrix is one of the most influential DJs in the world, with hits like \'Animals\' conquering global charts.', '', '11:00:00', '13:00:00', 7),
(29, 2, 1, 'Within Temptation', 'symfonische metal', 'symphonic metal', 'Nederlandse symfonische metalband met epische orkestrale klanken en de krachtige stem van Sharon den Adel.', 'Dutch symphonic metal band with epic orchestral soundscapes and the powerful vocals of Sharon den Adel.', '', '13:45:00', '15:45:00', 8),
(30, 2, 1, 'Chef\'Special', 'indie pop met soul', 'indie pop with soul', 'Chef\'Special mengt indie, pop, reggae en soul tot een uniek en energiek geluid dat iedereen op de been krijgt.', 'Chef\'Special blends indie, pop, reggae and soul into a unique energetic sound that gets everyone on their feet.', '', '16:30:00', '18:30:00', 9),
(31, 2, 1, 'Eefje de Visser', 'elektropoppoëzie', 'electropop poetry', 'Eefje de Visser maakt dromerige elektropopmuziek met poëtische Nederlandse teksten en hypnotiserende melodieën.', 'Eefje de Visser crafts dreamy electropop with poetic Dutch lyrics and hypnotic melodies.', '', '19:15:00', '21:15:00', 10),
(32, 2, 1, 'Spinvis', 'Nederlandse indie pop legende', 'Dutch indie pop legend', 'Spinvis maakt unieke Nederlandstalige indie pop met rijke teksten en een cinematisch geluid.', 'Spinvis creates unique Dutch-language indie pop with rich lyrics and a cinematic sound.', '', '22:00:00', '24:00:00', 11),
(33, 2, 3, 'Talent set 1', 'The Lake', 'The Lake', 'Talent set 1.', 'Talent set 1.', '', '10:00:00', '11:00:00', NULL),
(34, 2, 3, 'Talent set 2', 'The Lake', 'The Lake', 'Talent set 2.', 'Talent set 2.', '', '11:30:00', '13:00:00', NULL),
(35, 2, 3, 'Talent set 3', 'The Lake', 'The Lake', 'Talent set 3.', 'Talent set 3.', '', '13:30:00', '15:00:00', NULL),
(36, 2, 3, 'Talent set 4', 'The Lake', 'The Lake', 'Talent set 4.', 'Talent set 4.', '', '15:30:00', '17:30:00', NULL),
(37, 2, 3, 'Talent set 5', 'The Lake', 'The Lake', 'Talent set 5.', 'Talent set 5.', '', '18:15:00', '19:45:00', NULL),
(38, 2, 3, 'Talent set 6', 'The Lake', 'The Lake', 'Talent set 6.', 'Talent set 6.', '', '20:30:00', '22:30:00', NULL),
(39, 2, 2, 'Comedy', 'The Club', 'The Club', 'Comedy show.', 'Comedy show.', '', '12:00:00', '12:45:00', NULL),
(40, 2, 2, 'Lecture', 'The Club', 'The Club', 'Lezing.', 'Lecture.', '', '13:30:00', '14:30:00', NULL),
(41, 2, 2, 'Theater', 'The Club', 'The Club', 'Theater voorstelling.', 'Theater performance.', '', '15:30:00', '16:30:00', NULL),
(42, 2, 2, 'Movie', 'The Club', 'The Club', 'Filmvertoning.', 'Movie screening.', '', '17:30:00', '19:30:00', NULL),
(43, 2, 2, 'Magic Show', 'The Club', 'The Club', 'Goochelshow.', 'Magic show.', '', '20:15:00', '21:45:00', NULL),
(44, 2, 4, 'DJ set 1', 'Hanggar', 'Hanggar', 'DJ set 1.', 'DJ set 1.', '', '10:00:00', '10:30:00', NULL),
(45, 2, 4, 'DJ set 2', 'Hanggar', 'Hanggar', 'DJ set 2.', 'DJ set 2.', '', '10:30:00', '12:30:00', NULL),
(46, 2, 4, 'DJ set 3', 'Hanggar', 'Hanggar', 'DJ set 3.', 'DJ set 3.', '', '12:30:00', '13:30:00', NULL),
(47, 2, 4, 'DJ set 4', 'Hanggar', 'Hanggar', 'DJ set 4.', 'DJ set 4.', '', '13:30:00', '15:30:00', NULL),
(48, 2, 4, 'DJ set 5', 'Hanggar', 'Hanggar', 'DJ set 5.', 'DJ set 5.', '', '15:30:00', '17:00:00', NULL),
(49, 2, 4, 'DJ set 6', 'Hanggar', 'Hanggar', 'DJ set 6.', 'DJ set 6.', '', '17:00:00', '18:30:00', NULL),
(50, 2, 4, 'DJ set 7', 'Hanggar', 'Hanggar', 'DJ set 7.', 'DJ set 7.', '', '18:30:00', '21:00:00', NULL),
(51, 2, 4, 'DJ set 8', 'Hanggar', 'Hanggar', 'DJ set 8.', 'DJ set 8.', '', '21:00:00', '24:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `genre` varchar(200) DEFAULT NULL,
  `origin_nl` varchar(200) DEFAULT NULL,
  `origin_en` varchar(200) DEFAULT NULL,
  `photo_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `genre`, `origin_nl`, `origin_en`, `photo_url`) VALUES
(1, 'Armin van Buuren', 'Trance / Electronic', 'Leiden, Nederland', 'Leiden, Netherlands', ''),
(2, 'Kensington', 'Indie Rock', 'Rotterdam, Nederland', 'Rotterdam, Netherlands', ''),
(3, 'De Staat', 'Experimentele Rock', 'Nijmegen, Nederland', 'Nijmegen, Netherlands', ''),
(4, 'Navarone', 'Rock', 'Utrecht, Nederland', 'Utrecht, Netherlands', ''),
(5, 'Dotan', 'Folk-pop', 'Amsterdam, Nederland', 'Amsterdam, Netherlands', ''),
(6, 'Froukje', 'Pop', 'Groningen, Nederland', 'Groningen, Netherlands', ''),
(7, 'Martin Garrix', 'Electronic / Dance', 'Amstelveen, Nederland', 'Amstelveen, Netherlands', ''),
(8, 'Within Temptation', 'Symfonische Metal', 'Waddinxveen, Nederland', 'Waddinxveen, Netherlands', ''),
(9, 'Chef\'Special', 'Indie / Pop / Soul', 'Haarlem, Nederland', 'Haarlem, Netherlands', ''),
(10, 'Eefje de Visser', 'Electropop', 'Nijmegen, Nederland', 'Nijmegen, Netherlands', ''),
(11, 'Spinvis', 'Indie Pop', 'Utrecht, Nederland', 'Utrecht, Netherlands', '');

-- --------------------------------------------------------

--
-- Table structure for table `artist_socials`
--

CREATE TABLE `artist_socials` (
  `id` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL,
  `platform` enum('instagram','spotify') NOT NULL,
  `handle_or_id` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `artist_socials`
--

INSERT INTO `artist_socials` (`id`, `artist_id`, `platform`, `handle_or_id`) VALUES
(1, 1, 'instagram', 'arminvanbuuren'),
(2, 1, 'spotify', '6TH5p4KBMnMqAQ73B2msVT'),
(3, 2, 'instagram', 'kensingtonband'),
(4, 2, 'spotify', '3VHgLdCLgVKBHLnMXRfcRF'),
(5, 3, 'instagram', 'de_staat'),
(6, 3, 'spotify', '3roMQD9hD4RoFSR2YMbw2j'),
(7, 4, 'instagram', 'navaronerocks'),
(8, 4, 'spotify', '2cBhsPJTSFkxqiXYHFuGSV'),
(9, 5, 'instagram', 'dotanmusic'),
(10, 5, 'spotify', '06HL4z0CvFAxyc27GXpf02'),
(11, 6, 'instagram', 'froukjemusic'),
(12, 6, 'spotify', '4ULO7IGI3M2f5PZxBxWMmo'),
(13, 7, 'instagram', 'martingarrix'),
(14, 7, 'spotify', '60d24wfXkVzDSfLS6hyCjZ'),
(15, 8, 'instagram', 'withintemptation'),
(16, 8, 'spotify', '31mAUgNkXWoxTBGWLEJVDl'),
(17, 9, 'instagram', 'chefspecial'),
(18, 9, 'spotify', '2vGfC2xFq57dMCFGMoh0QI'),
(19, 10, 'instagram', 'eefjedevisser'),
(20, 10, 'spotify', '6bmlMHgSheBauioMCVBgBn'),
(21, 11, 'instagram', 'spinvismusic'),
(22, 11, 'spotify', '6ozfHfTSJZTxjpDnJX7EqN');

-- --------------------------------------------------------

--
-- Table structure for table `days`
--

CREATE TABLE `days` (
  `id` int(11) NOT NULL,
  `slug` varchar(32) NOT NULL,
  `name_nl` varchar(64) NOT NULL,
  `name_en` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `days`
--

INSERT INTO `days` (`id`, `slug`, `name_nl`, `name_en`) VALUES
(1, 'zaterdag', 'Zaterdag', 'Saturday'),
(2, 'zondag', 'Zondag', 'Sunday');

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` int(11) NOT NULL,
  `slug` varchar(32) NOT NULL,
  `name_nl` varchar(64) NOT NULL,
  `name_en` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `slug`, `name_nl`, `name_en`) VALUES
(1, 'poton', 'Poton', 'Poton'),
(2, 'club', 'Club', 'Club'),
(3, 'lake', 'Lake', 'Lake'),
(4, 'hanggar', 'Hanggar', 'Hanggar');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acts`
--
ALTER TABLE `acts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_act_stage` (`stage_id`),
  ADD KEY `fk_act_artist` (`artist_id`),
  ADD KEY `idx_acts_day_stage_time` (`day_id`,`stage_id`,`begin_time`);

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `artist_socials`
--
ALTER TABLE `artist_socials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_artist_platform` (`artist_id`,`platform`);

--
-- Indexes for table `days`
--
ALTER TABLE `days`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acts`
--
ALTER TABLE `acts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `artist_socials`
--
ALTER TABLE `artist_socials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `days`
--
ALTER TABLE `days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `acts`
--
ALTER TABLE `acts`
  ADD CONSTRAINT `fk_act_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_act_day` FOREIGN KEY (`day_id`) REFERENCES `days` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_act_stage` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `artist_socials`
--
ALTER TABLE `artist_socials`
  ADD CONSTRAINT `fk_social_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
