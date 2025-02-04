package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    public Inventory addItem(Inventory item) {
        // Set the import timestamp if not provided
        if (item.getImportTimestamp() == null) {
            item.setImportTimestamp(LocalDateTime.now());
        }
        return inventoryRepository.save(item);
    }

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    public Inventory updateItem(Long id, Inventory updatedItem) {
        Inventory existingItem = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setQuantity(updatedItem.getQuantity());
        existingItem.setOriginalPrice(updatedItem.getOriginalPrice());
        existingItem.setSupplierName(updatedItem.getSupplierName());
        // Keep the original importTimestamp unchanged.
        return inventoryRepository.save(existingItem);
    }

    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}
