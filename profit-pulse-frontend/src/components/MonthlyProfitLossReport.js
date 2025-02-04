// src/components/MonthlyProfitLossReport.js
import React, { useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MonthlyProfitLossReport = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [profitTransactions, setProfitTransactions] = useState([]);
    const [lossTransactions, setLossTransactions] = useState([]);
    const [barData, setBarData] = useState([]);
    const [message, setMessage] = useState('');

    const fetchReports = async () => {
        if (year.trim() === '' || month.trim() === '') {
            setMessage('Please enter both year and month.');
            return;
        }
        try {
            // Fetch profit transactions (profitPositive=true)
            const profitRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: true }
            });
            setProfitTransactions(profitRes.data);

            // Fetch loss transactions (profitPositive=false)
            const lossRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: false }
            });
            setLossTransactions(lossRes.data);

            // Fetch aggregated monthly profit data for bar chart
            const barRes = await API.get('/admin/profit-loss/monthly/bar');
            // Filter for the selected month
            const formattedMonth = `${year}-${month.padStart(2, '0')}`;
            const filteredBarData = barRes.data.filter(item => item.month === formattedMonth);
            setBarData(filteredBarData);
            setMessage('');
        } catch (error) {
            console.error('Error fetching monthly report:', error);
            setMessage('Error fetching monthly report.');
        }
    };

    return (
        <div>
            <h3>Monthly Profit & Loss Report</h3>
            <div>
                <input
                    type="number"
                    placeholder="Year (e.g., 2023)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="number"
                    placeholder="Month (1-12)"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={fetchReports} style={{ padding: '5px 10px' }}>
                    Search by Month
                </button>
            </div>
            {message && <p>{message}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ width: '48%' }}>
                    <h4>Profit Transactions</h4>
                    {profitTransactions.length > 0 ? (
                        <table border="1" cellPadding="5">
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
                            {profitTransactions.map((sale) => {
                                const profit = (sale.soldPrice - sale.inventory.originalPrice) * sale.quantitySold;
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
                        <p>No profit transactions found for this month.</p>
                    )}
                </div>
                <div style={{ width: '48%' }}>
                    <h4>Loss Transactions</h4>
                    {lossTransactions.length > 0 ? (
                        <table border="1" cellPadding="5">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Item Name</th>
                                <th>Quantity Sold</th>
                                <th>Sold Price</th>
                                <th>Buyer Name</th>
                                <th>Timestamp</th>
                                <th>Loss</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lossTransactions.map((sale) => {
                                const loss = (sale.soldPrice - sale.inventory.originalPrice) * sale.quantitySold;
                                return (
                                    <tr key={sale.id}>
                                        <td>{sale.id}</td>
                                        <td>{sale.inventory.itemName}</td>
                                        <td>{sale.quantitySold}</td>
                                        <td>{sale.soldPrice}</td>
                                        <td>{sale.buyerName}</td>
                                        <td>{sale.timestamp ? new Date(sale.timestamp).toLocaleString() : ''}</td>
                                        <td>{loss}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : (
                        <p>No loss transactions found for this month.</p>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h4>Monthly Profit Bar Chart</h4>
                {barData.length > 0 ? (
                    <BarChart width={600} height={300} data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#82ca9d" />
                    </BarChart>
                ) : (
                    <p>No bar chart data available for this month.</p>
                )}
            </div>
        </div>
    );
};

export default MonthlyProfitLossReport;
