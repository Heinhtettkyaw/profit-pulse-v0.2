// src/main/java/com/profitpulse/profit_pulse_backend/controller/PublicInventoryController.java
package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventory")
public class PublicInventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping("/all")
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findByQuantityGreaterThan(0);
    }
}
