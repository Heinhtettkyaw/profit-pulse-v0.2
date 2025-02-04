package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfitLossDTO {
    // Total investment value = sum(originalPrice * quantitySold)
    private double totalInvestmentValue;
    // Total sale value = sum(soldPrice * quantitySold)
    private double totalSaleValue;
    // Overall profit = totalSaleValue - totalInvestmentValue
    private double overallProfit;
    // Total profit from profitable sales (soldPrice > originalPrice)
    private double profitOnly;
    // Total loss from loss-making sales (soldPrice < originalPrice)
    private double lossOnly;
}
