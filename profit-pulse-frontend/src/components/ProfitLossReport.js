import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
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
        if (!year || !month) {
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

    const formatCurrency = (value) =>
        `$${parseFloat(value).toLocaleString('en-US')}`;

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Profit & Loss Report</h3>

            <div className="mb-6 flex flex-wrap items-center space-x-2">
                <label className="text-sm font-medium text-[var(--j-color)] mr-2">Year (e.g., 2023):</label>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-40 px-3 py-1 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                />

                <label className="text-sm font-medium text-[var(--j-color)] ml-2 mr-2">Month (1-12):</label>
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-40 px-3 py-1 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 w-16"
                />

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

            {message && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {message}
                </div>
            )}

            {report && (
                <div className="space-y-8">
                    <div className=" bg-[var(--primary-bg)] p-4 rounded shadow">
                        <h4 className="text-lg font-semibold mb-4">Key Insights</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Total Investment Value</p>
                                <p className="text-xl font-bold text-green-500 mt-3">${report.totalInvestmentValue}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Total Sale Value</p>
                                <p className="text-xl font-bold text-green-500 mt-3">${report.totalSaleValue}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Total Profit</p>
                                <p className="text-xl font-bold text-green-500 mt-3">${report.profitOnly}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Total Loss</p>
                                <p className="text-xl font-bold text-red-500 mt-3">-${report.lossOnly}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Inventory Value</p>
                                <p className="text-xl font-bold text-green-500 mt-3">${report.totalInventoryValue}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[var(--j-color)]">Overall Profit</p>
                                <p className={`text-xl font-bold mt-3 ${report.overallProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {report.overallProfit >= 0 ? '+' : '-'}${Math.abs(report.overallProfit).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--primary-bg)] p-4 rounded shadow">
                        <h4 className="text-lg font-semibold mb-4">Detailed Breakdown</h4>
                        <div className="flex items-center space-x-4">
                            <div className="w-1/2">
                                <h5 className="text-md font-medium mb-2">Profit Distribution</h5>
                                <div className="h-40">

                                    {/*<BarChart width={200} height={200} data={[{name: 'Profit', value: report.profitOnly}, {name: 'Loss', value: report.lossOnly}]}>*/}
                                    {/*    <CartesianGrid stroke="#eee" />*/}
                                    {/*    <XAxis dataKey="name" />*/}
                                    {/*    <YAxis />*/}
                                    {/*    <Tooltip />*/}
                                    {/*    <Bar dataKey="value" fill={report.overallProfit >= 0 ? '#82ca9d' : '#ef4444'} />*/}
                                    {/*</BarChart>*/}
                                    <BarChart
                                        width={200}
                                        height={200}
                                        data={[
                                            { name: 'Profit', value: report.profitOnly },
                                            { name: 'Loss', value: report.lossOnly },
                                        ]}
                                    >
                                        <CartesianGrid stroke="#eee" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value">
                                            {[
                                                { name: 'Profit', value: report.profitOnly },
                                                { name: 'Loss', value: report.lossOnly },
                                            ].map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.name === 'Profit' ? '#28a745' : '#ef4444'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>


                                </div>
                            </div>
                            <div className="w-1/2">
                                <h5 className="text-md font-bold mb-2">Financial Summary</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--j-color)]">Total Investment</span>
                                        <span className="font-medium text-green-500">${report.totalInvestmentValue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--j-color)]">Total Sales</span>
                                        <span className={`font-medium ${report.totalSaleValue > report.totalInvestmentValue ? 'text-green-500' : 'text-red-500'}`}>
                                            ${report.totalSaleValue}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--j-color)]">Inventory Value</span>
                                        <span className="font-medium text-green-500">${report.totalInventoryValue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!report && !message && (
                <p className="text-gray-500 mt-6">Loading report...</p>
            )}
        </div>
    );
};

export default ProfitLossReport;