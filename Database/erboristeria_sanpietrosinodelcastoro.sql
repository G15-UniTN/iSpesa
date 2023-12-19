-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Dic 14, 2023 alle 15:18
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erboristeria_sanpietrosinodelcastoro`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `categoria`
--

CREATE TABLE `categoria` (
  `Categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `categoria`
--

INSERT INTO `categoria` (`Categoria`) VALUES
('Bevande_alcoliche'),
('Bevande_analcoliche'),
('Carne'),
('Casa'),
('Colazione'),
('Cura_della_persona'),
('Formaggi'),
('Frutta'),
('Gastronomia'),
('Latte,Uova_e_Derivati'),
('Pane_e_Pasticceria'),
('Pasta'),
('Pesce'),
('Prodotti_alimentari'),
('Salumi'),
('Verdura');

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotto`
--

CREATE TABLE `prodotto` (
  `Nome` varchar(255) NOT NULL,
  `Immagine` varchar(255) NOT NULL,
  `Categoria` varchar(255) NOT NULL,
  `Prezzo` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prodotto`
--

INSERT INTO `prodotto` (`Nome`, `Immagine`, `Categoria`, `Prezzo`) VALUES
('agata_rossa', 'https://drive.google.com/file/d/1yoP2UraVyEsX3iTuhDK-2ju65AddOyFv/view?usp=sharing', 'Cura_della_persona', 35),
('alloro', 'https://drive.google.com/file/d/1D4Qv2xPVKtdPCU-gtteoQ2ibw3CyShuS/view?usp=drive_link', 'Prodotti_alimentari', 3),
('ambra', 'https://drive.google.com/file/d/1VUJmQEqkPCy-pvCyguwQ76glGmQeNbvo/view?usp=drive_link', 'Cura_della_persona', 40),
('ametista', 'https://drive.google.com/file/d/1kF7j39Lakl3FNwybpwNGc3MmJQbQ79U-/view?usp=drive_link', 'Cura_della_persona', 35),
('basilico', 'https://drive.google.com/file/d/1RLOmPwPmSQzSnUm1zU5IfM7_-MkLmA7Q/view?usp=drive_link', 'Prodotti_alimentari', 2),
('Caramelle_Ricola_Erbe_Balsamiche', 'https://drive.google.com/file/d/1j5eyUFBJb-zeulX5XZdSftlP62yeJdI9/view?usp=drive_link', 'Gastronomia', 4),
('Caramelle_Sperlari', 'https://drive.google.com/file/d/1044pZoVV71cU0LEcgQuEPIu7hYmq6lPy/view?usp=drive_link', 'Gastronomia', 7),
('Castorino_pietrosino', 'https://drive.google.com/file/d/1ZiUtb8l8VlBeNtrahY42Io5TfExw-UvO/view?usp=drive_link', 'Casa', 25),
('erba_cipollina', 'https://drive.google.com/file/d/1fszssqxnRvTb5xCCPaeo4KHI5nR0wJ7r/view?usp=drive_link', 'Prodotti_alimentari', 10),
('finocchietto', 'https://drive.google.com/file/d/1d0FIaAWx9B0xbVLnpZXUilxiy0oJi5C_/view?usp=drive_link', 'Prodotti_alimentari', 1),
('lapislazzuli', 'https://drive.google.com/file/d/1_0viwrN3VrWz8UJifAmPovw9wb1aVTOG/view?usp=drive_link', 'Cura_della_persona', 35),
('lavanda', 'https://drive.google.com/file/d/1ylqjK1mZ7gcfHGCvAGHGbUAU_E9cMJTF/view?usp=drive_link', 'Prodotti_alimentari', 6),
('maggiorana', 'https://drive.google.com/file/d/1krxvUXI9WsFqhrbOoCmrbLY_s93zDeUb/view?usp=drive_link', 'Prodotti_alimentari', 8),
('menta', 'https://drive.google.com/file/d/1KC5cciOHWblGbKgHnHZnuDlBFZ9gXLhO/view?usp=drive_link', 'Prodotti_alimentari', 2),
('origano', 'https://drive.google.com/file/d/13do7e3wiFGxy_WCjqQC6i_6oI0v2Ms8K/view?usp=drive_link', 'Prodotti_alimentari', 3),
('prezzemolo', 'https://drive.google.com/file/d/1iTJN-VgjKoSp3ldHhiP5rdf4XlUHHIZQ/view?usp=drive_link', 'Prodotti_alimentari', 1),
('Quadre_miste_alle_erbe', 'https://drive.google.com/file/d/1HABMTWR6jVD3r_o2859yo9WkdGHtY4lD/view?usp=drive_link', 'Gastronomia', 8),
('rosmarino', 'https://drive.google.com/file/d/15ciEUMmVO_as2jFYGxwhRCnx6j-WPr9h/view?usp=drive_link', 'Prodotti_alimentari', 1),
('salvia', 'https://drive.google.com/file/d/1aZZDaLcqrv__r1Jx11rxksG_eUDLx5R2/view?usp=drive_link', 'Prodotti_alimentari', 2),
('tiger_eye', 'https://drive.google.com/file/d/1_iAaORRoHfieCKwIP4kLivRCIWtFrmUN/view?usp=drive_link', 'Cura_della_persona', 30),
('timo', 'https://drive.google.com/file/d/1pcB82ROlc5I8yEFldyY6wQXXAkm1ZxSf/view?usp=drive_link', 'Prodotti_alimentari', 2);

