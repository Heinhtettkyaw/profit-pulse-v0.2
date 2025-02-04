// src/components/TransactionList.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [buyerQuery, setBuyerQuery] = useState('');
    const [message, setMessage] = useState('');

    const fetchTransactions = async () => {
        try {
            const response = buyerQuery.trim()
                ? await API.get('/admin/report/sales/search', { params: { buyer: buyerQuery } })
                : await API.get('/admin/report/sales');
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching sales transactions:', error);
            setMessage('Error fetching sales transactions.');
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
            <h3>Sales Transactions (Buyer Transactions)</h3>
            <div>
                <input
                    type="text"
                    placeholder="Search by Buyer Name"
                    value={buyerQuery}
                    onChange={(e) => setBuyerQuery(e.target.value)}
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
                        <th>Quantity Sold</th>
                        <th>Sold Price</th>
                        <th>Buyer Name</th>
                        <th>Timestamp</th>
                        <th>Profit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((sale) => {
                        const originalPrice = sale.inventory.originalPrice;
                        const profit = (sale.soldPrice - originalPrice) * sale.quantitySold;
                        return (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>{sale.inventory.itemName}</td>
                                <td>{sale.quantitySold}</td>
                                <td>{sale.soldPrice}</td>
                                <td>{sale.buyerName}</td>
                                <td>{sale.timestamp ? new Date(sale.timestamp).toLocaleString() : ''}</td>
                                <td>{profit}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ) : (
                <p>No sales transactions found.</p>
            )}
        </div>
    );
};

export default TransactionList;
