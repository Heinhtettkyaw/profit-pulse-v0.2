// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(credentials);
            loginUser(data.token, data.role);
            if (data.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/cashier', { replace: true });
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '100px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    required
                />
                <button type="submit" style={{ width: '100%', padding: '8px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
