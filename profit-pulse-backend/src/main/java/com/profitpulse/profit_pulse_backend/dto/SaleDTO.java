// src/main/java/com/profitpulse/profit_pulse_backend/dto/SaleDTO.java
package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private Long inventoryId;
    private int quantitySold;
    private double soldPrice;
    private String buyerName;
    private double generalFee; // General fee for sale
}
