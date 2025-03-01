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
        <div className="p-8 space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">Point of Sale</h3>
            {message && (
                <div className={`mt-4 p-4 rounded-lg ${message.includes('successful') ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Inventory List */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-2xl font-semibold mb-4">Inventory</h4>
                    {inventory.length > 0 ? (
                        <div className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {inventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${item.originalPrice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No inventory items available</p>
                    )}
                </div>

                {/* Right Column - Sale Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-2xl font-semibold mb-6">Record Sale</h4>

                    <div className="space-y-4">
                        {/* Product Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                            <input
                                type="number"
                                value={sale.inventoryId}
                                onChange={(e) => setSale({ ...sale, inventoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Quantity and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={sale.quantitySold}
                                    onChange={(e) => setSale({ ...sale, quantitySold: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={sale.soldPrice}
                                    onChange={(e) => setSale({ ...sale, soldPrice: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Buyer Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name</label>
                            <input
                                type="text"
                                value={sale.buyerName}
                                onChange={(e) => setSale({ ...sale, buyerName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Fees */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee</label>
                            <input
                                type="number"
                                step="0.01"
                                value={sale.generalFee}
                                onChange={(e) => setSale({ ...sale, generalFee: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Total Preview */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <p className="text-gray-700">Subtotal</p>
                                <p className="text-gray-700">
                                    {Number(sale.soldPrice) * Number(sale.quantitySold)} MMK
                                </p>

                            </div>
                            <div className="flex justify-between mb-2">
                                <p className="text-gray-700">Service Fee</p>
                                <p className="text-gray-700">{sale.generalFee} MMK</p>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <p>Total</p>
                                <p>{Number(sale.soldPrice) * Number(sale.quantitySold) + Number(sale.generalFee)} MMK</p>

                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleRecordSale}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Confirm Sale
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SalesRecorder;