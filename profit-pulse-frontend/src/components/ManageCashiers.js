// src/components/ManageCashiers.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ManageCashiers = () => {
    const [cashiers, setCashiers] = useState([]);
    const [newCashier, setNewCashier] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    // For demo purposes only: hardcoded admin password.
    // Replace with secure backend validation in production.
    const ADMIN_PASSWORD = "admin123";

    const fetchCashiers = async () => {
        try {
            const response = await API.get('/admin/cashiers');
            setCashiers(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching cashiers:', error);
            setMessage('Error fetching cashiers.');
        }
    };

    useEffect(() => {
        fetchCashiers();
    }, []);

    const handleAddCashier = async () => {
        if (!newCashier.username || !newCashier.password) {
            setMessage('Username and password are required.');
            return;
        }
        const adminPwd = window.prompt("Enter your admin password to confirm adding a cashier:");
        if (adminPwd !== ADMIN_PASSWORD) {
            setMessage('Password incorrect. Cashier not added.');
            return;
        }
        try {
            const response = await API.post('/admin/cashiers', newCashier);
            setMessage('Cashier added successfully!');
            setNewCashier({ username: '', password: '' });
            fetchCashiers();
        } catch (error) {
            console.error('Error adding cashier:', error);
            setMessage('Error adding cashier.');
        }
    };

    const handleDeleteCashier = async (id) => {
        const adminPwd = window.prompt("Enter your admin password to confirm deleting the cashier:");
        if (adminPwd !== ADMIN_PASSWORD) {
            setMessage('Password incorrect. Deletion cancelled.');
            return;
        }
        try {
            await API.delete(`/admin/cashiers/${id}`);
            setMessage('Cashier deleted successfully!');
            fetchCashiers();
        } catch (error) {
            console.error('Error deleting cashier:', error);
            setMessage('Error deleting cashier.');
        }
    };

    const handleResetPassword = async (id) => {
        const adminPwd = window.prompt("Enter your admin password to confirm resetting the cashier's password to default:");
        if (adminPwd !== ADMIN_PASSWORD) {
            setMessage('Password incorrect. Reset cancelled.');
            return;
        }
        try {
            await API.put(`/admin/cashiers/${id}/reset`);
            setMessage('Cashier password reset successfully!');
            fetchCashiers();
        } catch (error) {
            console.error('Error resetting cashier password:', error);
            setMessage('Error resetting cashier password.');
        }
    };

    return (
        <div>
            <h3>Manage Cashiers</h3>
            {message && <p>{message}</p>}
            <div style={{ marginBottom: '20px' }}>
                <h4>Add New Cashier</h4>
                <input
                    type="text"
                    placeholder="Username"
                    value={newCashier.username}
                    onChange={(e) => setNewCashier({ ...newCashier, username: e.target.value })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newCashier.password}
                    onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleAddCashier} style={{ padding: '5px 10px' }}>
                    Add Cashier
                </button>
            </div>
            <h4>Existing Cashiers</h4>
            {cashiers.length > 0 ? (
                <table border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cashiers.map((cashier) => (
                        <tr key={cashier.id}>
                            <td>{cashier.id}</td>
                            <td>{cashier.username}</td>
                            <td>
                                <button onClick={() => handleResetPassword(cashier.id)} style={{ marginRight: '5px' }}>
                                    Reset Password
                                </button>
                                <button onClick={() => handleDeleteCashier(cashier.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No cashiers found.</p>
            )}
        </div>
    );
};

export default ManageCashiers;
