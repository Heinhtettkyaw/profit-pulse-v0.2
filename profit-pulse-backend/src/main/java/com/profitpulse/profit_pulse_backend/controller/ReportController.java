package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/report")
public class ReportController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SalesRepository salesRepository;

    // Return all sales transactions (buyer transactions)
    @GetMapping("/sales")
    public List<Sale> getAllSalesTransactions() {
        return salesRepository.findAll();
    }

    // Search sales by buyer name
    @GetMapping("/sales/search")
    public List<Sale> searchSales(@RequestParam("buyer") String buyer) {
        return salesRepository.findByBuyerNameContainingIgnoreCase(buyer);
    }

    // Return all supplier transactions (all inventory imports)
    @GetMapping("/suppliers")
    public List<Inventory> getAllSupplierTransactions() {
        return inventoryRepository.findAll();
    }

    // Search inventory imports by supplier name
    @GetMapping("/inventory/search")
    public List<Inventory> searchInventory(@RequestParam("supplier") String supplier) {
        return inventoryRepository.findBySupplierNameContainingIgnoreCase(supplier);
    }
}
