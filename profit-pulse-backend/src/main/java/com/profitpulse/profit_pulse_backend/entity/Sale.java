package com.profitpulse.profit_pulse_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    private int quantitySold;
    private double soldPrice;      // Price per unit sold
    private String buyerName;      // Buyer’s name
    private LocalDateTime timestamp;  // Sale date and time
}
