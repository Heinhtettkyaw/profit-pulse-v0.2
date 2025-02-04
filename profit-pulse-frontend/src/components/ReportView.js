// src/components/ReportView.js
import React, { useState } from 'react';
import API from '../services/api';

const ReportView = () => {
    const [buyerQuery, setBuyerQuery] = useState('');
    const [buyerResults, setBuyerResults] = useState([]);
    const [supplierQuery, setSupplierQuery] = useState('');
    const [supplierResults, setSupplierResults] = useState([]);

    const handleSearchBuyer = async () => {
        try {
            const response = await API.get('/admin/report/sales/search', {
                params: { buyer: buyerQuery }
            });
            setBuyerResults(response.data);
        } catch (error) {
            console.error('Error searching sales by buyer:', error);
        }
    };

    const handleSearchSupplier = async () => {
        try {
            const response = await API.get('/admin/report/inventory/search', {
                params: { supplier: supplierQuery }
            });
            setSupplierResults(response.data);
        } catch (error) {
            console.error('Error searching inventory by supplier:', error);
        }
    };

    return (
        <div>
            <h3>Report View</h3>

            <div style={{ marginBottom: '20px' }}>
                <h4>Search Sales Transactions by Buyer</h4>
                <input
                    type="text"
                    placeholder="Enter Buyer Name"
                    value={buyerQuery}
                    onChange={(e) => setBuyerQuery(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleSearchBuyer} style={{ padding: '5px 10px' }}>
                    Search
                </button>
                {buyerResults.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <h5>Sales Results:</h5>
                        <table border="1" cellPadding="5">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Item Name</th>
                                <th>Quantity Sold</th>
                                <th>Sold Price</th>
                                <th>Buyer Name</th>
                                <th>Timestamp</th>
                                <th>Profit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {buyerResults.map((sale) => {
                                const originalPrice = sale.inventory.originalPrice;
                                const profit = (sale.soldPrice - originalPrice) * sale.quantitySold;
                                return (
                                    <tr key={sale.id}>
                                        <td>{sale.id}</td>
                                        <td>{sale.inventory.itemName}</td>
                                        <td>{sale.quantitySold}</td>
                                        <td>{sale.soldPrice}</td>
                                        <td>{sale.buyerName}</td>
                                        <td>{sale.timestamp ? new Date(sale.timestamp).toLocaleString() : ''}</td>
                                        <td>{profit}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <h4>Search Inventory Imports by Supplier</h4>
                <input
                    type="text"
                    placeholder="Enter Supplier Name"
                    value={supplierQuery}
                    onChange={(e) => setSupplierQuery(e.target.value)}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleSearchSupplier} style={{ padding: '5px 10px' }}>
                    Search
                </button>
                {supplierResults.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <h5>Inventory Results:</h5>
                        <table border="1" cellPadding="5">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Original Price</th>
                                <th>Supplier Name</th>
                                <th>Imported On</th>
                            </tr>
                            </thead>
                            <tbody>
                            {supplierResults.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.originalPrice}</td>
                                    <td>{item.supplierName}</td>
                                    <td>{item.importTimestamp ? new Date(item.importTimestamp).toLocaleString() : ''}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportView;
