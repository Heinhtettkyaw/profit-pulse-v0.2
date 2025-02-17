// src/components/ExtendedAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell as PieCell,
} from 'recharts';

// A color palette for slices
const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#AA47BC', // Purple
    '#FF5C8D', // Pink
    '#7EB874', // Sage
    '#FFD300', // Gold
];

// Custom label function for the donut chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
    const RADIAN = Math.PI / 180;
    const extendedRadius = outerRadius + 20;
    const x = cx + extendedRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + extendedRadius * Math.sin(-midAngle * RADIAN);

    // Extract the relevant name field from the payload
    const labelName = payload.item_name || payload.cashier_username || payload.buyer_name;

    // Use the same color as the corresponding slice
    const sliceColor = COLORS[index % COLORS.length];

    return (
        <text
            x={x}
            y={y}
            fill={sliceColor} // Match the label text color with the slice color
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={14}
            fontWeight="bold"
        >
            {labelName}
        </text>
    );
};

const ExtendedAnalysis = () => {
    const [analysisType, setAnalysisType] = useState('forecast');
    const [steps, setSteps] = useState(5);
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch data based on selected analysis type
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
                setData(response.data.forecast);
            } else if (analysisType === 'trend') {
                setData(response.data.trend);
            } else {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching analysis data:', error);
            setMessage('Error fetching analysis data.');
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analysisType, steps]);

    // Render a combined view with donut chart and table side by side
    const renderDonutAndTable = (chartData, nameKey, valueKey, title) => {
        return (
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

                {/* Donut chart */}
                <PieChart width={400} height={400}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey={valueKey}
                    >
                        {chartData.map((entry, index) => (
                            <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>

                {/* Arrow between chart and table */}
                <span className="hidden md:inline text-4xl text-gray-600">→</span>

                {/* Table with matching text color */}
                <table className="border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-800">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-800">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chartData.map((item, index) => {
                        const color = COLORS[index % COLORS.length];
                        const val = item[valueKey];

                        // Determine the color for the value based on its sign
                        const valueColor = val >= 0 ? 'text-green-600' : 'text-red-600';

                        return (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-200 ease-in-out"
                            >
                                <td
                                    className="border border-gray-300 px-4 py-2 text-gray-800 font-medium"
                                    style={{ color }}
                                >
                                    {item[nameKey]}
                                </td>
                                <td className={`border border-gray-300 px-4 py-2 ${valueColor}`}>
                                    {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render content based on analysis type
    const renderContent = () => {
        switch (analysisType) {
            case 'forecast':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Forecasted Profit (Next {steps} Days)</h2>
                        {data.length > 0 ? (
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#0088FE"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        ) : (
                            <p className="text-red-500">No forecast data available.</p>
                        )}
                    </div>
                );

            case 'trend':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profit Trend Analysis</h2>
                        {data.length > 0 ? (
                            <LineChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#00C49F"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        ) : (
                            <p className="text-red-500">No trend data available.</p>
                        )}
                    </div>
                );

            case 'topProfitProducts':
                return renderDonutAndTable(data, 'item_name', 'profit', 'Top Profit-Making Products');

            case 'topLossProducts':
                return renderDonutAndTable(data, 'item_name', 'profit', 'Top Loss-Making Products');

            case 'topCustomers':
                return renderDonutAndTable(data, 'buyer_name', 'profit', 'Top Customers');

            case 'topCashiers':
                return renderDonutAndTable(data, 'cashier_username', 'profit', 'Top Cashiers');

            default:
                return <p className="text-gray-600">Please select an analysis type.</p>;
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">Extended Analysis Dashboard</h1>

            {message && <p className="text-red-500 text-center mb-4">{message}</p>}

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Analysis Type:</label>
                <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Steps:</label>
                    <input
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            )}

            <button
                onClick={fetchData}
                className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Refresh Data
            </button>

            <div className="mt-8">{renderContent()}</div>
        </div>
    );
};

export default ExtendedAnalysis;