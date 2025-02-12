// src/main/java/com/profitpulse/profit_pulse_backend/service/SaleService.java
package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.SaleDTO;
import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.entity.SupplierTransaction;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import com.profitpulse.profit_pulse_backend.repository.SupplierTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SupplierTransactionRepository supplierTransactionRepository;

    @Transactional
    public Sale recordSale(SaleDTO saleDTO) {
        // Retrieve the Inventory record.
        Inventory inventory = inventoryRepository.findById(saleDTO.getInventoryId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (inventory.getQuantity() < saleDTO.getQuantitySold()) {
            throw new RuntimeException("Insufficient stock");
        }

        // Deduct sold quantity.
        int newQuantity = inventory.getQuantity() - saleDTO.getQuantitySold();
        inventory.setQuantity(newQuantity);
        inventoryRepository.save(inventory);

        // Retrieve the supplier transaction record from Inventory.
        SupplierTransaction st = inventory.getSupplierTransaction();
        // Compute the sale fee as 5% of the provided sold price.
//        double saleFee = saleDTO.getSoldPrice() * 0.05;
//        // Adjust the sold price by adding the fee.
//        double adjustedSoldPrice = saleDTO.getSoldPrice() + saleFee;

        // Create a new Sale record capturing item details at sale time.
        Sale sale = new Sale();
        sale.setItemName(inventory.getItemName());
        sale.setOriginalPrice(inventory.getOriginalPrice()); // This is the adjusted price from inventory.
        sale.setQuantitySold(saleDTO.getQuantitySold());
        sale.setSoldPrice(saleDTO.getSoldPrice());
        sale.setBuyerName(saleDTO.getBuyerName());
        sale.setGeneralFee(saleDTO.getGeneralFee());
        sale.setTimestamp(LocalDateTime.now());
        String cashierUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        sale.setCashierUsername(cashierUsername);
        // Calculate profit: (adjustedSoldPrice - inventory.originalPrice) * quantitySold.
        double profit = (saleDTO.getSoldPrice() - inventory.getOriginalPrice()) * saleDTO.getQuantitySold();
        sale.setProfit(profit);

        sale = salesRepository.save(sale);


        // If inventory is now sold out, delete the Inventory record.
        if (newQuantity == 0) {
            inventoryRepository.delete(inventory);
        }

        return sale;
    }

    public List<Sale> getAllSales() {
        return salesRepository.findAll();
    }
}
