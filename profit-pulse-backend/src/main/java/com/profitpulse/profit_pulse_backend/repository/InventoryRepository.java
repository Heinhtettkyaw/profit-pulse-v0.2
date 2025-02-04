package com.profitpulse.profit_pulse_backend.repository;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findBySupplierNameContainingIgnoreCase(String supplier);
    List<Inventory> findBySupplierNameContainingIgnoreCaseOrItemNameContainingIgnoreCase(String supplier, String itemName);

}
