// src/components/ProfitLossReport.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfitLossReport = () => {
    const [report, setReport] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

    // Fetch overall profit/loss report
    const fetchOverallReport = async () => {
        try {
            const response = await API.get('/admin/profit-loss');
            setReport(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching overall report:', error);
            setMessage('Error fetching overall report.');
        }
    };

    // Fetch monthly profit/loss report
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
            console.error('Error fetching monthly report:', error);
            setMessage('Error fetching monthly report.');
        }
    };

    useEffect(() => {
        // Load overall report by default
        fetchOverallReport();
    }, []);

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
                <button onClick={fetchMonthlyReport} style={{ padding: '5px 10px', marginRight: '5px' }}>
                    Search by Month
                </button>
                <button onClick={fetchOverallReport} style={{ padding: '5px 10px' }}>
                    Overall Report
                </button>
            </div>
            {message && <p>{message}</p>}
            {report ? (
                <div style={{ marginTop: '20px' }}>
                    <table border="1" cellPadding="5">
                        <thead>
                        <tr>
                            <th>Current Total Inventory Value</th>
                            <th>Total Original Price(for sold products)</th>
                            <th>Total Sale Value</th>
                            <th>Total Profit (Profitable Sales)</th>
                            <th>Total Loss (Loss-making Sales)</th>
                            <th>Overall Profit</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{report.totalInventoryValue}</td>
                            <td>{report.totalInvestmentValue}</td>
                            <td>{report.totalSaleValue}</td>
                            <td>{report.profitOnly}</td>
                            <td>{report.lossOnly}</td>
                            <td>{report.overallProfit}</td>

                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading report...</p>
            )}
        </div>
    );
};

export default ProfitLossReport;
