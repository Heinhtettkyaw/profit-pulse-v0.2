package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/transactions")
public class TransactionController {

    @Autowired
    private SalesRepository salesRepository;

    @GetMapping("/all")
    public List<Sale> getAllTransactions() {
        return salesRepository.findAll();
    }
}
