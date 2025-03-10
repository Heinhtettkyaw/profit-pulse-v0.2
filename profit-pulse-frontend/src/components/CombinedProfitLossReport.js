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

    // Custom legend for the monthly bar chart
    const renderMonthlyLegend = () => {
        let hasPositive = false;
        let hasNegative = false;

        for (let i = 0; i < monthlyBarData.length; i++) {
            if (monthlyBarData[i].profit >= 0) {
                hasPositive = true;
            } else {
                hasNegative = true;
            }
        }

        return (
            <div className="flex space-x-4">
                {hasPositive && (
                    <div className="flex items-center">
                        <div style={{ backgroundColor: '#2ecc71', width: 10, height: 10, marginRight: 5 }}></div>
                        <span>Profit</span>
                    </div>
                )}
                {hasNegative && (
                    <div className="flex items-center">
                        <div style={{ backgroundColor: '#e74c3c', width: 10, height: 10, marginRight: 5 }}></div>
                        <span>Loss</span>
                    </div>
                )}
            </div>
        );
    };

    // Custom legend for the daily bar chart
    // Now, we check for the existence of the property instead of nonzero value.
    const renderDailyLegend = () => {
        let hasProfit = false;
        let hasLoss = false;

        for (let i = 0; i < dailyBarData.length; i++) {
            if (dailyBarData[i].profit>=0) {
                hasProfit = true;
            }else {
                hasLoss = true;
            }
        }

        return (
            <div className="flex space-x-4">
                {hasProfit && (
                    <div className="flex items-center">
                        <div style={{ backgroundColor: '#2ecc71', width: 10, height: 10, marginRight: 5 }}></div>
                        <span>Profit</span>
                    </div>
                )}
                {hasLoss && (
                    <div className="flex items-center">
                        <div style={{ backgroundColor: '#e74c3c', width: 10, height: 10, marginRight: 5 }}></div>
                        <span>Loss</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Profit & Loss Details Report</h2>

            {/* Search Inputs */}
            <div className="mb-6 space-y-2">
                <label className="block text-sm font-medium text-[var(--j-color)]">
                    Year (e.g., 2023):
                </label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                />

                <label className="block text-sm font-medium text-[var(--j-color)]">
                    Month (1-12):
                </label>
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                />

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
            {message && (
                <p className="text-red-500 text-sm font-medium mb-4">{message}</p>
            )}

            {/* Profit Transactions Table */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Profit Transactions</h3>
                {profitTransactions.length > 0 ? (
                    <table className="min-w-full border border-gray-300 bg-[var(--primary-bg)] shadow-md rounded-lg">
                        <thead className="bg-[var(--primary-bg)]">
                        <tr>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">ID</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Item Name</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Quantity Sold</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Sold Price</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Buyer Name</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Cashier</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Timestamp</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Profit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {profitTransactions.map((sale) => {
                            const profit = (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                            return (
                                <tr key={sale.id} className="hover:bg-[var(--hover-color)] transition duration-300">
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.id}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.itemName}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.quantitySold}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.soldPrice}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.buyerName}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.cashierUsername}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">
                                        {sale.timestamp ? new Date(sale.timestamp).toLocaleString() : ''}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-green-600 font-medium">
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
                    <table className="min-w-full border border-gray-300 bg-[var(--primary-bg)] shadow-md rounded-lg">
                        <thead className="bg-[var(--primary-bg)]">
                        <tr>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">ID</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Item Name</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Quantity Sold</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Sold Price</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Buyer Name</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Cashier</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Timestamp</th>
                            <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-[var(--primary-text)]">Loss</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lossTransactions.map((sale) => {
                            const loss = (sale.soldPrice - sale.originalPrice) * sale.quantitySold;
                            return (
                                <tr key={sale.id} className="hover:bg-[var(--hover-color)] transition duration-300">
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.id}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.itemName}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.quantitySold}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.soldPrice}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.buyerName}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">{sale.cashierUsername}</td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-[var(--primary-text)]">
                                        {sale.timestamp ? new Date(sale.timestamp).toLocaleString() : ''}
                                    </td>
                                    <td className="border-b border-gray-200 px-4 py-2 text-red-600 font-medium">
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

            {/* Combined Profit Bar Charts Side by Side */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Profit Bar Charts</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Monthly Profit Bar Chart */}
                    <div className="flex-1">
                        <h4 className="text-md font-semibold mb-2">
                            Monthly Profit Bar Chart (Last 3 Months)
                        </h4>
                        {monthlyBarData.length > 0 ? (
                            <BarChart
                                width={350}
                                height={300}
                                data={monthlyBarData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend content={renderMonthlyLegend} />
                                <Bar dataKey="profit">
                                    {monthlyBarData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.profit >= 0 ? "#2ecc71" : "#e74c3c"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <p className="text-red-600 text-center mt-4">
                                No monthly bar chart data available.
                            </p>
                        )}
                    </div>
                    {/* Daily Profit Bar Chart */}
                    <div className="flex-1">
                        <h4 className="text-md font-semibold mb-2">
                            Daily Profit Bar Chart (Last 5 Days)
                        </h4>
                        {dailyBarData.length > 0 ? (
                            <BarChart
                                width={350}
                                height={300}
                                data={dailyBarData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend content={renderDailyLegend} />
                                <Bar dataKey="profit">
                                    {dailyBarData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.profit >= 0 ? "#2ecc71" : "#e74c3c"}
                                        />
                                    ))}
                                </Bar>

                            </BarChart>
                        ) : (
                            <p className="text-gray-500 text-center mt-4">
                                No daily bar chart data available.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CombinedProfitLossReport;
