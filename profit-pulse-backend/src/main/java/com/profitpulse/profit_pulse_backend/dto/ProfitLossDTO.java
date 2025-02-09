// src/main/java/com/profitpulse/profit_pulse_backend/dto/ProfitLossDTO.java
package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfitLossDTO {
    private double totalInvestmentValue;
    private double totalSaleValue;
    private double overallProfit;
    private double profitOnly;
    private double lossOnly;
    private double totalInventoryValue;
}
