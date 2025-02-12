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
        <div className="p-4 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Change Your Password</h3>
            {message && (
                <p
                    className={`mb-4 ${
                        message.includes('successfully') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleChangePassword}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none w-full"
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;