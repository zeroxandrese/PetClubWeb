import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../Allapp/context/AuthContext';
import './css/Allapp.css';
import { PlayStoreRedirect } from './screens/PlayStoreRedirect';
import { Profile } from './screens/Profile';
import { Login } from './screens/Login';
import { Home } from './screens/Home';
import { Privacidad } from './screens/Privacidad';
import { Register } from './screens/Register';

import complet from './imagenes/complet.png';
import mascota from './imagenes/mascota.png';
import insta from './imagenes/insta.png';
import face from './imagenes/face.png';
import twt from './imagenes/twt.png';
import tiktok from './imagenes/tiktok.png';
import patitas from './imagenes/patitas.png';

const AllappEntry = () => {
  const LoginButton = () => {
    const navigate = useNavigate();

    const handlePress = () => {
      navigate('/login');
    };

    return (
      <button
        className="oval-button"
        onClick={handlePress}
      >
        Login
      </button>
    );
  };

  const RedirectToPrivacidad = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
      navigate('/privacidad');
    };

    return (
      <button
        className="terms-button"
        onClick={handleRedirect}
        style={{ marginTop: '10px', backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
      >
        Términos y Condiciones
      </button>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <section className='seccion1'>
              <nav>
                <Link to="/playstore"> <img src={complet} alt="" /></Link>
              </nav>
              <div>
                <img className='imagen2' src={patitas} alt="" />
              </div>
            </section>
            <section className='seccion2'>
              <div className='letras'>
                <p className='parrafo' style={{ color: '#000000', fontWeight: '500' }}>
                  Un club "petfriendly" para contactar con otros "petlovers", compartir tu amor por los animales, adoptar y descubrir lo mejor para el bienestar de tus mascotas
                </p>
                <img src={mascota} alt="" />
              </div>
            </section>
            <br />
            <div className="centered-container">
              <LoginButton />
            </div>
            <br />
            <footer>
              <p className='foot'>
                © 2024 NovaMatrix SAC. Todos los derechos reservados
              </p>
              <div className='redes'>
                <a href=""><img src={insta} alt="logo" /></a>
                <a href=""><img src={face} alt="logo" /></a>
                <a href=""><img src={twt} alt="logo" /></a>
                <a href=""><img src={tiktok} alt="logo" /></a>
              </div>
              <RedirectToPrivacidad /> {/* Botón añadido aquí */}
            </footer>
          </>
        } />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/playstore" element={<PlayStoreRedirect />} />
        <Route path="/profile/:url" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={
          <AuthProvider>
            <Login />
          </AuthProvider>
        } />
        <Route path="/home" element={
          <AuthProvider>
            <Home />
          </AuthProvider>
        } />
      </Routes>
    </Router>
  );
}

export { AllappEntry };