import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SupplierTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');

    const fetchAllTransactions = async () => {
        try {
            const response = await API.get('/admin/report/suppliers');
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching supplier transactions:', error);
            setMessage('Error fetching supplier transactions.');
        }
    };

    const searchTransactions = async () => {
        try {
            if (query.trim() === '') {
                fetchAllTransactions();
                return;
            }
            const response = await API.get('/admin/report/inventory/search', {
                params: { query },
            });
            setTransactions(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error searching supplier transactions:', error);
            setMessage('Error searching supplier transactions.');
        }
    };

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <h3 className="text-xl font-bold mb-4">Supplier Transactions</h3>

            {/* Search Bar */}
            <div className="mb-6 flex items-center space-x-2 sm:space-x-4">
                <input
                    type="text"
                    placeholder="Search by Supplier or Item Name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow px-4 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 sm:w-auto"
                />
                <button
                    onClick={searchTransactions}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none transition duration-300"
                >
                    Search
                </button>
                <button
                    onClick={fetchAllTransactions}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none ml-2 transition duration-300"
                >
                    Show All
                </button>
            </div>

            {/* Message Display */}
            {message && (
                <p className="text-red-500 text-sm font-medium mb-4">{message}</p>
            )}

            {/* Transaction Table */}
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 bg-[var(--primary-bg)] shadow-md rounded-lg">
                        <thead className="bg-[var(--primary-bg)]">
                        <tr>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                ID
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                Item Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                Quantity
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                Original Price
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                Supplier Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                General Fee
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">
                                Imported On
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-[var(--hover-color)] transition duration-300"
                            >
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.id}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.itemName}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.quantity}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.originalPrice}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.supplierName}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{item.generalFee}</td>
                                <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">
                                    {item.importTimestamp
                                        ? new Date(item.importTimestamp).toLocaleString()
                                        : ''}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-6">No supplier transactions found.</p>
            )}
        </div>
    );
};

export default SupplierTransactionList;