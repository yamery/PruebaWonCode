-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-03-2021 a las 02:56:21
-- Versión del servidor: 10.4.13-MariaDB
-- Versión de PHP: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `membresias`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresias`
--

CREATE TABLE `membresias` (
  `ID_membresia` int(11) NOT NULL,
  `Name_membresia` varchar(45) NOT NULL,
  `Desc_membresia` varchar(100) NOT NULL,
  `Tit_imagen` varchar(255) NOT NULL,
  `duracion` int(11) NOT NULL,
  `precio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `membresias`
--

INSERT INTO `membresias` (`ID_membresia`, `Name_membresia`, `Desc_membresia`, `Tit_imagen`, `duracion`, `precio`) VALUES
(36, 'premium', 'sdedferedds', '9f7bd9848dfcf896c39542fad8a2a6bd.jpeg', 1, 7000),
(37, 'medio', 'sasadasd', '9b772b7afff3260d157365b3b30921d7.jpeg', 2, 200000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID_usuario` int(11) NOT NULL,
  `Cedula` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Apellidos` varchar(100) NOT NULL,
  `Telefono` varchar(45) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID_usuario`, `Cedula`, `Nombre`, `Apellidos`, `Telefono`, `Correo`, `password`) VALUES
(42, '123456', 'ferney', 'fozma', '3156896932', 'fozma', '12345'),
(50, '98760984', 'Empresa', 'admin', '123456', 'empresa@', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_has_membresias`
--

CREATE TABLE `usuarios_has_membresias` (
  `Usuarios_ID_usuario` int(11) NOT NULL,
  `Membresias_ID_membresia` int(11) NOT NULL,
  `Fecha_compra` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios_has_membresias`
--

INSERT INTO `usuarios_has_membresias` (`Usuarios_ID_usuario`, `Membresias_ID_membresia`, `Fecha_compra`) VALUES
(42, 37, '2021-03-07 16:27:52');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `membresias`
--
ALTER TABLE `membresias`
  ADD PRIMARY KEY (`ID_membresia`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_usuario`),
  ADD UNIQUE KEY `Cedula` (`Cedula`) USING BTREE,
  ADD UNIQUE KEY `Correo` (`Correo`);

--
-- Indices de la tabla `usuarios_has_membresias`
--
ALTER TABLE `usuarios_has_membresias`
  ADD PRIMARY KEY (`Usuarios_ID_usuario`,`Membresias_ID_membresia`),
  ADD KEY `fk_Usuarios_has_Membresias_Membresias1_idx` (`Membresias_ID_membresia`),
  ADD KEY `fk_Usuarios_has_Membresias_Usuarios_idx` (`Usuarios_ID_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `membresias`
--
ALTER TABLE `membresias`
  MODIFY `ID_membresia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios_has_membresias`
--
ALTER TABLE `usuarios_has_membresias`
  ADD CONSTRAINT `fk_Usuarios_has_Membresias_Membresias1` FOREIGN KEY (`Membresias_ID_membresia`) REFERENCES `membresias` (`ID_membresia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Usuarios_has_Membresias_Usuarios` FOREIGN KEY (`Usuarios_ID_usuario`) REFERENCES `usuarios` (`ID_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
