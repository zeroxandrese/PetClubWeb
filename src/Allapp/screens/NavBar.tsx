import React from 'react';
import { Link } from 'react-router-dom';
import titulo from '../imagenes/titulo.png'; // Ajusta la ruta según la ubicación real de la imagen
import '../css/NavBar.css'; // Archivo opcional para estilos

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <img src={titulo} alt="Título" />
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/about">Sobre Nosotros</Link></li>
        <li><Link to="/Form">Contacto</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export { NavBar };
