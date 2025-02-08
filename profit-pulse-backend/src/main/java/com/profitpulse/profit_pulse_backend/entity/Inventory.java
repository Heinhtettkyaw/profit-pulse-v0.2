// src/main/java/com/profitpulse/profit_pulse_backend/entity/Inventory.java
package com.profitpulse.profit_pulse_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private int quantity;           // Current available quantity
    private double originalPrice;
    private String supplierName;
    private double generalFee;      // General fee for import (e.g. worker or transportation fee)

    private LocalDateTime importTimestamp;
}
