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

        inventory.setQuantity(inventory.getQuantity() - saleDTO.getQuantitySold());
        inventoryRepository.save(inventory);

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

    // New method: Get sales for a specific month filtered by profit sign.
    public List<Sale> getSalesTransactionsByMonthAndProfit(int year, int month, boolean profitPositive) {
        List<Sale> sales = salesRepository.findAll();
        return sales.stream().filter(sale -> {
            if (sale.getTimestamp() == null) return false;
            if (sale.getTimestamp().getYear() != year || sale.getTimestamp().getMonthValue() != month) return false;
            double profit = (sale.getSoldPrice() - sale.getInventory().getOriginalPrice()) * sale.getQuantitySold();
            return profitPositive ? profit > 0 : profit < 0;
        }).toList();
    }
}
