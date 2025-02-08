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

    @ManyToOne
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    private int quantitySold;
    private double soldPrice;
    private String buyerName;
    private double generalFee;       // General fee for sale (worker/transport fee)

    // New field: store the original price at the time of sale
    private double originalPrice;

    private LocalDateTime timestamp;
    private String cashierUsername;
}
