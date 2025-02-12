import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const CombinedProfitLossReport = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [profitTransactions, setProfitTransactions] = useState([]);
    const [lossTransactions, setLossTransactions] = useState([]);
    const [monthlyBarData, setMonthlyBarData] = useState([]);
    const [dailyBarData, setDailyBarData] = useState([]);
    const [message, setMessage] = useState('');

    const fetchAllSales = async () => {
        try {
            const response = await API.get('/admin/report/sales');
            const allSales = response.data;
            const profits = allSales.filter((sale) => {
                const profit = (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                return profit > 0;
            });
            const losses = allSales.filter((sale) => {
                const profit = (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
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

    const fetchMonthlySales = async () => {
        if (year.trim() === '' || month.trim() === '') {
            setMessage('Please enter both year and month for filtering.');
            return;
        }
        try {
            const profitRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: true },
            });
            const lossRes = await API.get('/admin/profit-loss/monthly/sales', {
                params: { year, month, profitPositive: false },
            });
            setProfitTransactions(profitRes.data);
            setLossTransactions(lossRes.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
            setMessage('Error fetching monthly transactions.');
        }
    };

    const fetchMonthlyBarChartData = async () => {
        try {
            const response = await API.get('/admin/profit-loss/monthly/bar');
            setMonthlyBarData(response.data);
        } catch (error) {
            console.error('Error fetching monthly bar chart data:', error);
        }
    };

    const fetchDailyBarChartData = async () => {
        try {
            const response = await API.get('/admin/profit-loss/daily/bar');
            setDailyBarData(response.data);
        } catch (error) {
            console.error('Error fetching daily bar chart data:', error);
        }
    };

    useEffect(() => {
        fetchAllSales();
        fetchMonthlyBarChartData();
        fetchDailyBarChartData();
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Profit & Loss Details Report</h2>

            {/* Search Inputs */}
            <div className="mb-6 space-y-2">
                {/* Year Input */}
                <label className="block text-sm font-medium text-gray-700">Year (e.g., 2023):</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />

                {/* Month Input */}
                <label className="block text-sm font-medium text-gray-700">Month (1-12):</label>
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={fetchMonthlySales}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Filter by Month
                    </button>
                    <button
                        onClick={fetchAllSales}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                    >
                        Show All Transactions
                    </button>
                </div>
            </div>

            {/* Message Display */}
            {message && <p className="text-red-500 text-sm font-medium mb-4">{message}</p>}

            {/* Profit Transactions Table */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Profit Transactions</h3>
                {profitTransactions.length > 0 ? (
                    <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                ID
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Item Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Quantity Sold
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Sold Price
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Buyer Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Cashier
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Timestamp
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Profit
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {profitTransactions.map((sale) => {
                            const profit =
                                (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                            return (
                                <tr
                                    key={sale.id}
                                    className="hover:bg-gray-100 transition duration-300"
                                >
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">{sale.id}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.itemName}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.quantitySold}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.soldPrice}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.buyerName}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.cashierUsername}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.timestamp
                                            ? new Date(sale.timestamp).toLocaleString()
                                            : ''}
                                    </td>
                                    <td
                                        className={`border-b border-gray-200 px-4 py-2 text-green-600 font-medium`}
                                    >
                                        +${profit.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No profit transactions found.</p>
                )}
            </div>

            {/* Loss Transactions Table */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Loss Transactions</h3>
                {lossTransactions.length > 0 ? (
                    <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                ID
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Item Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Quantity Sold
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Sold Price
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Buyer Name
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Cashier
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Timestamp
                            </th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                Loss
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {lossTransactions.map((sale) => {
                            const loss =
                                (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                            return (
                                <tr
                                    key={sale.id}
                                    className="hover:bg-gray-100 transition duration-300"
                                >
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">{sale.id}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.itemName}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.quantitySold}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.soldPrice}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.buyerName}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.cashierUsername}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                        {sale.timestamp
                                            ? new Date(sale.timestamp).toLocaleString()
                                            : ''}
                                    </td>
                                    <td
                                        className={`border-b border-gray-200 px-4 py-2 text-red-600 font-medium`}
                                    >
                                        -${Math.abs(loss).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No loss transactions found.</p>
                )}
            </div>

            {/* Monthly Profit Bar Chart */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Monthly Profit Bar Chart (Last 3 Months)</h3>
                {monthlyBarData.length > 0 ? (
                    <BarChart
                        width={700}
                        height={300}
                        data={monthlyBarData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#2ecc71" name="Profit" />
                        <Bar dataKey="loss" fill="#e74c3c" name="Loss" />
                    </BarChart>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No monthly bar chart data available.</p>
                )}
            </div>

            {/* Daily Profit Bar Chart */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Daily Profit Bar Chart (Last 5 Days)</h3>
                {dailyBarData.length > 0 ? (
                    <BarChart
                        width={700}
                        height={300}
                        data={dailyBarData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#2ecc71" name="Profit" />
                        <Bar dataKey="loss" fill="#e74c3c" name="Loss" />
                    </BarChart>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No daily bar chart data available.</p>
                )}
            </div>
        </div>
    );
};

export default CombinedProfitLossReport;