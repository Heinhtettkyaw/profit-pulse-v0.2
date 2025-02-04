package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.service.ProfitLossService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/profit-loss")
public class ProfitLossController {

    @Autowired
    private ProfitLossService profitLossService;

    @GetMapping
    public ResponseEntity<ProfitLossDTO> getProfitLoss() {
        return ResponseEntity.ok(profitLossService.calculateProfitLoss());
    }
}
