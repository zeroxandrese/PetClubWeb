import React, { useState, useContext, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
};

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { signIn } = useContext(AuthContext);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (name && password) {
            try {
                const respApiIn = await signIn({ name, password });

                if (respApiIn === 'validado') {
                    navigate('/home');
                } else {
                    setError('Nombre o contraseña incorrectos');
                }
            } catch (err) {
                setError('Hubo un error en la autenticación');
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            setError('Por favor ingrese nombre y contraseña');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingrese su nombre"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingrese su contraseña"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button disabled={loading} type="submit" className="login-button">
                    Login
                </button>
                <ClipLoader
                    color={'#000000'}
                    loading={loading}
                    cssOverride={override}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </form>
        </div>
    );
}

export { Login };