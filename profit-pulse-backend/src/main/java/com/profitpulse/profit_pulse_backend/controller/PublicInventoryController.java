package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class PublicInventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping("/all")
    public List<Inventory> getAllItems() {
        // Returns all inventory items (read-only) for cashier view.
        return inventoryRepository.findByQuantityGreaterThan(0);
    }
}
