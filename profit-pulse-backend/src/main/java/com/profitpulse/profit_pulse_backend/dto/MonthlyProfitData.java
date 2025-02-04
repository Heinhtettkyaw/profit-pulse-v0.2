package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyProfitData {
    private String month;  // Format: "YYYY-MM"
    private double profit;
}
