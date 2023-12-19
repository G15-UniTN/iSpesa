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
-- Database: `ispesa_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `amministratore`
--

CREATE TABLE `amministratore` (
  `Username` varchar(255) NOT NULL,
  `FotoProfilo` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Bloccato` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Struttura della tabella `negozio`
--

CREATE TABLE `negozio` (
  `Ubicazione` varchar(255) NOT NULL,
  `Orari` varchar(255) NOT NULL,
  `Nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `negozipreferiti`
--

CREATE TABLE `negozipreferiti` (
  `Utente` varchar(255) NOT NULL,
  `Negozi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodottipreferiti`
--

CREATE TABLE `prodottipreferiti` (
  `Prodotto` int(255) NOT NULL,
  `Utente` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotto`
--

CREATE TABLE `prodotto` (
  `Nome` varchar(255) NOT NULL,
  `Immagine` varchar(255) NOT NULL,
  `Categoria` varchar(255) NOT NULL,
  `IDProdotto` int(255) NOT NULL,
  `NegozioProvenienza` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `recensione`
--

CREATE TABLE `recensione` (
  `Titolo` varchar(255) NOT NULL,
  `Testo` varchar(255) NOT NULL,
  `N_stelle` int(5) NOT NULL,
  `Data_creazione` date NOT NULL,
  `Utente` varchar(255) NOT NULL,
  `Negozio` varchar(255) NOT NULL,
  `IDRecensione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `sconto`
--

CREATE TABLE `sconto` (
  `NegozioDoveValido` varchar(255) NOT NULL,
  `CategoriaApplicabile` varchar(255) NOT NULL,
  `Valore` int(11) NOT NULL,
  `IDSconto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `storicoprezzi`
--

CREATE TABLE `storicoprezzi` (
  `Prodotto` int(255) NOT NULL,
  `Prezzo` int(255) NOT NULL,
  `Data` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `utente_registrato`
--

CREATE TABLE `utente_registrato` (
  `Username` varchar(255) NOT NULL,
  `FotoProfilo` varchar(255) NOT NULL,
  `2AF_attiva` tinyint(1) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Bloccato` tinyint(1) NOT NULL,
  `Telefono` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_categoria`
--

CREATE TABLE `validita_sconto_categoria` (
  `sconto` varchar(255) NOT NULL,
  `Categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_prodotto`
--

CREATE TABLE `validita_sconto_prodotto` (
  `Sconto` varchar(255) NOT NULL,
  `prodotto` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `volantino`
--

CREATE TABLE `volantino` (
  `Negozio` varchar(255) NOT NULL,
  `DataFine` date NOT NULL,
  `VolantinoFile` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `amministratore`
--
ALTER TABLE `amministratore`
  ADD PRIMARY KEY (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indici per le tabelle `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Categoria`);

--
-- Indici per le tabelle `negozio`
--
ALTER TABLE `negozio`
  ADD PRIMARY KEY (`Nome`,`Ubicazione`);

--
-- Indici per le tabelle `negozipreferiti`
--
ALTER TABLE `negozipreferiti`
  ADD PRIMARY KEY (`Utente`,`Negozi`);

--
-- Indici per le tabelle `prodottipreferiti`
--
ALTER TABLE `prodottipreferiti`
  ADD PRIMARY KEY (`Prodotto`,`Utente`);

--
-- Indici per le tabelle `prodotto`
--
ALTER TABLE `prodotto`
  ADD PRIMARY KEY (`IDProdotto`),
  ADD UNIQUE KEY `Immagine` (`Immagine`);

--
-- Indici per le tabelle `recensione`
--
ALTER TABLE `recensione`
  ADD PRIMARY KEY (`IDRecensione`);

--
-- Indici per le tabelle `sconto`
--
ALTER TABLE `sconto`
  ADD PRIMARY KEY (`IDSconto`);

--
-- Indici per le tabelle `storicoprezzi`
--
ALTER TABLE `storicoprezzi`
  ADD PRIMARY KEY (`Prodotto`,`Data`);

--
-- Indici per le tabelle `utente_registrato`
--
ALTER TABLE `utente_registrato`
  ADD PRIMARY KEY (`Username`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Telefono` (`Telefono`);

--
-- Indici per le tabelle `validita_sconto_categoria`
--
ALTER TABLE `validita_sconto_categoria`
  ADD PRIMARY KEY (`sconto`,`Categoria`);

--
-- Indici per le tabelle `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD PRIMARY KEY (`Sconto`,`prodotto`);

--
-- Indici per le tabelle `volantino`
--
ALTER TABLE `volantino`
  ADD PRIMARY KEY (`VolantinoFile`);

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `negozipreferiti`
--
ALTER TABLE `negozipreferiti`
  ADD CONSTRAINT `negozio-utente` FOREIGN KEY (`Negozi`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `negoziopreferifo` FOREIGN KEY (`Negozi`) REFERENCES `negozio` (`Nome`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prodottipreferiti`
--
ALTER TABLE `prodottipreferiti`
  ADD CONSTRAINT `Utente-nomeutente` FOREIGN KEY (`Utente`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prodottopref-prodotto` FOREIGN KEY (`Prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prodotto`
--
ALTER TABLE `prodotto`
  ADD CONSTRAINT `prodotto-negozio` FOREIGN KEY (`NegozioProvenienza`) REFERENCES `negozio` (`Nome`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prodotto_categoria` FOREIGN KEY (`Categoria`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `recensione`
--
ALTER TABLE `recensione`
  ADD CONSTRAINT `recensione-negozio` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`Nome`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recensione-utente` FOREIGN KEY (`Utente`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `sconto`
--
ALTER TABLE `sconto`
  ADD CONSTRAINT `sconto-categoria` FOREIGN KEY (`CategoriaApplicabile`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sconto-negozio` FOREIGN KEY (`NegozioDoveValido`) REFERENCES `negozio` (`Nome`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `storicoprezzi`
--
ALTER TABLE `storicoprezzi`
  ADD CONSTRAINT `prezzo-prodotto` FOREIGN KEY (`Prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `validita_sconto_categoria`
--
ALTER TABLE `validita_sconto_categoria`
  ADD CONSTRAINT `validitàsconto` FOREIGN KEY (`sconto`) REFERENCES `sconto` (`IDSconto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD CONSTRAINT `Prodottovalido` FOREIGN KEY (`prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Scontovalido` FOREIGN KEY (`Sconto`) REFERENCES `sconto` (`IDSconto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `volantino`
--
ALTER TABLE `volantino`
  ADD CONSTRAINT `Volantino-Negozio` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`Nome`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
