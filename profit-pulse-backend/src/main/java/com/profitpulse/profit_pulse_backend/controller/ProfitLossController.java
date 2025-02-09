package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.dto.MonthlyProfitData;
import com.profitpulse.profit_pulse_backend.service.ProfitLossService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import java.util.List;
@RestController
@RequestMapping("/admin/profit-loss")
public class ProfitLossController {

    @Autowired
    private ProfitLossService profitLossService;

    // Overall report
    @GetMapping
    public ResponseEntity<ProfitLossDTO> getOverallProfitLoss() {
        return ResponseEntity.ok(profitLossService.calculateProfitLoss());
    }
    @GetMapping("/monthly")
    public ProfitLossDTO getMonthlyProfitLoss(@RequestParam("year") int year,
                                              @RequestParam("month") int month) {
        return profitLossService.calculateMonthlyProfitLoss(year, month);
    }

    // Monthly Sales Transactions (filtered by profitPositive flag)
    @GetMapping("/monthly/sales")
    public List<Sale> getMonthlySales(@RequestParam("year") int year,
                                      @RequestParam("month") int month,
                                      @RequestParam("profitPositive") boolean profitPositive) {
        return profitLossService.getMonthlySales(year, month, profitPositive);
    }

    // Aggregated monthly profit data for bar chart
    @GetMapping("/monthly/bar")
    public List<MonthlyProfitData> getMonthlyBarChartData() {
        return profitLossService.getMonthlyProfitData();
    }
    // Monthly report: expects "year" and "month" query parameters
//    @GetMapping("/monthly")
//    public ResponseEntity<ProfitLossDTO> getMonthlyProfitLoss(@RequestParam("year") int year, @RequestParam("month") int month) {
//        return ResponseEntity.ok(profitLossService.calculateMonthlyProfitLoss(year, month));
//    }
    // Get aggregated monthly profit data for bar chart
//    @GetMapping("/monthly/bar")
//    public ResponseEntity<List<MonthlyProfitData>> getMonthlyProfitData() {
//        List<MonthlyProfitData> data = profitLossService.getMonthlyProfitData();
//        return ResponseEntity.ok(data);
//    }
}
