// src/components/ChangePassword.js
import React, { useState } from 'react';
import API from '../services/api';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('New password and confirm password do not match.');
            return;
        }
        try {
            const response = await API.put('/cashier/profile/update-password', { oldPassword, newPassword });
            setMessage(response.data || 'Password updated successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage(error.response?.data || 'Error updating password.');
        }
    };

    return (
        <div>
            <h3>Change Your Password</h3>
            {message && <p>{message}</p>}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px', width: '250px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px', width: '250px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px', width: '250px' }}
                />
            </div>
            <button onClick={handleChangePassword} style={{ padding: '5px 10px' }}>
                Update Password
            </button>
        </div>
    );
};

export default ChangePassword;
