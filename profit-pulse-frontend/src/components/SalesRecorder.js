import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SalesRecorder = () => {
    const [inventory, setInventory] = useState([]);
    const [sale, setSale] = useState({ inventoryId: '', quantitySold: 0, soldPrice: 0, buyerName: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // Get read-only inventory list from public endpoint
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
            // Validate that quantity sold does not exceed available stock.
            const selectedItem = inventory.find(item => item.id === parseInt(sale.inventoryId));
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
            });
            setMessage('Sale recorded successfully!');
            setSale({ inventoryId: '', quantitySold: 0, soldPrice: 0, buyerName: '' });
            fetchInventory();
        } catch (error) {
            console.error('Error recording sale:', error);
            setMessage('Error recording sale.');
        }
    };

    return (
        <div>
            <h3>Sales Recorder</h3>
            {message && <p>{message}</p>}

            <h4>Available Inventory</h4>
            {inventory.length > 0 ? (
                <table border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Original Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.itemName}</td>
                            <td>{item.originalPrice}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No inventory items available.</p>
            )}

            <h4>Record a Sale</h4>
            <div>
                <input
                    type="number"
                    name="inventoryId"
                    placeholder="Inventory ID"
                    value={sale.inventoryId}
                    onChange={handleChange}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="number"
                    name="quantitySold"
                    placeholder="Quantity Sold"
                    value={sale.quantitySold}
                    onChange={handleChange}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="number"
                    name="soldPrice"
                    placeholder="Sold Price"
                    value={sale.soldPrice}
                    onChange={handleChange}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <input
                    type="text"
                    name="buyerName"
                    placeholder="Buyer Name"
                    value={sale.buyerName}
                    onChange={handleChange}
                    style={{ marginRight: '5px', padding: '5px' }}
                />
                <button onClick={handleRecordSale} style={{ padding: '5px 10px' }}>
                    Record Sale
                </button>
            </div>
        </div>
    );
};

export default SalesRecorder;
