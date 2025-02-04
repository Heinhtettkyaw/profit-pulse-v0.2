package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.SaleDTO;
import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

        // Create and save sale record
        Sale sale = new Sale();
        sale.setInventory(inventory);
        sale.setQuantitySold(saleDTO.getQuantitySold());
        sale.setSoldPrice(saleDTO.getSoldPrice());
        sale.setBuyerName(saleDTO.getBuyerName());
        sale.setTimestamp(LocalDateTime.now());
        return salesRepository.save(sale);
    }

    public List<Sale> getAllSales() {
        return salesRepository.findAll();
    }
}
