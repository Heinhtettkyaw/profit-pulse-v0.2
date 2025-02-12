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
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Cashier Dashboard</h2>

            {/* Horizontal Navigation Bar */}
            <nav className="flex items-center space-x-4 mb-4">
                <Link
                    to="sales"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Sales Recorder
                </Link>
                <Link
                    to="change-password"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                >
                    Change Password
                </Link>
                <div className="absolute right-10 justify-between mt-4 ">
                    <button
                        onClick={handleLogout}
                        className=" bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none mb-4"
                    >
                        Logout
                    </button></div>
            </nav>

            {/* Logout Button */}


            {/* Horizontal Rule */}
            <hr className="border-gray-300 my-4"/>

            {/* Outlet for Nested Routes */}
            <Outlet/>
        </div>
    );
};

export default CashierDashboard;