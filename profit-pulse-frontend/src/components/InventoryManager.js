import React, { useState, useEffect } from 'react';
import API from '../services/api';

const InventoryManager = () => {
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ itemName: '', quantity: 0, originalPrice: 0, supplierName: '' });
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await API.get('/admin/inventory/all');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleAddItem = async () => {
        try {
            await API.post('/admin/inventory/add', newItem);
            setMessage('Item added successfully!');
            setNewItem({ itemName: '', quantity: 0, originalPrice: 0, supplierName: '' });
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
        <div>
            <h3>Inventory Manager</h3>
            {message && <p>{message}</p>}
            <div style={{ marginBottom: '20px' }}>
                <h4>Add New Item</h4>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="number"
                    placeholder="Original Price"
                    value={newItem.originalPrice}
                    onChange={(e) => setNewItem({ ...newItem, originalPrice: parseFloat(e.target.value) || 0 })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="Supplier Name"
                    value={newItem.supplierName}
                    onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleAddItem} style={{ padding: '5px 10px' }}>
                    Add Item
                </button>
            </div>

            {editItem && (
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h4>Edit Item</h4>
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={editItem.itemName}
                        onChange={(e) => setEditItem({ ...editItem, itemName: e.target.value })}
                        style={{ marginRight: '5px', padding: '5px' }}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={editItem.quantity}
                        onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) || 0 })}
                        style={{ marginRight: '5px', padding: '5px' }}
                    />
                    <input
                        type="number"
                        placeholder="Original Price"
                        value={editItem.originalPrice}
                        onChange={(e) => setEditItem({ ...editItem, originalPrice: parseFloat(e.target.value) || 0 })}
                        style={{ marginRight: '5px', padding: '5px' }}
                    />
                    <input
                        type="text"
                        placeholder="Supplier Name"
                        value={editItem.supplierName}
                        onChange={(e) => setEditItem({ ...editItem, supplierName: e.target.value })}
                        style={{ marginRight: '5px', padding: '5px' }}
                    />
                    <button onClick={handleUpdateItem} style={{ padding: '5px 10px', marginRight: '5px' }}>
                        Update
                    </button>
                    <button onClick={() => setEditItem(null)} style={{ padding: '5px 10px' }}>
                        Cancel
                    </button>
                </div>
            )}

            <h4>Inventory List</h4>
            {inventory.length > 0 ? (
                <table border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Original Price</th>
                        <th>Supplier Name</th>
                        <th>Imported On</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.originalPrice}</td>
                            <td>{item.supplierName}</td>
                            <td>{item.importTimestamp ? new Date(item.importTimestamp).toLocaleString() : ''}</td>
                            <td>
                                <button onClick={() => handleEditItem(item)} style={{ marginRight: '5px' }}>Edit</button>
                                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No items found.</p>
            )}
        </div>
    );
};

export default InventoryManager;
