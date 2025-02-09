import React, { useState } from 'react';

const PasswordPrompt = ({ promptMessage, onSubmit, onCancel }) => {
    const [password, setPassword] = useState('');

    return (
        <div style={modalOverlayStyle}>
            <div style={modalStyle}>
                <p>{promptMessage}</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    autoFocus
                />
                <div>
                    <button
                        onClick={() => {
                            onSubmit(password.trim());
                            setPassword('');
                        }}
                        style={{ marginRight: '10px' }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => {
                            onCancel();
                            setPassword('');
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.26)'
};

export default PasswordPrompt;
