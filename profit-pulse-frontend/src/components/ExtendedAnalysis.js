// src/components/ExtendedAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell as PieCell
} from 'recharts';

// Define a color palette for pie slices
const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AA47BC',
    '#FF5C8D',
    '#7EB874',
    '#FFD300'
];

// Custom label function for donut chart: show both name and numeric value
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, payload }) => {
    const RADIAN = Math.PI / 180;
    const extendedRadius = outerRadius + 20;
    const x = cx + extendedRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + extendedRadius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill={COLORS[index % COLORS.length]}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={12}
        >
            {payload.item_name} (${payload.profit.toFixed(2)})
        </text>
    );
};

const ExtendedAnalysis = () => {
    // analysisType options: 'forecast', 'trend', 'topProfitProducts', 'topLossProducts', 'topCustomers', 'topCashiers'
    const [analysisType, setAnalysisType] = useState('forecast');
    const [steps, setSteps] = useState(5);
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch data based on analysis type
    const fetchData = async () => {
        setMessage('');
        try {
            let url = '';
            switch (analysisType) {
                case 'forecast':
                    url = `http://localhost:5000/analysis/forecast?steps=${steps}`;
                    break;
                case 'trend':
                    url = `http://localhost:5000/analysis/trend`;
                    break;
                case 'topProfitProducts':
                    url = `http://localhost:5000/analysis/top-profit-products`;
                    break;
                case 'topLossProducts':
                    url = `http://localhost:5000/analysis/top-loss-products`;
                    break;
                case 'topCustomers':
                    url = `http://localhost:5000/analysis/top-customers`;
                    break;
                case 'topCashiers':
                    url = `http://localhost:5000/analysis/top-cashiers`;
                    break;
                default:
                    setData([]);
                    return;
            }
            const response = await axios.get(url);
            if (analysisType === 'forecast') {
                // For ensemble forecast, we expect {ensemble_forecast: [...], arima_forecast: [...], prophet_forecast: [...]}
                setData(response.data.ensemble_forecast || []);
            } else if (analysisType === 'trend') {
                setData(response.data.trend || []);
            } else {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching analysis data:", error);
            setMessage("Error fetching analysis data.");
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [analysisType, steps]);

    // Helper: Render donut chart with a matching table for categorical data.
    const renderDonutAndTable = (chartData, nameKey, valueKey, title) => {
        return (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <div className="flex flex-col md:flex-row items-center justify-center">
                    {/* Donut chart */}
                    <div className="flex-1">
                        <PieChart width={400} height={320}>
                            <Pie
                                data={chartData}
                                dataKey={valueKey}
                                nameKey={nameKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                labelLine
                                label={renderCustomizedLabel}
                            >
                                {chartData.map((entry, index) => {
                                    const color = COLORS[index % COLORS.length];
                                    return <PieCell key={`cell-${index}`} fill={color} />;
                                })}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    {/* Arrow between chart and table */}
                    <div className="hidden md:block text-4xl mx-4" style={{ color: '#333' }}>→</div>
                    {/* Table */}
                    <div className="flex-1 mt-6 md:mt-0">
                        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-x-auto">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                    Name
                                </th>
                                <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                    Value
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {chartData.map((item, index) => {
                                const color = COLORS[index % COLORS.length];
                                const val = item[valueKey];
                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition duration-300"
                                        style={{ color }} // matching text color
                                    >
                                        <td className="border-b border-gray-200 px-4 py-2 font-medium">
                                            {item[nameKey]}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2">
                                            {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (analysisType) {
            case 'forecast': {
                return (
                    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Forecasted Profit (Next {steps} Days)</h2>
                        {data.length > 0 ? (
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        ) : (
                            <p className="text-gray-500">No forecast data available.</p>
                        )}
                    </div>
                );
            }

            case 'trend': {
                return (
                    <div className="bg-green-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Profit Trend Analysis</h2>
                        {data.length > 0 ? (
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        ) : (
                            <p className="text-gray-500">No trend data available.</p>
                        )}
                    </div>
                );
            }

            case 'topProfitProducts':
                return renderDonutAndTable(data, 'item_name', 'profit', 'Top Profit-Making Products');

            case 'topLossProducts':
                return renderDonutAndTable(data, 'item_name', 'profit', 'Top Loss-Making Products');

            case 'topCustomers':
                return renderDonutAndTable(data, 'buyer_name', 'profit', 'Top Customers');

            case 'topCashiers':
                return renderDonutAndTable(data, 'cashier_username', 'profit', 'Top Cashiers');

            default:
                return <div className="text-gray-500 text-center">Please select an analysis type.</div>;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Extended Analysis Dashboard</h1>
            {message && <p className="text-red-500 text-sm font-medium mb-4">{message}</p>}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type:</label>
                <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="forecast">Forecast Profit</option>
                    <option value="trend">Trend Analysis</option>
                    <option value="topProfitProducts">Top Profit-Making Products</option>
                    <option value="topLossProducts">Top Loss-Making Products</option>
                    <option value="topCustomers">Top Customers</option>
                    <option value="topCashiers">Top Cashiers</option>
                </select>
            </div>
            {analysisType === 'forecast' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Steps:</label>
                    <input
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
            )}
            <button
                onClick={fetchData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none mb-6"
            >
                Refresh Data
            </button>
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default ExtendedAnalysis;
