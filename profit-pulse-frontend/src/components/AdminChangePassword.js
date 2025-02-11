import React, { useState } from 'react';
import API from '../services/api';

const AdminChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password do not match.");
            return;
        }
        try {
            const response = await API.put('/admin/profile/change-password', {
                oldPassword,
                newPassword,
                confirmPassword
            });
            setMessage(response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage(error.response?.data || "Error changing password.");
        }
    };

    return (
        <div style={{ maxWidth: '250px',marginBottom: '10px' }}>
            <h3>Change Admin Password</h3>
            {message && <p>{message}</p>}
            <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px' }}>
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default AdminChangePassword;
