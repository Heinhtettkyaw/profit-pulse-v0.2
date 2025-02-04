// src/main/java/com/profitpulse/profit_pulse_backend/dto/ProfitLossDTO.java
package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfitLossDTO {
    private double totalInvestmentValue; // Sum over sales: (originalPrice × quantitySold)
    private double totalSaleValue;         // Sum over sales: (soldPrice × quantitySold)
    private double overallProfit;          // totalSaleValue - totalInvestmentValue
    private double profitOnly;             // Sum of profits for profitable sales
    private double lossOnly;               // Sum of losses (as a positive number) for loss-making sales
    private double totalInventoryValue;    // Value of all unsold inventory: ∑(originalPrice × quantity available)
}
