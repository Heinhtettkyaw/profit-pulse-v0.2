import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfitLossReport = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const response = await API.get('/admin/profit-loss');
            setReport(response.data);
        } catch (error) {
            console.error('Error fetching profit/loss report:', error);
        }
    };

    return (
        <div>
            <h3>Profit & Loss Report</h3>
            {report ? (
                <div>
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
