// src/main/java/com/profitpulse/profit_pulse_backend/controller/ReportController.java
package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.entity.SupplierTransaction;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import com.profitpulse.profit_pulse_backend.repository.SupplierTransactionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/report")
public class ReportController {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private SupplierTransactionRepository supplierTransactionRepository;

    // Get all sale transactions
    @GetMapping("/sales")
    public List<Sale> getAllSalesTransactions() {
        return salesRepository.findAll();
    }

    // Search sale transactions by buyer or item name
    @GetMapping("/sales/search")
    public List<Sale> searchSales(@RequestParam("query") String query) {
        return salesRepository.findByBuyerNameContainingIgnoreCaseOrItemNameContainingIgnoreCase(query, query);
    }

//    // Get all supplier transactions
//    @GetMapping("/suppliers")
//    public List<SupplierTransaction> getAllSupplierTransactions() {
//        return supplierTransactionRepository.findAll();
//    }

    // Search supplier transactions by supplier or item name
    @GetMapping("/inventory/search")
    public List<SupplierTransaction> searchSupplierTransactions(@RequestParam("query") String query) {
        return supplierTransactionRepository.findBySupplierNameContainingIgnoreCaseOrItemNameContainingIgnoreCase(query, query);
    }
}
