import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SalesRecorder = () => {
    const [inventory, setInventory] = useState([]);
    const [saleItems, setSaleItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState(0);
    const [soldPriceInput, setSoldPriceInput] = useState(0);
    const [buyerDetails, setBuyerDetails] = useState({
        buyerName: '',
        generalFee: 0
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'warning', 'error'
    const [receiptData, setReceiptData] = useState(null);

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

    const handleAddItem = () => {
        const selectedItem = inventory.find(i => i.id === parseInt(selectedItemId));
        const quantity = parseInt(quantityToAdd, 10);
        if (selectedItem && quantity > 0) {
            if (quantity > selectedItem.quantity) {
                setMessage(`Insufficient stock for ${selectedItem.itemName}. Available: ${selectedItem.quantity}`);
                setMessageType('warning');
                return;
            }
            setSaleItems([
                ...saleItems,
                {
                    inventoryId: selectedItem.id,
                    itemName: selectedItem.itemName, // capture item name for receipt
                    quantitySold: quantity,
                    soldPrice: soldPriceInput || selectedItem.originalPrice
                }
            ]);
            setSelectedItemId('');
            setQuantityToAdd(0);
            setSoldPriceInput(0);
            setMessage('');
            setMessageType('');
        }
    };

    const handleRecordSale = async () => {
        try {
            // Validate stock for all items
            const invalidItems = saleItems.filter(item => {
                const stock = inventory.find(i => i.id === item.inventoryId)?.quantity || 0;
                return item.quantitySold > stock;
            });
            if (invalidItems.length > 0) {
                setMessage("Insufficient stock for item(s): " +
                    invalidItems.map(i => i.inventoryId).join(', '));
                setMessageType('warning');
                return;
            }

            // Process each item individually
            const salePromises = saleItems.map(item =>
                API.post('/cashier/sales/record', {
                    inventoryId: item.inventoryId,
                    quantitySold: item.quantitySold,
                    soldPrice: item.soldPrice,
                    buyerName: buyerDetails.buyerName,
                    generalFee: buyerDetails.generalFee
                })
            );

            await Promise.all(salePromises);

            // Capture sale details for the receipt before clearing sale state
            setReceiptData({
                saleItems: [...saleItems],
                buyerDetails: { ...buyerDetails }
            });

            setMessage('Sale recorded successfully!');
            setMessageType('success');
            setShowReceipt(true);
            fetchInventory();
        } catch (error) {
            console.error('Error recording sale:', error);
            setMessage('Error recording sale.');
            setMessageType('error');
        } finally {
            setSaleItems([]);
            setBuyerDetails({ buyerName: '', generalFee: 0 });
        }
    };

    const calculateTotal = () => {
        const subtotal = saleItems.reduce((sum, item) =>
            sum + item.quantitySold * item.soldPrice, 0);
        return subtotal + parseFloat(buyerDetails.generalFee);
    };

    const calculateReceiptTotal = () => {
        if (!receiptData) return 0;
        const subtotal = receiptData.saleItems.reduce((sum, item) =>
            sum + item.quantitySold * item.soldPrice, 0);
        return subtotal + parseFloat(receiptData.buyerDetails.generalFee);
    };

    // Determine message styling based on messageType
    let messageStyle = "";
    if (messageType === 'success') {
        messageStyle = "bg-green-100 text-green-800";
    } else if (messageType === 'warning') {
        messageStyle = "bg-yellow-100 text-yellow-800";
    } else if (messageType === 'error') {
        messageStyle = "bg-red-100 text-red-800";
    }

    return (
        <div className="p-6">
            {message && (
                <div className={`p-4 mb-4 rounded-lg ${messageStyle}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Inventory List */}
                <div>
                    <h2 className="text-2xl mb-4">Inventory</h2>
                    {inventory.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Item</th>
                                <th className="px-4 py-2 border">Price</th>
                                <th className="px-4 py-2 border">Stock</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 border">{item.id}</td>
                                    <td className="px-4 py-2 border">{item.itemName}</td>
                                    <td className="px-4 py-2 border">{item.originalPrice} MMK</td>
                                    <td className="px-4 py-2 border">{item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No inventory items available</p>
                    )}
                </div>

                {/* Right Column - Sale Form */}
                <div>
                    <h2 className="text-2xl mb-4">Record Sale</h2>

                    {/* Product Selection */}
                    <div className="mb-4">
                        <label className="block mb-2">Product ID</label>
                        <select
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                            className="w-full px-4 py-2 border bg-[var(--primary-bg)] border-gray-300 rounded-lg focus:outline-none"
                        >
                            <option value="">Select Product</option>
                            {inventory.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.id} - {item.itemName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity and Price Inputs */}
                    <div className="mb-4">
                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantityToAdd}
                            onChange={(e) => setQuantityToAdd(e.target.value)}
                            className="w-full px-4 py-2 border bg-[var(--primary-bg)] border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Unit Price</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={soldPriceInput}
                            onChange={(e) => setSoldPriceInput(e.target.value)}
                            className="w-full px-4 py-2 border bg-[var(--primary-bg)] border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    {/* Add Item Button */}
                    <button
                        onClick={handleAddItem}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
                    >
                        Add Item
                    </button>

                    {/* Added Items List */}
                    {saleItems.length > 0 && (
                        <div>
                            <h3 className="text-lg mb-2">Added Items ({saleItems.length})</h3>
                            <ul className="list-inside list-disc mb-4">
                                {saleItems.map(item => (
                                    <li key={item.inventoryId}>
                                        {item.itemName}: {item.quantitySold} x {item.soldPrice} MMK
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Buyer Details */}
                    <div className="mb-4">
                        <label className="block mb-2">Buyer Name</label>
                        <input
                            type="text"
                            value={buyerDetails.buyerName}
                            onChange={(e) =>
                                setBuyerDetails({
                                    ...buyerDetails,
                                    buyerName: e.target.value
                                })
                            }
                            className="w-full px-4 py-2 border bg-[var(--primary-bg)] border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    {/* Service Fee */}
                    <div className="mb-4">
                        <label className="block mb-2">Service Fee</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={buyerDetails.generalFee}
                            onChange={(e) =>
                                setBuyerDetails({
                                    ...buyerDetails,
                                    generalFee: e.target.value
                                })
                            }
                            className="w-full px-4 py-2 border bg-[var(--primary-bg)] border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    {/* Total Preview */}
                    <div className="bg-[var(--primary-bg)] p-4 rounded-lg">
                        <p className="mb-2 font-semibold">
                            Subtotal: {saleItems.reduce((sum, item) => sum + item.quantitySold * item.soldPrice, 0)} MMK
                        </p>
                        <p className="mb-2">Service Fee: {buyerDetails.generalFee} MMK</p>
                        <hr className="my-2" />
                        <p className="text-lg font-bold">Total: {calculateTotal()} MMK</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setSaleItems([])}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleRecordSale}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Confirm Sale
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && receiptData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Sales Receipt</h2>
                        <ul>
                            {receiptData.saleItems.map(item => (
                                <li key={item.inventoryId}>
                                    {item.itemName} - {item.quantitySold} x {item.soldPrice} MMK
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <p>Buyer: {receiptData.buyerDetails.buyerName}</p>
                            <p>Service Fee: {receiptData.buyerDetails.generalFee} MMK</p>
                            <p className="font-bold">Total: {calculateReceiptTotal()} MMK</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowReceipt(false);
                                setReceiptData(null);
                            }}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Close Receipt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesRecorder;
