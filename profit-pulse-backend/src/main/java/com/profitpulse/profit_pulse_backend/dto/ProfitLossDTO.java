package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProfitLossDTO {
    private double totalRevenue;
    private double totalCost;
    private double totalProfit;
}
