// src/components/CashierDashboard.js
import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CashierDashboard = () => {
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Cashier Dashboard</h2>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><Link to="sales">Sales Recorder</Link></li>
                    <li><Link to="change-password">Change Password</Link></li>
                </ul>
            </nav>
            <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>
            <hr />
            <Outlet />
        </div>
    );
};

export default CashierDashboard;
