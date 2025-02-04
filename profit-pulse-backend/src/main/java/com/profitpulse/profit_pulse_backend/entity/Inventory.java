package com.profitpulse.profit_pulse_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private int quantity;
    private double originalPrice;

    private String supplierName;             // Supplier’s name
    private LocalDateTime importTimestamp;   // When the item was imported
}
