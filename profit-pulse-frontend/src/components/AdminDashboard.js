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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <nav className="flex items-center space-x-2 bg-gray-100 p-2 rounded mb-4">
                <Link
                    to="inventory"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Manage Inventory
                </Link>
                <Link
                    to="profit-loss"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Profit & Loss Reports
                </Link>
                <Link
                    to="sales-transactions"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Sales Transactions
                </Link>
                <Link
                    to="supplier-transactions"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Supplier Transactions
                </Link>
                <Link
                    to="combined-profit-loss"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Profit Loss Details
                </Link>
                <Link
                    to="manage-cashiers"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Manage Cashiers
                </Link>
                <Link
                    to="change-password"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Change Password
                </Link>
                <Link
                    to="forecast"
                    className="px-4 py-2 bg-white rounded hover:bg-gray-200 text-blue-500 hover:text-blue-700 transition duration-300"
                >
                    Forecast
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2  rounded hover:bg-red-600 focus:outline-none "
                >
                    Logout
                </button>
            </nav>

            <hr className="my-4"/>
            <Outlet/>
        </div>
    );
};

export default AdminDashboard;