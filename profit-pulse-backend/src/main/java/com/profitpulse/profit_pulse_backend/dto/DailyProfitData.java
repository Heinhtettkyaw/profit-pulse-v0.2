// src/main/java/com/profitpulse/profit_pulse_backend/dto/DailyProfitData.java
package com.profitpulse.profit_pulse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DailyProfitData {
    private String date; // Format: "YYYY-MM-DD"
    private double profit;
}
