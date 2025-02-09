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
            setMessage('Operation successful.');
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
        <div>
            <h3>Manage Cashiers</h3>
            {message && <p>{message}</p>}
            {showPrompt && (
                <PasswordPrompt
                    promptMessage={promptMessage}
                    onSubmit={handlePromptSubmit}
                    onCancel={handlePromptCancel}
                />
            )}
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
