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
                confirmPassword,
            });
            setMessage(response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage(error.response?.data || 'Error changing password.');
        }
    };

    return (
        <div className="p-6 max-w-md  bg-[var(--primary-bg)] rounded-lg shadow-md">
            {/* Header */}
            <h3 className="text-xl font-bold mb-4">Change Admin Password</h3>

            {/* Message Display */}
            {message && (
                <p
                    className={`text-sm font-medium mb-4 ${
                        message.includes('successful') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Old Password Field */}
                <div>
                    <label className="block text-sm font-medium text-[var(--j-color)] mb-1">Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* New Password Field */}
                <div>
                    <label className="block text-sm font-medium  text-[var(--j-color)] mb-1">New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium  text-[var(--j-color)] mb-1">Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default AdminChangePassword;