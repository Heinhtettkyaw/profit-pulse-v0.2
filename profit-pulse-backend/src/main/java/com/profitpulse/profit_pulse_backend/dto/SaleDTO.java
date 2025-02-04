package com.profitpulse.profit_pulse_backend.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SaleDTO {
    private Long inventoryId;
    private int quantitySold;
    private double soldPrice;
    private String buyerName;
}
