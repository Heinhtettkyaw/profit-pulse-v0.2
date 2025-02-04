// src/components/SupplierTransactionList.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SupplierTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [supplierQuery, setSupplierQuery] = useState('');
    const [message, setMessage] = useState('');

    const fetchTransactions = async () => {
        try {
            const response = supplierQuery.trim()
                ? await API.get('/admin/report/inventory/search', { params: { supplier: supplierQuery } })
                : await API.get('/admin/report/suppliers');
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching supplier transactions:', error);
            setMessage('Error fetching supplier transactions.');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSearch = () => {
        fetchTransactions();
    };

    return (
        <div>
            <h3>Supplier Transactions (Inventory Imports)</h3>
            <div>
                <input
                    type="text"
                    placeholder="Search by Supplier Name"
                    value={supplierQuery}
                    onChange={(e) => setSupplierQuery(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleSearch} style={{ padding: '5px 10px' }}>Search</button>
            </div>
            {message && <p>{message}</p>}
            {transactions.length > 0 ? (
                <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Original Price</th>
                        <th>Supplier Name</th>
                        <th>Imported On</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.originalPrice}</td>
                            <td>{item.supplierName}</td>
                            <td>{item.importTimestamp ? new Date(item.importTimestamp).toLocaleString() : ''}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No supplier transactions found.</p>
            )}
        </div>
    );
};

export default SupplierTransactionList;
