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
} from 'recharts';

const ExtendedAnalysis = () => {
    // State variables
    const [analysisType, setAnalysisType] = useState('forecast');
    const [subResolution, setSubResolution] = useState('daily'); // Used if analysisType == 'forecastResolution'
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
                case 'forecastResolution':
                    url = `http://localhost:5000/analysis/forecast/resolution?resolution=${subResolution}&steps=${steps}`;
                    break;
                default:
                    setData([]);
                    return;
            }
            const response = await axios.get(url);
            // For forecast and forecastResolution endpoints, the structure is slightly different.
            if (analysisType === 'forecast') {
                setData(response.data.forecast);
            } else if (analysisType === 'forecastResolution') {
                setData(response.data.data);
            } else if (analysisType === 'trend') {
                setData(response.data.trend);
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
    }, [analysisType, subResolution, steps]);

    // Render content based on analysis type
    const renderContent = () => {
        switch (analysisType) {
            case 'forecast': {
                return (
                    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Forecasted Profit (Next {steps} Days)</h2>
                        {data.length > 0 ? (
                            <BarChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="profit">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit < 0 ? 'red' : 'blue'} />
                                    ))}
                                </Bar>
                            </BarChart>
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
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        ) : (
                            <p className="text-gray-500">No trend data available.</p>
                        )}
                    </div>
                );
            }

            case 'topProfitProducts': {
                return (
                    <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Top Profit-Making Products</h2>
                        {data.length > 0 ? (
                            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-x-auto">
                                <thead className="bg-yellow-200">
                                <tr>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Item Name
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Total Profit
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition duration-300"
                                    >
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                            {item.item_name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-green-600 font-medium">
                                            +${item.profit.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center">No data available.</p>
                        )}
                    </div>
                );
            }

            case 'topLossProducts': {
                return (
                    <div className="bg-red-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Top Loss-Making Products</h2>
                        {data.length > 0 ? (
                            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-x-auto">
                                <thead className="bg-red-200">
                                <tr>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Item Name
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Total Loss
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition duration-300"
                                    >
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                            {item.item_name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-red-600 font-medium">
                                            -${Math.abs(item.profit).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center">No data available.</p>
                        )}
                    </div>
                );
            }

            case 'topCustomers': {
                return (
                    <div className="bg-purple-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Top Customers</h2>
                        {data.length > 0 ? (
                            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-x-auto">
                                <thead className="bg-purple-200">
                                <tr>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Buyer Name
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Total Profit
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition duration-300"
                                    >
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                            {item.buyer_name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-green-600 font-medium">
                                            +${item.profit.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center">No data available.</p>
                        )}
                    </div>
                );
            }

            case 'topCashiers': {
                return (
                    <div className="bg-pink-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Top Cashiers</h2>
                        {data.length > 0 ? (
                            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-x-auto">
                                <thead className="bg-pink-200">
                                <tr>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Cashier Username
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                                        Total Profit
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition duration-300"
                                    >
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                                            {item.cashier_username}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-green-600 font-medium">
                                            +${item.profit.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center">No data available.</p>
                        )}
                    </div>
                );
            }

            case 'forecastResolution': {
                return (
                    <div className="bg-teal-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Forecast by Resolution ({subResolution})</h2>
                        {data.length > 0 ? (
                            <BarChart width={600} height={300} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="profit" fill="#38bdf8">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#34c759' : '#ff3b30'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <p className="text-gray-500 text-center">No data available.</p>
                        )}
                    </div>
                );
            }

            default:
                return (
                    <p className="text-gray-500 text-center">Please select an analysis type.</p>
                );
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <h1 className="text-3xl font-bold text-center mb-8">Extended Analysis Dashboard</h1>

            {/* Message Display */}
            {message && (
                <p className="text-red-500 text-sm font-medium mb-4">{message}</p>
            )}

            {/* Analysis Type Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Type:
                </label>
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
                    <option value="forecastResolution">Forecast by Resolution</option>
                </select>
            </div>

            {/* Steps Input (for Forecast and Forecast Resolution) */}
            {(analysisType === 'forecast' || analysisType === 'forecastResolution') && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Steps:
                    </label>
                    <input
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
            )}

            {/* Resolution Input (for Forecast Resolution) */}
            {analysisType === 'forecastResolution' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolution:
                    </label>
                    <select
                        value={subResolution}
                        onChange={(e) => setSubResolution(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="seasonal">Seasonal</option>
                    </select>
                </div>
            )}

            {/* Refresh Button */}
            <button
                onClick={fetchData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none mb-6"
            >
                Refresh Data
            </button>

            {/* Content Section */}
            {renderContent()}
        </div>
    );
};

export default ExtendedAnalysis;