import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfitLossReport = () => {
    const [report, setReport] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

    // On mount, fetch overall report
    useEffect(() => {
        fetchOverallReport();
    }, []);

    const fetchOverallReport = async () => {
        try {
            const response = await API.get('/admin/profit-loss');
            setReport(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching overall report:', error);
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
            console.error('Error fetching monthly report:', error);
            setMessage('Error fetching monthly report.');
        }
    };

    return (
        <div>
            <h3>Profit & Loss Report</h3>
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
                <div style={{ marginTop: '20px' }}>
                    <table border="1" cellPadding="5">
                        <thead>
                        <tr>
                            <th>Total Investment Value</th>
                            <th>Total Sale Value</th>
                            <th>Overall Profit</th>
                            <th>Total Profit (Profitable Sales)</th>
                            <th>Total Loss (Loss-making Sales)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{report.totalInvestmentValue}</td>
                            <td>{report.totalSaleValue}</td>
                            <td>{report.overallProfit}</td>
                            <td>{report.profitOnly}</td>
                            <td>{report.lossOnly}</td>
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
