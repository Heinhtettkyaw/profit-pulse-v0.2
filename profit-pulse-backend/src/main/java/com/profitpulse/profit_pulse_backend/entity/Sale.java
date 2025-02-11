// src/main/java/com/profitpulse/profit_pulse_backend/entity/Sale.java
package com.profitpulse.profit_pulse_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Captured fields from Inventory at sale time
    private String itemName;         // Captured item name
    private double originalPrice;    // Captured original price

    private int quantitySold;
    private double soldPrice;
    private String buyerName;
    private double generalFee;       // General fee for sale (worker/transport fee)

    private LocalDateTime timestamp;
    private String cashierUsername;
    private double profit;
}
