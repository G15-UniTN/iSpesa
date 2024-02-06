-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 23, 2024 alle 18:29
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
  `Nome` varchar(255) NOT NULL,
  `Logo` varchar(255) NOT NULL,
  `IDNegozio` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `negozio`
--

INSERT INTO `negozio` (`Ubicazione`, `Orari`, `Nome`, `Logo`, `IDNegozio`) VALUES
('Trento_sud', '10:00-19:00', 'EuroSpin', 'https://i.imgur.com/mvHZchQ.png', 1),
('Trento', '9:00-21:00', 'Iperpoli', 'https://i.imgur.com/fp7QQu0.png', 2),
('Thiene', '8:00-20:00', 'Ipertosano', 'https://i.imgur.com/AMoVlC1.jpeg', 3),
('Trento', '8:00-20:00', 'Lidl', 'https://i.imgur.com/29wD3sC.jpeg', 4);

-- --------------------------------------------------------

--
-- Struttura della tabella `negozipreferiti`
--

CREATE TABLE `negozipreferiti` (
  `Utente` varchar(255) NOT NULL,
  `Negozio` int(255) NOT NULL
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
  `NegozioProvenienza` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prodotto`
--

INSERT INTO `prodotto` (`Nome`, `Immagine`, `Categoria`, `IDProdotto`, `NegozioProvenienza`) VALUES
('Caramelle_Ricola', 'https://i.imgur.com/zeeAypL.jpeg', 'Prodotti_alimentari', 2, 3),
('Caramelle_Ricola', 'https://i.imgur.com/zeeAypL.jpeg', 'Prodotti_alimentari', 4, 2),
('Quadre_miste_alle_erbe', 'https://i.imgur.com/UNHjQEn.jpeg', 'Gastronomia', 5, 4),
('Caramelle_Sperlati', 'https://i.imgur.com/Ryq1DAE.jpeg', 'Prodotti_alimentari', 6, 1),
('Caramelle_Sperlati', 'https://i.imgur.com/Ryq1DAE.jpeg', 'Prodotti_alimentari', 7, 4),
('Caramelle_Ricola', 'https://i.imgur.com/zeeAypL.jpeg', 'Prodotti_alimentari', 8, 4),
('Parmiggiano_reggiano', 'https://i.imgur.com/7IHL4n3.jpeg', 'Formaggi', 9, 2),
('Caciotta', 'https://i.imgur.com/bULRAwL.jpeg', 'Formaggi', 10, 1),
('Mozzarella', 'https://i.imgur.com/YJlVVw0.jpeg', 'Formaggi', 11, 4),
('Carne_Salada', 'https://i.imgur.com/dKWk6cz.jpeg', 'Salumi', 12, 2),
('Carne_Salada', 'https://i.imgur.com/dKWk6cz.jpeg', 'Salumi', 13, 4),
('Fette_di_tacchino', 'https://i.imgur.com/YYt2wWc.jpeg', 'Salumi', 14, 3),
('Salame_piccante', 'https://i.imgur.com/ehIU0rL.jpeg', 'Salumi', 15, 1),
('Orata', 'https://i.imgur.com/ZLHbPNf.jpeg', 'Pesce', 16, 4),
('Filetto_di_merluzzo', 'https://i.imgur.com/lHXsk4j.jpeg', 'Pesce', 17, 1),
('Filetto_di_salmone', 'https://i.imgur.com/DHp03WH.jpeg', 'Pesce', 18, 3),
('Melanzane', 'https://i.imgur.com/JcAj2pX.jpeg', 'Verdura', 20, 1),
('Carote', 'https://i.imgur.com/3Z4DYPe.jpeg', 'Verdura', 21, 2),
('Verza', 'https://i.imgur.com/nwRCFhf.jpeg', 'Verdura', 22, 2),
('Mele', 'https://i.imgur.com/AtKIPwb.jpeg', 'Frutta', 23, 2),
('Pere', 'https://i.imgur.com/BypEVzq.jpeg', 'Frutta', 24, 4),
('Cocomero', 'https://i.imgur.com/Nh4WOLI.jpeg', 'Frutta', 25, 3),
('Fragole', 'https://i.imgur.com/L58dviw.jpeg', 'Frutta', 26, 3),
('Latte_fresco', 'https://i.imgur.com/0KvwDcs.jpeg', 'Latte,Uova_e_Derivati', 27, 4),
('Latte_fresco', 'https://i.imgur.com/0KvwDcs.jpeg', 'Latte,Uova_e_Derivati', 28, 3),
('Uova', 'https://i.imgur.com/xCCUzB1.jpeg', 'Latte,Uova_e_Derivati', 29, 4),
('Baguette', 'https://i.imgur.com/NTgAQ4t.jpeg', 'Pane_e_Pasticceria', 30, 3),
('Panbauletto', 'https://i.imgur.com/xiUtrth.jpeg', 'Pane_e_Pasticceria', 31, 1),
('Penne_barilla', 'https://i.imgur.com/GbOv2Rk.jpeg', 'Pasta', 33, 4),
('Spaghetti_barilla', 'https://i.imgur.com/Jj11xYz.jpeg', 'Pasta', 34, 3),
('Rigatoni_barilla', 'https://i.imgur.com/5LyZddV.jpeg', 'Pasta', 35, 2),
('Vino_rosso', 'https://i.imgur.com/3SQkFf4.jpeg', 'Bevande_alcoliche', 36, 1),
('Vino_bianco', 'https://i.imgur.com/krLluX0.jpeg', 'Bevande_alcoliche', 37, 1),
('Martini_bianco', 'https://i.imgur.com/e1Z8mmF.jpeg', 'Bevande_alcoliche', 38, 1),
('Estathe', 'https://i.imgur.com/QjD2xDY.jpeg', 'Bevande_analcoliche', 39, 4),
('Coca-Cola', 'https://i.imgur.com/kXrtszq.jpeg', 'Bevande_analcoliche', 40, 3),
('Arancina', 'https://i.imgur.com/bYTlTlx.jpeg', 'Gastronomia', 42, 4),
('Torta_salata', 'https://i.imgur.com/sLd1Tpy.jpeg', 'Gastronomia', 43, 2),
('Castoro pupazzolo', 'https://i.imgur.com/tACEOn0.jpeg', 'Casa', 44, 1),
('Pianta_di_salvia', 'https://i.imgur.com/UiHLbCO.jpeg', 'Casa', 45, 1),
('Albero_di_natale', 'https://i.imgur.com/Bp3EEjj.jpeg', 'Casa', 46, 4),
('Agata_rossa', 'https://i.imgur.com/YqCxQiz.jpeg', 'Cura_della_persona', 47, 1),
('Ambra', 'https://i.imgur.com/HHRszjm.jpeg', 'Cura_della_persona', 48, 2),
('Burro_cacao_Lobello', 'https://i.imgur.com/9F72gRh.jpeg', 'Cura_della_persona', 49, 4),
('Cereali_Lion', 'https://i.imgur.com/LZ0uLjK.jpeg', 'Colazione', 50, 1),
('Muffin', 'https://i.imgur.com/3mC13HW.jpeg', 'Colazione', 51, 2);

-- --------------------------------------------------------

--
-- Struttura della tabella `recensione`
--

CREATE TABLE `recensione` (
  `Titolo` varchar(255) NOT NULL,
  `Testo` varchar(255) NOT NULL,
  `N_stelle` int(5) NOT NULL,
  `Data_creazione` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Utente` varchar(255) NOT NULL,
  `IDRecensione` int(255) NOT NULL,
  `Negozio` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `sconto`
--

CREATE TABLE sconto (
  `Valore` int(11) NOT NULL,
  `IDSconto` int(255) NOT NULL,
  `Negozio` int(255) NOT NULL,
  `DataInizio` date NOT NULL,
  `DataFine` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Dump dei dati per la tabella `sconto`
--

INSERT INTO `sconto` (`Valore`, `IDSconto`, `Negozio`, `DataInizio`, `DataFine`) VALUES
(10, 1, 2, '2023-12-01', '2024-12-01'),
(20, 2, 4, '2023-12-01', '2024-12-01'),
(30, 3, 3, '2023-12-01', '2024-12-01'),
(25, 4, 1, '2023-12-01', '2024-12-01');

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_categoria`
--

CREATE TABLE validita_sconto_categoria (
	`CategoriaApplicabile` varchar(255) NOT NULL,
    `IDSconto` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `validita_sconto_categoria` (`CategoriaApplicabile`, `IDSconto`) VALUES
('Frutta', 1),
('Pasta', 2),
('Colazione', 2),
('Prodotti_alimentari', 3),
('Casa', 4);

--
-- Struttura della tabella `storicoprezzi`
--

CREATE TABLE `storicoprezzi` (
  `Prodotto` int(255) NOT NULL,
  `Prezzo` int(255) NOT NULL,
  `Data` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `storicoprezzi`
--

INSERT INTO `storicoprezzi` (`Prodotto`, `Prezzo`, `Data`) VALUES
(2, 1, '2023-12-21'),
(4, 1, '2023-12-21'),
(5, 1, '2023-12-21'),
(6, 1, '2023-12-21'),
(7, 4, '2023-12-21'),
(8, 2, '2023-12-21'),
(9, 2, '2023-12-21'),
(10, 2, '2023-12-21'),
(11, 5, '2023-12-21'),
(12, 4, '2023-12-21'),
(13, 4, '2023-12-21'),
(14, 3, '2023-12-21'),
(15, 2, '2023-12-21'),
(16, 6, '2023-12-21'),
(17, 6, '2023-12-21'),
(18, 6, '2023-12-21'),
(20, 5, '2023-12-21'),
(21, 5, '2023-12-21'),
(22, 3, '2023-12-21'),
(23, 3, '2023-12-21'),
(24, 4, '2023-12-21'),
(25, 4, '2023-12-21'),
(26, 3, '2023-12-21'),
(27, 3, '2023-12-21'),
(28, 3, '2023-12-21'),
(29, 3, '2023-12-21'),
(30, 2, '2023-12-21'),
(31, 2, '2023-12-21'),
(33, 2, '2023-12-21'),
(34, 5, '2023-12-21'),
(35, 1, '2023-12-21'),
(36, 1, '2023-12-21'),
(37, 2, '2023-12-21'),
(38, 5, '2023-12-21'),
(39, 4, '2023-12-21'),
(40, 4, '2023-12-21'),
(42, 2, '2023-12-21'),
(43, 6, '2023-12-21'),
(44, 6, '2023-12-21'),
(45, 6, '2023-12-21'),
(46, 5, '2023-12-21'),
(47, 5, '2023-12-21'),
(48, 5, '2023-12-21'),
(49, 3, '2023-12-21'),
(50, 3, '2023-12-21'),
(51, 4, '2023-12-21');

-- --------------------------------------------------------

--
-- Struttura della tabella `utente_registrato`
--

CREATE TABLE `utente_registrato` (
  `Username` varchar(255) NOT NULL,
  `FotoProfilo` varchar(255) NOT NULL,
  `2AF_attiva` tinyint(1) DEFAULT 0,
  `Email` varchar(255) NOT NULL,
  `Bloccato` tinyint(1) DEFAULT 0,
  `Telefono` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `isAdmin` boolean NOT NULL default 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `utente_registrato` (`Username`, `FotoProfilo`, `Email`, `Telefono`, `Password`, `isAdmin`) VALUES ('root', '/img/sito/pfp.jpg', 'admin@iSpesa.it', '000000000', '', '1');
INSERT INTO `utente_registrato` (`Username`, `FotoProfilo`, `Email`, `Telefono`, `Password`, `isAdmin`) VALUES ('testuser', '/img/sito/pfp.jpg', 'test@iSpesa.it', '000000001', '', '0');

-- --------------------------------------------------------

--
-- Struttura della tabella `validita_sconto_prodotto`
--

CREATE TABLE `validita_sconto_prodotto` (
  `Sconto` int(255) NOT NULL,
  `prodotto` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `validita_sconto_prodotto`
--

INSERT INTO `validita_sconto_prodotto` (`Sconto`, `prodotto`) VALUES
(1, 51),
(2, 42),
(3, 14),
(4, 10);

--
-- Struttura della tabella `volantino`
--

CREATE TABLE `volantino` (
  `Negozio` int(255) NOT NULL,
  `DataFine` date NOT NULL,
  `VolantinoFile` varchar(255) NOT NULL,
  `IDVolantino` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `volantino`
--

INSERT INTO `volantino` (`Negozio`, `DataFine`, `VolantinoFile`, `IDVolantino`) VALUES
(4, '2024-04-17', 'https://object.storage.eu01.onstackit.cloud/leaflets/pdfs/0d65a3c0-98f6-11ee-9ca4-fa163f3c89c9/LIDL-ATTUALE-S51-21-12-27-12-06.pdf', 1),
(1, '2024-03-15', 'https://www.eurospin.it/Iniziativa/P23_2023/pdf/Italia.pdf', 2),
(2, '2024-03-10', 'https://www.gruppopoli.it/documenti/bilancio-sociale/volume-1_identita_bassa.pdf', 3),
(3, '2024-04-09', 'https://www.supertosano.com/docs/pdf/catalogo_cesti.pdf', 4);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Categoria`);

--
-- Indici per le tabelle `negozio`
--
ALTER TABLE `negozio`
  ADD PRIMARY KEY (`IDNegozio`);

--
-- Indici per le tabelle `negozipreferiti`
--
ALTER TABLE `negozipreferiti`
  ADD PRIMARY KEY (`Utente`,`Negozio`),
  ADD KEY `negoziopref` (`Negozio`);

--
-- Indici per le tabelle `prodottipreferiti`
--
ALTER TABLE `prodottipreferiti`
  ADD PRIMARY KEY (`Prodotto`,`Utente`),
  ADD KEY `Utente-nomeutente` (`Utente`);

--
-- Indici per le tabelle `prodotto`
--
ALTER TABLE `prodotto`
  ADD PRIMARY KEY (`IDProdotto`),
  ADD KEY `categoria_del_prodotto` (`Categoria`),
  ADD KEY `prodotto_negozio` (`NegozioProvenienza`);

--
-- Indici per le tabelle `recensione`
--
ALTER TABLE `recensione`
  ADD PRIMARY KEY (`IDRecensione`),
  ADD KEY `recensione-utente` (`Negozio`),
  ADD KEY `rec-utente` (`Utente`);
  
--
-- Indici per le tabelle `sconto`
--
ALTER TABLE `sconto`
  ADD PRIMARY KEY (`IDSconto`),
  ADD KEY `sconto-neg` (`Negozio`);

--
-- Indici per le tabelle `validita_sconto_categoria`
--
ALTER TABLE `validita_sconto_categoria`
  ADD PRIMARY KEY (`CategoriaApplicabile`, `IDSconto`);

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
-- Indici per le tabelle `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD PRIMARY KEY (`Sconto`,`prodotto`),
  ADD KEY `prod-scont` (`prodotto`);

--
-- Indici per le tabelle `volantino`
--
ALTER TABLE `volantino`
  ADD PRIMARY KEY (`IDVolantino`),
  ADD KEY `vol-neg` (`Negozio`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `negozio`
--
ALTER TABLE `negozio`
  MODIFY `IDNegozio` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `prodotto`
--
ALTER TABLE `prodotto`
  MODIFY `IDProdotto` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT per la tabella `recensione`
--
ALTER TABLE `recensione`
  MODIFY `IDRecensione` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `sconto`
--
ALTER TABLE `sconto`
  MODIFY `IDSconto` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `volantino`
--
ALTER TABLE `volantino`
  MODIFY `IDVolantino` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `negozipreferiti`
--
ALTER TABLE `negozipreferiti`
  ADD CONSTRAINT `negoziopref` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`IDNegozio`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utente` FOREIGN KEY (`Utente`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prodottipreferiti`
--
ALTER TABLE `prodottipreferiti`
  ADD CONSTRAINT `Utente-nomeutente` FOREIGN KEY (`Utente`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `utente-prod` FOREIGN KEY (`Prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prodotto`
--
ALTER TABLE `prodotto`
  ADD CONSTRAINT `categoria_del_prodotto` FOREIGN KEY (`Categoria`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `prodotto_negozio` FOREIGN KEY (`NegozioProvenienza`) REFERENCES `negozio` (`IDNegozio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `recensione`
--
ALTER TABLE `recensione`
  ADD CONSTRAINT `rec-utente` FOREIGN KEY (`Utente`) REFERENCES `utente_registrato` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recensione-negozio` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`IDNegozio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `sconto`
--
ALTER TABLE `sconto`
  ADD CONSTRAINT `sconto-neg` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`IDNegozio`) ON DELETE CASCADE ON UPDATE CASCADE;
  
  --
  -- Limiti per la tabella 'validita_sconto_categoria'
  --
  
ALTER TABLE `validita_sconto_categoria`
  ADD CONSTRAINT `sconto-cat` FOREIGN KEY (`CategoriaApplicabile`) REFERENCES `categoria` (`Categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sconto-id` FOREIGN KEY (`IDSconto`) REFERENCES `sconto` (`IDSconto`) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Limiti per la tabella `storicoprezzi`
--
ALTER TABLE `storicoprezzi`
  ADD CONSTRAINT `prodotto-prezzo` FOREIGN KEY (`Prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Limiti per la tabella `validita_sconto_prodotto`
--
ALTER TABLE `validita_sconto_prodotto`
  ADD CONSTRAINT `prod-scont` FOREIGN KEY (`prodotto`) REFERENCES `prodotto` (`IDProdotto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sconto-prod` FOREIGN KEY (`Sconto`) REFERENCES `sconto` (`IDSconto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `volantino`
--
ALTER TABLE `volantino`
  ADD CONSTRAINT `vol-neg` FOREIGN KEY (`Negozio`) REFERENCES `negozio` (`IDNegozio`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
