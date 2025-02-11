// src/components/AdminDashboard.js
import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <nav>
                <ul style={{listStyle: 'none', padding: 0}}>
                    <li><Link to="inventory">Manage Inventory</Link></li>
                    <li><Link to="profit-loss">Profit &amp; Loss Reports</Link></li>
                    <li><Link to="sales-transactions">Sales Transactions</Link></li>
                    <li><Link to="supplier-transactions">Supplier Transactions</Link></li>
                    <li><Link to="combined-profit-loss">Profit Loss Details</Link></li>
                    <li><Link to="manage-cashiers">Manage Cashiers</Link></li>
                    <li><Link to="change-password">Change Password</Link></li>
                </ul>
            </nav>
            <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>
            <hr />
            <Outlet />
        </div>
    );
};

export default AdminDashboard;
