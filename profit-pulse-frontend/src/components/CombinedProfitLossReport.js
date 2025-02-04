// src/components/CombinedProfitLossReport.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CombinedProfitLossReport = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [profitTransactions, setProfitTransactions] = useState([]);
    const [lossTransactions, setLossTransactions] = useState([]);
    const [barData, setBarData] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch all sales transactions if no filter is applied
    const fetchAllSales = async () => {
        try {
            const response = await API.get('/admin/report/sales');
            const allSales = response.data;
            // Split sales into profit and loss
            const profits = allSales.filter(sale => {
                const profit = (sale.soldPrice - sale.inventory.originalPrice) * sale.quantitySold;
                return profit > 0;
            });
            const losses = allSales.filter(sale => {
                const profit = (sale.soldPrice - sale.inventory.originalPrice) * sale.quantitySold;
                return profit < 0;
            });
            setProfitTransactions(profits);
            setLossTransactions(losses);
            setMessage('');
        } catch (error) {
            console.error('Error fetching all sales:', error);
            setMessage('Error fetching transactions.');
        }
    };

    // Fetch monthly sales transactions filtered by year and month
    const fetchMonthlySales = async () => {
        if (year.trim() === '' || month.trim() === '') {
            setMessage('Please enter both year and month for filtering.');
            return;
        }
        try {
            const profitRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: true }
            });
            const lossRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: false }
            });
            setProfitTransactions(profitRes.data);
            setLossTransactions(lossRes.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
            setMessage('Error fetching monthly transactions.');
        }
    };

    // Fetch aggregated monthly profit data for bar chart
    const fetchBarChartData = async () => {
        try {
            const response = await API.get('/admin/profit-loss/monthly/bar');
            const data = response.data;
            // Get current month and previous two months
            const currentDate = new Date();
            const months = [];
            for (let i = 0; i < 3; i++) {
                const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const formatted = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                months.push(formatted);
            }
            const filteredData = data.filter(item => months.includes(item.month));
            filteredData.sort((a, b) => (a.month > b.month ? 1 : -1));
            setBarData(filteredData);
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    // On mount, fetch all sales and bar chart data
    useEffect(() => {
        fetchAllSales();
        fetchBarChartData();
    }, []);

    return (
        <div>
            <h3>Profit & Loss Details Report</h3>
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
                <button onClick={fetchMonthlySales} style={{ padding: '5px 10px', marginRight: '5px' }}>
                    Filter by Month
                </button>
                <button onClick={fetchAllSales} style={{ padding: '5px 10px' }}>
                    Show All Transactions
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
                        <p>No profit transactions found.</p>
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
                        <p>No loss transactions found.</p>
                    )}
                </div>
            </div>
            <div style={{ marginTop: '40px' }}>
                <h4>Monthly Profit Bar Chart (Last 3 Months)</h4>
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
                    <p>No bar chart data available.</p>
                )}
            </div>
        </div>
    );
};

export default CombinedProfitLossReport;
