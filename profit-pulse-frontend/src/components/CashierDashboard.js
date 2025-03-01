import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

export const ThemeContext = createContext();

const CashierDashboard = () => {
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-bg', theme === 'light' ? '#f8f9fa' : '#1a1a1a');
        root.style.setProperty('--primary-text', theme === 'light' ? '#212529' : '#64ffda');
        root.style.setProperty('--accent-color', '#3B82F6');
        root.style.setProperty('--hover-color', theme === 'light' ? '#9ca3af' : '#1f2937');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const routes = [
        { name: "Sales Recorder", to: "sales" },
        { name: "Change Password", to: "change-password" }
    ];

    return (
        <ThemeContext.Provider value={{ theme }}>
            <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--primary-text)] flex overflow-hidden">
                {/* Sidebar */}
                <nav className="w-64 px-4 py-6 bg-[var(--primary-bg)] shadow-lg fixed top-0 left-0 h-screen lg:block transition-all">
                    <div className="flex items-center justify-center mb-6">
                        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
                            Cashier <span className="text-[var(--accent-color)]">Dashboard</span>
                        </h1>
                    </div>
                    <div className="space-y-2">
                        {routes.map((route) => (
                            <Link
                                key={route.to}
                                to={route.to}
                                className={`block px-4 py-3 rounded-lg transition duration-100 
                                ${pathname.includes(route.to) ?
                                    'bg-[var(--accent-color)] text-white font-semibold' :
                                    'hover:bg-[var(--accent-color)/30%] text-[var(--primary-text)]'}
                                `}>
                                {route.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Main Content */}
                <div className="ml-64 pt-16 px-6 lg:ml-64 md:ml-0 md:pt-8 md:px-4 grow min-w-0">
                    <header className="flex items-center justify-between mb-6 border-b border-[var(--hover-color)] pb-4">
                        <h2 className="text-2xl font-bold"></h2>
                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full
                                bg-[var(--primary-bg)]
                                hover:bg-[var(--accent-color)/20%]
                                transition"
                            >
                                {theme === 'light' ? (
                                    <SunIcon className="h-6 w-6 text-[var(--primary-text)]" />
                                ) : (
                                    <MoonIcon className="h-6 w-6 text-[var(--primary-text)]" />
                                )}
                            </button>
                            {/* Logout Button */}
                            <button
                                onClick={() => logoutUser(navigate)}
                                className="bg-red-600
                                text-white px-6 py-3 rounded-full
                                shadow-lg transition duration-300
                                hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <div className="max-w-full mx-0 min-h-[calc(100vh-16rem)] pb-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

export default CashierDashboard;