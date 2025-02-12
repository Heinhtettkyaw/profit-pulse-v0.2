import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ProfitLossReport = () => {
    const [report, setReport] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

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

    const fetchMonthlyReport = async () => {
        if (year.trim() === '' || month.trim() === '') {
            setMessage('Please enter both year and month.');
            return;
        }
        try {
            const response = await API.get('/admin/profit-loss/monthly', {
                params: { year, month },
            });
            setReport(response.data);
            setMessage('');
        } catch (error) {
            console.error('Error fetching monthly report:', error);
            setMessage('Error fetching monthly report.');
        }
    };

    useEffect(() => {
        fetchOverallReport();
    }, []);

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Overall Profit & Loss Report</h3>

            {/* Search Inputs */}
            <div className="mb-6 flex flex-wrap items-center space-x-2">
                {/* Year Label and Input */}
                <label className="block text-sm font-medium text-gray-700 mr-2">Year (e.g., 2023):</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-40 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-24"
                />

                {/* Month Label and Input */}
                <label className="block text-sm font-medium text-gray-700 ml-2 mr-2">Month (1-12):</label>
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-40 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-16"
                />

                {/* Buttons */}
                <button
                    onClick={fetchMonthlyReport}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Search by Month
                </button>
                <button
                    onClick={fetchOverallReport}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none ml-2"
                >
                    Overall Report
                </button>
            </div>

            {/* Message Display */}
            {message && <p className="text-red-500 mb-4">{message}</p>}

            {/* Report Table */}
            {report ? (
                <div className="mt-6">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Investment Value</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Sale Value</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Overall Profit</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Profit (Profitable Sales)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Loss (Loss-making Sales)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Total Inventory Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{report.totalInvestmentValue}</td>
                            <td className="border border-gray-300 px-4 py-2">{report.totalSaleValue}</td>
                            <td className="border border-gray-300 px-4 py-2">{report.overallProfit}</td>
                            <td className="border border-gray-300 px-4 py-2">{report.profitOnly}</td>
                            <td className="border border-gray-300 px-4 py-2">{report.lossOnly}</td>
                            <td className="border border-gray-300 px-4 py-2">{report.totalInventoryValue}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 mt-6">Loading report...</p>
            )}
        </div>
    );
};

export default ProfitLossReport;