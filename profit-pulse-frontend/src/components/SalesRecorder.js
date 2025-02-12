// src/components/SalesRecorder.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SalesRecorder = () => {
    const [inventory, setInventory] = useState([]);
    const [sale, setSale] = useState({
        inventoryId: '',
        quantitySold: 0,
        soldPrice: 0,
        buyerName: '',
        generalFee: 0,
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await API.get('/inventory/all');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleChange = (e) => {
        setSale({ ...sale, [e.target.name]: e.target.value });
    };

    const handleRecordSale = async () => {
        try {
            const selectedItem = inventory.find((item) => item.id === parseInt(sale.inventoryId));
            if (!selectedItem) {
                setMessage('Invalid inventory ID.');
                return;
            }
            if (parseInt(sale.quantitySold) > selectedItem.quantity) {
                setMessage(`Cannot sell more than available stock (${selectedItem.quantity}).`);
                return;
            }
            await API.post('/cashier/sales/record', {
                inventoryId: parseInt(sale.inventoryId),
                quantitySold: parseInt(sale.quantitySold),
                soldPrice: parseFloat(sale.soldPrice),
                buyerName: sale.buyerName,
                generalFee: parseFloat(sale.generalFee),
            });
            setMessage('Sale recorded successfully!');
            setSale({ inventoryId: '', quantitySold: 0, soldPrice: 0, buyerName: '', generalFee: 0 });
            fetchInventory();
        } catch (error) {
            console.error('Error recording sale:', error);
            setMessage('Error recording sale.');
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-2xl font-bold mb-4">Sales Recorder</h3>
            {message && (
                <p
                    className={`mb-4 ${
                        message.includes('successful') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}
            <div className="flex space-x-6">
                {/* Available Inventory Section */}
                <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Available Inventory</h4>
                    {inventory.length > 0 ? (
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Original Price</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">In-Stock</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.originalPrice}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No inventory items available.</p>
                    )}
                </div>

                {/* Record Sale Section */}
                <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">Record a Sale</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory ID</label>
                            <input
                                type="number"
                                name="inventoryId"
                                value={sale.inventoryId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
                            <input
                                type="number"
                                name="quantitySold"
                                value={sale.quantitySold}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sold Price Per Each Item</label>
                            <input
                                type="number"
                                name="soldPrice"
                                value={sale.soldPrice}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                            <input
                                type="text"
                                name="buyerName"
                                value={sale.buyerName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">General Fee</label>
                            <input
                                type="number"
                                name="generalFee"
                                value={sale.generalFee}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleRecordSale}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                        >
                            Record Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRecorder;