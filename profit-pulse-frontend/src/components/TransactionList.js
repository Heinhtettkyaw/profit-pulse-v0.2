// src/components/TransactionList.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');

    const fetchAllTransactions = async () => {
        try {
            const response = await API.get('/admin/report/sales');
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching sales transactions:', error);
            setMessage('Error fetching sales transactions.');
        }
    };

    const searchTransactions = async () => {
        try {
            if (query.trim() === '') {
                fetchAllTransactions();
                return;
            }
            const response = await API.get('/admin/report/sales/search', {
                params: { query }
            });
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error searching transactions:', error);
            setMessage('Error searching transactions.');
        }
    };

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    return (
        <div>
            <h3>Sales Transactions</h3>
            <div>
                <input
                    type="text"
                    placeholder="Search by Buyer or Item Name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={searchTransactions} style={{ padding: '5px 10px', marginRight: '5px' }}>
                    Search
                </button>
                <button onClick={fetchAllTransactions} style={{ padding: '5px 10px' }}>
                    Show All Transactions
                </button>
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
                        <th>Cashier</th>
                        <th>Timestamp</th>
                        <th>Profit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((sale) => {
                        const profit = (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                        return (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>{sale.itemName}</td>
                                <td>{sale.quantitySold}</td>
                                <td>{sale.soldPrice}</td>
                                <td>{sale.buyerName}</td>
                                <td>{sale.cashierUsername}</td>
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