-- --------------------------------------------------------

--
-- Struttura della tabella `sconto`
--

CREATE TABLE `sconto` (
  `Valore` int(255) NOT NULL,
  `IDSconto` varchar(255) NOT NULL,
  `Scadenza` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `sconto`
--

INSERT INTO `sconto` (`Valore`, `IDSconto`, `Scadenza`) VALUES
(40, '1PIET', '2024-06-15'),
(15, '5SDFA', '2024-02-28'),
(10, '5SRTA', '2024-03-31'),
(20, '6SDFA', '2024-01-31'),
(10, 'HELLO', '2024-12-31');

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_categoria`
--

CREATE TABLE `validita_sconto_categoria` (
  `sconto` varchar(255) NOT NULL,
  `Categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `validita_sconto_categoria`
--

INSERT INTO `validita_sconto_categoria` (`sconto`, `Categoria`) VALUES
('HELLO', 'Casa');

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_prodotto`
--

CREATE TABLE `validita_sconto_prodotto` (
  `Prodotto` varchar(255) NOT NULL,
  `sconto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `validita_sconto_prodotto`
--

INSERT INTO `validita_sconto_prodotto` (`Prodotto`, `sconto`) VALUES
('ambra', '1PIET'),
('ametista', '1PIET'),
('basilico', '5SDFA'),
('castorino_pietrosino', '6SDFA'),
('menta', '5SDFA'),
('prezzemolo', '5SRTA'),
('prezzemolo', '6SDFA'),
('timo', '5SDFA'),
('timo', '5SRTA');

-- --------------------------------------------------------

--
-- Struttura della tabella `volantino`
--

CREATE TABLE `volantino` (
  `File` varchar(255) NOT NULL,
  `DataFine` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Categoria`);

--
-- Indici per le tabelle `prodotto`
--
ALTER TABLE `prodotto`
  ADD PRIMARY KEY (`Nome`),
  ADD KEY `prodotto-categoria` (`Categoria`);

--
-- Indici per le tabelle `sconto`
--
ALTER TABLE `sconto`
  ADD PRIMARY KEY (`IDSconto`);

--
-- Indici per le tabelle `validita_sconto_categoria`
--
ALTER TABLE `validita_sconto_categoria`
  ADD PRIMARY KEY (`sconto`,`Categoria`),
  ADD KEY `sconto-categoria` (`Categoria`);

--
-- Indici per le tabelle `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD PRIMARY KEY (`Prodotto`,`sconto`),
  ADD KEY `sconto-validita` (`sconto`);

--
-- Indici per le tabelle `volantino`
--
ALTER TABLE `volantino`
  ADD PRIMARY KEY (`File`);

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `prodotto`
--
ALTER TABLE `prodotto`
  ADD CONSTRAINT `prodotto-categoria` FOREIGN KEY (`Categoria`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `validita_sconto_categoria`
--
ALTER TABLE `validita_sconto_categoria`
  ADD CONSTRAINT `sconto-categoria` FOREIGN KEY (`Categoria`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `validitàsconto` FOREIGN KEY (`sconto`) REFERENCES `sconto` (`IDSconto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD CONSTRAINT `sconto-prodotto` FOREIGN KEY (`Prodotto`) REFERENCES `prodotto` (`Nome`),
  ADD CONSTRAINT `sconto-validita` FOREIGN KEY (`sconto`) REFERENCES `sconto` (`IDSconto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
