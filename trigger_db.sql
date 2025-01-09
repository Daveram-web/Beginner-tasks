-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2024 at 05:22 AM
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
-- Database: `trigger_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `event_tb`
--

CREATE TABLE `event_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `c_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_tb`
--

INSERT INTO `event_tb` (`id`, `name`, `email`, `c_date`) VALUES
(3, 'Dave', 'ram@gmail.com', '2024-12-30 07:22:02'),
(4, 'ram', 'dave@gmail.com', '2024-12-30 07:25:40'),
(5, 'as', 'as@gmail.com', '2024-12-30 07:31:57'),
(6, 'ad', 'ad@gmail.com', '2024-12-30 07:45:17'),
(7, 'ass', 'ss', '2024-12-30 08:28:13'),
(8, 'd', 'd', '2024-12-30 08:37:11'),
(9, '', 'a@gmail.com', '0000-00-00 00:00:00'),
(10, 'as', 'sa', '2024-12-30 10:27:23');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `c_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `action`, `c_date`) VALUES
(1, 2, 'Inserted', '2024-12-30 10:50:52'),
(2, 2, 'updated', '2024-12-30 10:55:48'),
(3, 2, 'deleted', '2024-12-30 10:58:10'),
(4, 3, 'Inserted', '2024-12-30 11:52:16'),
(5, 4, 'Inserted', '2024-12-30 11:55:56'),
(6, 5, 'Inserted', '2024-12-30 12:02:11'),
(7, 6, 'Inserted', '2024-12-30 12:15:32'),
(8, 7, 'Inserted', '2024-12-30 12:58:22'),
(9, 8, 'Insert', '2024-12-30 13:07:16'),
(10, 9, 'Insert', '2024-12-30 13:17:15'),
(11, 10, 'Insert', '2024-12-30 15:05:46'),
(12, 11, 'Insert', '2024-12-30 15:09:17');

-- --------------------------------------------------------

--
-- Table structure for table `manuvel_trigger`
--

CREATE TABLE `manuvel_trigger` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `c_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manuvel_trigger`
--

INSERT INTO `manuvel_trigger` (`id`, `user_id`, `action`, `c_date`) VALUES
(2, 10, 'Insert', '2024-12-30 15:05:46'),
(3, 11, 'Insert', '2024-12-30 15:09:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `c_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `c_date`) VALUES
(3, 'Dave', 'ram@gmail.com', '2024-12-30 07:22:02'),
(4, 'ram', 'dave@gmail.com', '2024-12-30 07:25:40'),
(5, 'as', 'as@gmail.com', '2024-12-30 07:31:57'),
(6, 'ad', 'ad@gmail.com', '2024-12-30 07:45:17'),
(7, 'ass', 'ss', '2024-12-30 08:28:13'),
(8, 'd', 'd', '2024-12-30 08:37:11'),
(9, '', 'a@gmail.com', '0000-00-00 00:00:00'),
(10, ' qw', 'wq', '2024-12-30 10:35:12'),
(11, 'aas', 'asas', '2024-12-30 10:38:53');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    INSERT INTO manuvel_trigger (id, name, action_, dateTim)
    VALUES (null,NEW.id, 'Insert', NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
    INSERT INTO manuvel_trigger (id, name, action_, dateTim)
    VALUES (null,NEW.id, 'Insert', NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
    INSERT INTO manuvel_trigger (id, name, action_, dateTim)
    VALUES (null,NEW.id, 'Update', NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `deleted` AFTER DELETE ON `users` FOR EACH ROW INSERT INTO logs VALUES(null,Old.id,'deleted',Now())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `insertlog` AFTER INSERT ON `users` FOR EACH ROW INSERT INTO logs VALUES(null,NEW.id,'Insert',NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updated` AFTER UPDATE ON `users` FOR EACH ROW INSERT INTO logs VALUES(null,New.id,'updated',Now())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `users_view`
-- (See below for the actual view)
--
CREATE TABLE `users_view` (
`email` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure for view `users_view`
--
DROP TABLE IF EXISTS `users_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `users_view`  AS SELECT `users`.`email` AS `email` FROM `users` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event_tb`
--
ALTER TABLE `event_tb`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manuvel_trigger`
--
ALTER TABLE `manuvel_trigger`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event_tb`
--
ALTER TABLE `event_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `manuvel_trigger`
--
ALTER TABLE `manuvel_trigger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
