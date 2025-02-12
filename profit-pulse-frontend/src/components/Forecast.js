import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Forecast = () => {
    const [forecastData, setForecastData] = useState([]);
    const [steps, setSteps] = useState(5);
    const [message, setMessage] = useState('');

    // Fetch forecast data from the Flask forecasting endpoint.
    const fetchForecast = async () => {
        try {
            const response = await axios.get(`/forecast?steps=${steps}`);
            setForecastData(response.data.forecast);
            setMessage('');
        } catch (error) {
            console.error('Error fetching forecast:', error);
            setMessage('Error fetching forecast data.');
        }
    };

    useEffect(() => {
        fetchForecast();
    }, [steps]);

    return (
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Forecasted Profit (Next {steps} Days)</h2>

            {/* Message Display */}
            {message && <p className="text-red-500 text-sm font-medium mb-4">{message}</p>}

            {/* Input and Button Section */}
            <div className="mb-6 flex items-center space-x-2">
                {/* Steps Input */}
                <label className="block text-sm font-medium text-gray-700">
                    Forecast Steps (Days):
                    <input
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                        className="ml-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-16"
                    />
                </label>

                {/* Refresh Button */}
                <button
                    onClick={fetchForecast}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Refresh Forecast
                </button>
            </div>

            {/* Bar Chart or No Data Message */}
            {forecastData.length > 0 ? (
                <BarChart width={600} height={300} data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profit">
                        {forecastData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.profit < 0 ? 'red' : 'blue'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            ) : (
                <p className="text-gray-500 text-center mt-6">No forecast data available.</p>
            )}
        </div>
    );
};

export default Forecast;