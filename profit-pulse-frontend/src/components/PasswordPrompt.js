import React, { useState } from 'react';

const PasswordPrompt = ({ promptMessage, onSubmit, onCancel }) => {
    const [password, setPassword] = useState('');

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <p className="text-gray-700 text-sm font-medium mb-4">{promptMessage}</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4"
                    autoFocus
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            onSubmit(password.trim());
                            setPassword('');
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => {
                            onCancel();
                            setPassword('');
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordPrompt;