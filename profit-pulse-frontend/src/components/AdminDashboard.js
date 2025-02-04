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
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '5px' }}>
                        <Link to="inventory">Inventory Manager</Link>
                    </li>
                    <li style={{ marginBottom: '5px' }}>
                        <Link to="profit-loss">Profit & Loss Report</Link>
                    </li>
                    {/*<li style={{ marginBottom: '5px' }}>*/}
                    {/*    <Link to="report">Search Reports</Link>*/}
                    {/*</li>*/}
                    <li style={{ marginBottom: '5px' }}>
                        <Link to="sales-transactions">Sales Transactions</Link>
                    </li>
                    <li style={{ marginBottom: '5px' }}>
                        <Link to="supplier-transactions">Supplier Transactions</Link>
                    </li>
                </ul>
            </nav>
            <button onClick={handleLogout} style={{ marginTop: '10px' }}>
                Logout
            </button>
            <hr />
            <Outlet />
        </div>
    );
};

export default AdminDashboard;
