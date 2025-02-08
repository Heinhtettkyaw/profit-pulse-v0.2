// src/main/java/com/profitpulse/profit_pulse_backend/entity/SupplierTransaction.java
package com.profitpulse.profit_pulse_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class SupplierTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private int quantity;
    private double originalPrice;
    private String supplierName;
    private double generalFee; // General fee for import
    private LocalDateTime importTimestamp;
}
