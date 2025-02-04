package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.dto.SaleDTO;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.service.SaleService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cashier/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping("/record")
    public ResponseEntity<Sale> recordSale(@RequestBody SaleDTO saleDTO) {
        return ResponseEntity.ok(saleService.recordSale(saleDTO));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
}
