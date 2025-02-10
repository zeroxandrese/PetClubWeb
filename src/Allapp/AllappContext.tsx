import React, { useEffect, useRef, useState } from 'react';
import * as motion from "motion/react-client"
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';


import { AuthProvider } from '../Allapp/context/AuthContext';
import './css/Allapp.css';
import { PlayStoreRedirect } from './screens/PlayStoreRedirect';
import { Profile } from './screens/Profile';
import { Login } from './screens/Login';
import { Home } from './screens/Home';
import { Privacidad } from './screens/Privacidad';
import { Form } from './screens/Form';


import complet from './imagenes/complet.png';
import mascota from './imagenes/mascota.png';
import insta from './imagenes/insta.png';
import face from './imagenes/face.png';
import twt from './imagenes/twt.png';
import tiktok from './imagenes/tiktok.png';
import patitas from './imagenes/patitas.png';

const AllappEntry = () => {

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [location]);

  const LoginButton = () => {
    const navigate = useNavigate();

    const handlePress = () => {
      navigate('/login');
    };

    return (
      <button className="oval-button" onClick={handlePress}>
        Login
      </button>
    );
  };

  const FormButton = () => {
    const navigate = useNavigate();

    const handlePress = () => {
      navigate('/form');
    };

    return (
      <button className="oval-button" onClick={handlePress} style={{ justifyContent: 'center' }}>
        Ir al Formulario
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
        style={{
          marginTop: '10px',
          backgroundColor: '#f0f0f0',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Términos y Condiciones
      </button>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <section className="seccion1">
                <nav>
                  <Link to="/playstore">
                    <img src={complet} alt="" />
                  </Link>
                </nav>
                <div>
                  <img className="imagen2" src={patitas} alt="" />
                </div>
              </section>
              <section className="seccion2">
                <div className="letras">
                  <p className="parrafo" style={{ color: '#000000', fontWeight: '500' }}>
                    Un club "petfriendly" para contactar con otros "petlovers", compartir tu amor por los
                    animales, adoptar y descubrir lo mejor para el bienestar de tus mascotas
                  </p>
                  <img src={mascota} alt="" />
                </div>
              </section>
              <motion.div
                whileHover={{
                  scale: 1.15,
                  transition: { duration: 0.2 }
                }}
              >
                <section className="seccion3">
                  <div
                    className={`business-section ${isVisible ? "show" : ""}`}
                    ref={sectionRef}
                  >
                    <h2>Registra tu negocio en PetClub y únete a nuestra comunidad de 'petlovers'.</h2>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <p>
                        Conectamos tu negocio con más amantes de las mascotas.
                      </p>
                      <FormButton />
                    </div>
                  </div>
                </section>
              </motion.div>
              <br />
              <br />
              <LoginButton />
              <footer>
                <p className="foot">© 2024 NovaMatrix SAC. Todos los derechos reservados</p>
                <div className="redes">
                  <a href="">
                    <img src={insta} alt="logo" />
                  </a>
                  <a href="">
                    <img src={face} alt="logo" />
                  </a>
                  <a href="">
                    <img src={twt} alt="logo" />
                  </a>
                  <a href="">
                    <img src={tiktok} alt="logo" />
                  </a>
                </div>
                <RedirectToPrivacidad />
              </footer>
            </>
          }
        />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/playstore" element={<PlayStoreRedirect />} />
        <Route path="/profile/:url" element={<Profile />} />
        <Route
          path="/login"
          element={
            <AuthProvider>
              <Login />
            </AuthProvider>
          }
        />
        <Route
          path="/home"
          element={
            <AuthProvider>
              <Home />
            </AuthProvider>
          }
        />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
};

export { AllappEntry };
