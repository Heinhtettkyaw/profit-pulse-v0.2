import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isloading, setIsloading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsloading(true);
        try {
            const data = await login(credentials);
            loginUser(data.token, data.role);
            navigate(data.role === 'ADMIN' ? '/admin' : '/cashier', { replace: true });
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            setIsloading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Welcome to <span className="text-blue-600">Profit Pulse</span>
                </h1>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                        <p className="font-medium">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <div className="relative flex items-center border border-gray-200 rounded-lg focus-within:border-blue-600 focus-within:ring focus-within:ring-blue-200">


                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="w-full py-3 px-4 text-base text-gray-900 placeholder-gray-400 border-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative flex items-center border border-gray-200 rounded-lg focus-within:border-blue-600 focus-within:ring focus-within:ring-blue-200">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full py-3 px-4 text-base text-gray-900 placeholder-gray-400 border-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className={`w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-800 transition duration-200 ${
                            isloading && 'cursor-not-allowed opacity-75'
                        }`}
                        disabled={isloading}
                    >
                        {isloading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5v7a2 2 0 002 2h16a2 2 0 002-2v-7"
                                    ></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;