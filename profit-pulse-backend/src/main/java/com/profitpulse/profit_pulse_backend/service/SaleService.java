// src/main/java/com/profitpulse/profit_pulse_backend/service/SaleService.java
package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.SaleDTO;
import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Sale recordSale(SaleDTO saleDTO) {
        Inventory inventory = inventoryRepository.findById(saleDTO.getInventoryId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (inventory.getQuantity() < saleDTO.getQuantitySold()) {
            throw new RuntimeException("Insufficient stock");
        }

        // Deduct sold quantity from inventory
        inventory.setQuantity(inventory.getQuantity() - saleDTO.getQuantitySold());
        inventoryRepository.save(inventory);

        // Create sale record and capture the original price from inventory at this moment
        Sale sale = new Sale();
        sale.setInventory(inventory);
        sale.setQuantitySold(saleDTO.getQuantitySold());
        sale.setSoldPrice(saleDTO.getSoldPrice());
        sale.setBuyerName(saleDTO.getBuyerName());
        sale.setGeneralFee(saleDTO.getGeneralFee());
        sale.setTimestamp(LocalDateTime.now());
        sale.setOriginalPrice(inventory.getOriginalPrice()); // Capture original price at sale time

        // Set cashier username from security context
        String cashierUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        sale.setCashierUsername(cashierUsername);

        return salesRepository.save(sale);
    }

    public List<Sale> getAllSales() {
        return salesRepository.findAll();
    }

    // (Other methods remain unchanged)
}
