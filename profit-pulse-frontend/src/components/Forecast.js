// src/components/Forecast.js
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
            // Using relative path since proxy is configured
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
        <div>
            <h2>Forecasted Profit (Next {steps} Days)</h2>
            {message && <p>{message}</p>}
            <div>
                <label>
                    Forecast Steps (Days):
                    <input
                        type="number"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                        style={{ marginLeft: '5px', padding: '5px', width: '50px' }}
                    />
                </label>
                <button onClick={fetchForecast} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                    Refresh Forecast
                </button>
            </div>
            {forecastData && forecastData.length > 0 ? (
                <BarChart width={600} height={300} data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profit">
                        {forecastData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.profit < 0 ? 'red' : 'blue'} />
                        ))}
                    </Bar>
                </BarChart>
            ) : (
                <p>No forecast data available.</p>
            )}
        </div>
    );
};

export default Forecast;
