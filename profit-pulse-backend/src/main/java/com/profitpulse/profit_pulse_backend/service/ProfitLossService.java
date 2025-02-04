package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfitLossService {
    @Autowired
    private SalesRepository salesRepository;

    public ProfitLossDTO calculateProfitLoss() {
        List<Sale> sales = salesRepository.findAll();

        double totalProfit = sales.stream().mapToDouble(sale -> {
            double originalPrice = sale.getInventory().getOriginalPrice();
            return (sale.getSoldPrice() - originalPrice) * sale.getQuantitySold();
        }).sum();

        double totalRevenue = sales.stream().mapToDouble(sale -> sale.getSoldPrice() * sale.getQuantitySold()).sum();
        double totalCost = sales.stream().mapToDouble(sale -> sale.getInventory().getOriginalPrice() * sale.getQuantitySold()).sum();

        return new ProfitLossDTO(totalRevenue, totalCost, totalProfit);
    }
}
