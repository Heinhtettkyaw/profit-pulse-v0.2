// src/main/java/com/profitpulse/profit_pulse_backend/controller/InventoryController.java
package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.entity.SupplierTransaction;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SupplierTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SupplierTransactionRepository supplierTransactionRepository;

    // Add new inventory item and create a supplier transaction record (with original quantity)
    @PostMapping("/add")
    public Inventory addInventory(@RequestBody Inventory inventory) {
        if (inventory.getImportTimestamp() == null) {
            inventory.setImportTimestamp(LocalDateTime.now());
        }
        // Create a supplier transaction record with original values
        SupplierTransaction st = new SupplierTransaction();
        st.setItemName(inventory.getItemName());
        st.setQuantity(inventory.getQuantity());
        st.setOriginalPrice(inventory.getOriginalPrice());
        st.setSupplierName(inventory.getSupplierName());
        st.setGeneralFee(inventory.getGeneralFee());
        st.setImportTimestamp(inventory.getImportTimestamp());
        supplierTransactionRepository.save(st);

        return inventoryRepository.save(inventory);
    }

    // Get all in-stock inventory items (quantity > 0)
    @GetMapping("/all")
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findByQuantityGreaterThan(0);
    }

    // Update an existing inventory item
    @PutMapping("/update/{id}")
    public Inventory updateInventory(@PathVariable Long id, @RequestBody Inventory inventory) {
        Inventory existing = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        existing.setItemName(inventory.getItemName());
        existing.setQuantity(inventory.getQuantity());
        existing.setOriginalPrice(inventory.getOriginalPrice());
        existing.setSupplierName(inventory.getSupplierName());
        existing.setGeneralFee(inventory.getGeneralFee());
        // Do not update importTimestamp
        return inventoryRepository.save(existing);
    }

    // Optionally, remove out-of-stock items from the inventory (this does not affect supplier transaction records)
    @DeleteMapping("/remove-out-of-stock")
    public void removeOutOfStockItems() {
        List<Inventory> allItems = inventoryRepository.findAll();
        for (Inventory item : allItems) {
            if (item.getQuantity() == 0) {
                inventoryRepository.delete(item);
            }
        }
    }
}
