import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PasswordPrompt from './PasswordPrompt';

const ManageCashiers = () => {
    const [cashiers, setCashiers] = useState([]);
    const [newCashier, setNewCashier] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptMessage, setPromptMessage] = useState('');
    const [pendingAction, setPendingAction] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

    const fetchCashiers = async () => {
        try {
            const response = await API.get('/admin/cashiers');
            setCashiers(response.data);
        } catch (error) {
            console.error('Error fetching cashiers:', error);
            setMessage('Error fetching cashiers.');
        }
    };

    useEffect(() => {
        fetchCashiers();
    }, []);

    const executeAction = async (action, adminPwd) => {
        try {
            await action(adminPwd);
            setMessage('Operation successful.'); // Success message
            fetchCashiers();
        } catch (error) {
            console.error('Error executing action:', error);
            setMessage('Operation failed: ' + (error.response?.data || ''));
        }
    };

    const handleAddCashier = () => {
        if (!newCashier.username || !newCashier.password) {
            setMessage('Username and password are required.');
            return;
        }
        setPromptMessage("Enter your admin password to add cashier:");
        setPendingAction(() => async (adminPwd) => {
            await API.post('/admin/cashiers?adminPassword=' + encodeURIComponent(adminPwd), newCashier);
            setMessage('Cashier added successfully!');
            setNewCashier({ username: '', password: '' });
            setShowAddForm(false); // Hide the form after adding
        });
        setShowPrompt(true);
    };

    const handleDeleteCashier = (id) => {
        setPromptMessage("Enter your admin password to delete cashier:");
        setPendingAction(() => async (adminPwd) => {
            await API.delete(`/admin/cashiers/${id}?adminPassword=${encodeURIComponent(adminPwd)}`);
            setMessage('Cashier deleted successfully!');
        });
        setShowPrompt(true);
    };

    const handleResetPassword = (id) => {
        setPromptMessage("Enter your admin password to reset cashier password:");
        setPendingAction(() => async (adminPwd) => {
            await API.put(`/admin/cashiers/${id}/reset?adminPassword=${encodeURIComponent(adminPwd)}`);
            setMessage('Cashier password reset successfully!');
        });
        setShowPrompt(true);
    };

    const handlePromptSubmit = async (adminPwd) => {
        setShowPrompt(false);
        if (pendingAction) {
            await executeAction(pendingAction, adminPwd);
        }
    };

    const handlePromptCancel = () => {
        setShowPrompt(false);
        setMessage("Operation cancelled.");
    };

    return (
        <div className="p-4">
            <h3 className="text-2xl font-bold mb-4">Manage Cashiers</h3>
            {message && (
                <p className={`mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
            {showPrompt && (
                <PasswordPrompt
                    promptMessage={promptMessage}
                    onSubmit={handlePromptSubmit}
                    onCancel={handlePromptCancel}
                />
            )}
            <div className="mb-6">
                <button
                    onClick={() => setShowAddForm(!showAddForm)} // Toggle form visibility
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    Add New Cashier
                </button>
                {showAddForm && ( // Render form only when showAddForm is true
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2">Add New Cashier</h4>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Username"
                                value={newCashier.username}
                                onChange={(e) =>
                                    setNewCashier({ ...newCashier, username: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newCashier.password}
                                onChange={(e) =>
                                    setNewCashier({ ...newCashier, password: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddCashier}
                                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 focus:outline-none"
                            >
                                Add Cashier
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <h4 className="text-lg font-semibold mb-2">Existing Cashiers</h4>
            {cashiers.length > 0 ? (
                <table className="border-collapse border border-gray-300 w-full">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cashiers.map((cashier) => (
                        <tr key={cashier.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{cashier.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{cashier.username}</td>
                            <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                <button
                                    onClick={() => handleResetPassword(cashier.id)}
                                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none"
                                >
                                    Reset Password
                                </button>
                                <button
                                    onClick={() => handleDeleteCashier(cashier.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No cashiers found.</p>
            )}
        </div>
    );
};

export default ManageCashiers;