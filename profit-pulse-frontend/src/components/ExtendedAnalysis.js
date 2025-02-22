import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const ExtendedAnalysis = () => {
    const [analysisType, setAnalysisType] = useState('dailyForecast');
    const [forecastType, setForecastType] = useState('hybrid');
    const [steps, setSteps] = useState(5);
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        setMessage('');
        try {
            let url = '';
            if (analysisType === 'dailyForecast') {
                url = `http://localhost:5000/analysis/forecast?steps=${steps}`;
            } else if (analysisType === 'trend') {
                url = `http://localhost:5000/analysis/trend`;
            } else if (analysisType === 'topProfitProducts') {
                url = `http://localhost:5000/analysis/top-profit-products`;
            } else if (analysisType === 'topLossProducts') {
                url = `http://localhost:5000/analysis/top-loss-products`;
            } else if (analysisType === 'topCustomers') {
                url = `http://localhost:5000/analysis/top-customers`;
            } else if (analysisType === 'topCashiers') {
                url = `http://localhost:5000/analysis/top-cashiers`;
            }

            const response = await axios.get(url);

            if (analysisType === 'dailyForecast') {
                if (forecastType === 'arima') {
                    setData(response.data.arima_forecast || []);
                } else if (forecastType === 'sarima') {
                    setData(response.data.sarima_forecast || []);
                } else {
                    setData(response.data.hybrid_forecast || []);
                }
            } else {
                setData(response.data?.trend || response.data || []);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Failed to load data. Please try again.");
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [analysisType, steps, forecastType]);

    const renderDonutAndTable = (chartData, nameKey, valueKey, title) => {
        const isLoss = chartData.length > 0 && chartData[0][valueKey] < 0;
        const chartDataForPie = isLoss
            ? chartData.map(item => ({ ...item, absValue: Math.abs(item[valueKey]) }))
            : chartData;

        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + 40;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            const lineEndX = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN);
            const lineEndY = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN);

            return (
                <g>
                    <line
                        x1={cx + (outerRadius - 10) * Math.cos(-midAngle * RADIAN)}
                        y1={cy + (outerRadius - 10) * Math.sin(-midAngle * RADIAN)}
                        x2={lineEndX}
                        y2={lineEndY}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={1.5}
                    />
                    <text
                        x={x}
                        y={y}
                        fill={COLORS[index % COLORS.length]}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm font-semibold"
                    >
                        {chartData[index][nameKey]}
                    </text>
                </g>
            );
        };

        return (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{title}</h2>
                <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
                    <div className="relative">
                        <PieChart width={500} height={400}>
                            <Pie
                                data={chartDataForPie}
                                dataKey={isLoss ? 'absValue' : valueKey}
                                nameKey={nameKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={140}
                                innerRadius={90}
                                paddingAngle={2}
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {chartDataForPie.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-2xl font-bold text-gray-600"
                            >
                                {isLoss ? 'Loss' : 'Profit'}
                            </text>
                        </PieChart>
                    </div>

                    <div className="w-full max-w-xl">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Item</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Value</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {chartData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-3 shadow-sm"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                        {item[nameKey]}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                    item[valueKey] < 0
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {item[valueKey] < 0 ? '-' : '+'}
                                                    ${Math.abs(item[valueKey]).toFixed(2)}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (analysisType) {
            case 'dailyForecast':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Forecast Type
                                </label>
                                <select
                                    value={forecastType}
                                    onChange={(e) => setForecastType(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="arima">ARIMA Trend</option>
                                    <option value="sarima">SARIMAX Seasonality</option>
                                    <option value="hybrid">Hybrid Model</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Forecast Days
                                </label>
                                <input
                                    type="number"
                                    value={steps}
                                    onChange={(e) => setSteps(Math.max(1, e.target.value))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {data.length > 0 ? (
                            <div className="border border-gray-200 rounded-xl p-4">
                                <LineChart
                                    width={800}
                                    height={400}
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#6b7280' }}
                                        tickFormatter={(str) => new Date(str).toLocaleDateString()}
                                    />
                                    <YAxis tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => (
                                            <span className="text-gray-700 font-medium">{value}</span>
                                        )}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#6366f1"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#6366f1', strokeWidth: 2 }}
                                        activeDot={{ r: 8, fill: '#4f46e5' }}
                                    />
                                </LineChart>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No forecast data available</p>
                            </div>
                        )}
                    </div>
                );

            case 'trend':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">Historical Trend</h2>
                        {data.length > 0 ? (
                            <div className="border border-gray-200 rounded-xl p-4">
                                <LineChart
                                    width={800}
                                    height={400}
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#6b7280' }}
                                        tickFormatter={(str) => new Date(str).toLocaleDateString()}
                                    />
                                    <YAxis tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#10b981', strokeWidth: 2 }}
                                        activeDot={{ r: 8, fill: '#059669' }}
                                    />
                                </LineChart>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No trend data available</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        {renderDonutAndTable(
                            data,
                            analysisType === 'topProfitProducts' || analysisType === 'topLossProducts'
                                ? 'item_name'
                                : analysisType === 'topCustomers'
                                    ? 'buyer_name'
                                    : 'cashier_username',
                            'profit',
                            analysisType === 'topProfitProducts' ? 'Top Profit-Making Products' :
                                analysisType === 'topLossProducts' ? 'Top Loss-Making Products' :
                                    analysisType === 'topCustomers' ? 'Top Customers by Spending' :
                                        'Top Cashiers by Sales'
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">ProfitPulse Analytics</h1>
                        <p className="text-gray-600 mt-2">Advanced business performance insights</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={analysisType}
                            onChange={(e) => setAnalysisType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="dailyForecast">Sales Forecast</option>
                            <option value="trend">Historical Trend</option>
                            <option value="topProfitProducts">Top Products (Profit)</option>
                            <option value="topLossProducts">Top Products (Loss)</option>
                            <option value="topCustomers">Top Customers</option>
                            <option value="topCashiers">Top Cashiers</option>
                        </select>

                        <button
                            onClick={fetchData}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{message}</p>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
};

export default ExtendedAnalysis;