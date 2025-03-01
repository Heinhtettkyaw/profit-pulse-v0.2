import React, { useState, useEffect } from 'react';
import API from '../services/api';

const InventoryManager = () => {
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ itemName: '', quantity:'', originalPrice:'', supplierName: '', generalFee: 0 });
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await API.get('/admin/inventory/all');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setMessage('Error fetching inventory.');
        }
    };

    const handleAddItem = async () => {
        try {
            await API.post('/admin/inventory/add', newItem);
            setMessage('Item added successfully!');
            setNewItem({ itemName: '', quantity: 0, originalPrice: 0, supplierName: '', generalFee: 0 });
            setShowAddForm(false); // Hide the form after adding an item
            fetchInventory();
        } catch (error) {
            console.error('Error adding item:', error);
            setMessage('Error adding item.');
        }
    };

    const handleEditItem = (item) => {
        setEditItem(item);
    };

    const handleUpdateItem = async () => {
        try {
            await API.put(`/admin/inventory/update/${editItem.id}`, editItem);
            setMessage('Item updated successfully!');
            setEditItem(null);
            fetchInventory();
        } catch (error) {
            console.error('Error updating item:', error);
            setMessage('Error updating item.');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            setMessage('Deletion cancelled.');
            return;
        }
        try {
            await API.delete(`/admin/inventory/delete/${id}`);
            setMessage('Item deleted successfully!');
            fetchInventory();
        } catch (error) {
            console.error('Error deleting item:', error);
            setMessage('Error deleting item.');
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Inventory Manager</h3>
            {message && <p className="text-green-500 mb-4">{message}</p>}

            {/* Add Item Button */}
            {!showAddForm && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none mb-4"
                >
                    Add New Item
                </button>
            )}

            {/* Add New Item Section (Toggleable) */}
            {showAddForm && (
                <div className="mb-6 bg-[var(--primary-bg)]  p-4 rounded shadow-md">
                    <h4 className="text-lg font-semibold mb-2">Add New Item</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium  text-[var(--primary-text)] mb-1">Item Name</label>
                            <input
                                type="text"
                                value={newItem.itemName}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, itemName: e.target.value })
                                }
                                className="w-full px-3 py-2 border  bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Quantity</label>
                            <input
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        quantity: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border  bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Original Price */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Original Price</label>
                            <input
                                type="number"
                                value={newItem.originalPrice}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        originalPrice: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Supplier Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Supplier Name</label>
                            <input
                                type="text"
                                value={newItem.supplierName}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, supplierName: e.target.value })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* General Fee */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">General Fee</label>
                            <input
                                type="number"
                                value={newItem.generalFee}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        generalFee: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Add Item Button */}
                        <div className="col-span-2 flex justify-between">
                            <button
                                onClick={handleAddItem}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Add Item
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Section */}
            {editItem && (
                <div className="mb-6  bg-[var(--primary-bg)] p-4 rounded shadow-md ">
                    <h4 className="text-lg font-semibold mb-2">Edit Item</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Item Name</label>
                            <input
                                type="text"
                                value={editItem.itemName}
                                onChange={(e) =>
                                    setEditItem({ ...editItem, itemName: e.target.value })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Quantity</label>
                            <input
                                type="number"
                                value={editItem.quantity}
                                onChange={(e) =>
                                    setEditItem({
                                        ...editItem,
                                        quantity: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Original Price */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Original Price</label>
                            <input
                                type="number"
                                value={editItem.originalPrice}
                                onChange={(e) =>
                                    setEditItem({
                                        ...editItem,
                                        originalPrice: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Supplier Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">Supplier Name</label>
                            <input
                                type="text"
                                value={editItem.supplierName}
                                onChange={(e) =>
                                    setEditItem({ ...editItem, supplierName: e.target.value })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* General Fee */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1">General Fee</label>
                            <input
                                type="number"
                                value={editItem.generalFee}
                                onChange={(e) =>
                                    setEditItem({
                                        ...editItem,
                                        generalFee: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-3 py-2 border bg-[var(--primary-bg)] rounded focus:outline-none focus:border-blue-500 appearance-none"
                            />
                        </div>
                        {/* Update and Cancel Buttons */}
                        <div className="col-span-2 flex justify-between">
                            <button
                                onClick={handleUpdateItem}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditItem(null)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory List Section */}
            <h4 className="text-lg font-semibold mb-2">Inventory List</h4>
            {inventory.length > 0 ? (
                <table className="min-w-full border  bg-[var(--primary-bg)]">
                    <thead className="">
                    <tr>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Item Name</th>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Quantity</th>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Original Price</th>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Supplier Name</th>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Imported On</th>
                        <th className="border  bg-[var(--primary-bg)] px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id} className="hover: bg-[var(--primary-bg)]">
                            <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.originalPrice}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.supplierName}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {item.importTimestamp
                                    ? new Date(item.importTimestamp).toLocaleString()
                                    : ''}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleEditItem(item)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:outline-none"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No items found.</p>
            )}
        </div>
    );
};

export default InventoryManager;