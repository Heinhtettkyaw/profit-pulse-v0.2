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
    private int quantity;
    private double originalPrice;
    private String supplierName;
    private double generalFee; // General fee for import (worker/transport fee)

    private LocalDateTime importTimestamp;

    // Link to the supplier transaction record (set when adding inventory)
    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_transaction_id")
    private SupplierTransaction supplierTransaction;
}
