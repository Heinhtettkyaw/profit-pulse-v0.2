package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.dto.MonthlyProfitData;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.service.ProfitLossService;
import com.profitpulse.profit_pulse_backend.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/profit-loss")
public class ProfitLossController {

    @Autowired
    private ProfitLossService profitLossService;

    @Autowired
    private SaleService saleService;

    // Overall profit/loss report
    @GetMapping
    public ResponseEntity<ProfitLossDTO> getOverallProfitLoss() {
        return ResponseEntity.ok(profitLossService.calculateProfitLoss());
    }

    // Monthly overall profit/loss report
    @GetMapping("/monthly")
    public ResponseEntity<ProfitLossDTO> getMonthlyProfitLoss(@RequestParam("year") int year, @RequestParam("month") int month) {
        return ResponseEntity.ok(profitLossService.calculateMonthlyProfitLoss(year, month));
    }

    // Get aggregated monthly profit data for bar chart
    @GetMapping("/monthly/bar")
    public ResponseEntity<List<MonthlyProfitData>> getMonthlyProfitData() {
        List<MonthlyProfitData> data = profitLossService.getMonthlyProfitData();
        return ResponseEntity.ok(data);
    }
}
