// src/components/TrendAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendAnalysis = () => {
    const [trendData, setTrendData] = useState([]);
    const [message, setMessage] = useState('');

    // Update the URL to match the Flask endpoint (/analysis/trend)
    const fetchTrend = async () => {
        try {
            const response = await axios.get('http://localhost:5000/analysis/trend');
            setTrendData(response.data.trend);
            setMessage('');
        } catch (error) {
            console.error('Error fetching trend data:', error);
            setMessage('Error fetching trend data.');
        }
    };

    useEffect(() => {
        fetchTrend();
    }, []);

    return (
        <div>
            <h2>Profit Trend Analysis</h2>
            {message && <p>{message}</p>}
            {trendData && trendData.length > 0 ? (
                <LineChart width={600} height={300} data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#8884d8" />
                </LineChart>
            ) : (
                <p>No trend data available.</p>
            )}
        </div>
    );
};

export default TrendAnalysis;
