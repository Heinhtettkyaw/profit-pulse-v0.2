// src/main/java/com/profitpulse/profit_pulse_backend/repository/InventoryRepository.java
package com.profitpulse.profit_pulse_backend.repository;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    // Return only inventory items with quantity greater than 0 (in-stock)
    List<Inventory> findByQuantityGreaterThan(int quantity);

    // New method: search by supplier name OR by item name (ignoring case)
    List<Inventory> findBySupplierNameContainingIgnoreCaseOrItemNameContainingIgnoreCase(String supplier, String itemName);
}
