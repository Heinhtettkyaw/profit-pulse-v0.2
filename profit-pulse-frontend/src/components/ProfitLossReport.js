import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfitLossReport = () => {
    const [report, setReport] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

    // Fetch overall report on mount
    useEffect(() => {
        fetchOverallReport();
    }, []);

    const fetchOverallReport = async () => {
        try {
            const response = await API.get('/admin/profit-loss');
            setReport(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching overall profit/loss report:', error);
            setMessage('Error fetching report.');
        }
    };

    const fetchMonthlyReport = async () => {
        if (year.trim() === '' || month.trim() === '') {
            setMessage('Please enter both year and month.');
            return;
        }
        try {
            const response = await API.get('/admin/profit-loss/monthly', {
                params: { year, month }
            });
            setReport(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching monthly profit/loss report:', error);
            setMessage('Error fetching monthly report.');
        }
    };

    return (
        <div>
            <h3>Overall Profit & Loss Report</h3>
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
                <button onClick={fetchMonthlyReport} style={{ padding: '5px 10px' }}>
                    Search by Month
                </button>
                <button onClick={fetchOverallReport} style={{ padding: '5px 10px', marginLeft: '5px' }}>
                    Overall Report
                </button>
            </div>
            {message && <p>{message}</p>}
            {report ? (
                <div style={{ marginTop: '10px' }}>
                    <p>Total Revenue: {report.totalRevenue}</p>
                    <p>Total Cost: {report.totalCost}</p>
                    <p>Total Profit: {report.totalProfit}</p>
                </div>
            ) : (
                <p>Loading report...</p>
            )}
        </div>
    );
};

export default ProfitLossReport;
