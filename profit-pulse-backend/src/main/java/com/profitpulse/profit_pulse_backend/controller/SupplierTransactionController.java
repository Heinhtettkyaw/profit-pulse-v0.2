// src/main/java/com/profitpulse/profit_pulse_backend/controller/SupplierTransactionController.java
package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.SupplierTransaction;
import com.profitpulse.profit_pulse_backend.repository.SupplierTransactionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/report/suppliers")
public class SupplierTransactionController {

    @Autowired
    private SupplierTransactionRepository supplierTransactionRepository;

    @GetMapping
    public List<SupplierTransaction> getAllSupplierTransactions() {
        return supplierTransactionRepository.findAll();
    }
}
