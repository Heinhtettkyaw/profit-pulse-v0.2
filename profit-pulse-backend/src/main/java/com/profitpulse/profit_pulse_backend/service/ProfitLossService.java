// src/main/java/com/profitpulse/profit_pulse_backend/service/ProfitLossService.java
package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.MonthlyProfitData;
import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfitLossService {

    @Autowired
    private SalesRepository salesRepository;
    @Autowired
    private InventoryRepository inventoryRepository;


    public ProfitLossDTO calculateProfitLoss() {
        List<Sale> sales = salesRepository.findAll();

        double totalSaleValue = sales.stream()
                .mapToDouble(sale -> sale.getSoldPrice() * sale.getQuantitySold())
                .sum();

        double totalInvestmentValue = sales.stream()
                .mapToDouble(sale -> sale.getOriginalPrice() * sale.getQuantitySold())
                .sum();

        double overallProfit = totalSaleValue - totalInvestmentValue;

        double profitOnly = sales.stream().mapToDouble(sale -> {
            double diff = sale.getSoldPrice() - sale.getOriginalPrice();
            return diff > 0 ? diff * sale.getQuantitySold() : 0;
        }).sum();

        double lossOnly = sales.stream().mapToDouble(sale -> {
            double diff = sale.getSoldPrice() - sale.getOriginalPrice();
            return diff < 0 ? -diff * sale.getQuantitySold() : 0;
        }).sum();
        double totalInventoryValue = inventoryRepository.findByQuantityGreaterThan(0)
                .stream().mapToDouble(item -> item.getOriginalPrice() * item.getQuantity()).sum();

        return new ProfitLossDTO(totalInvestmentValue, totalSaleValue, overallProfit, profitOnly, lossOnly, totalInventoryValue);
    }

    public ProfitLossDTO calculateMonthlyProfitLoss(int year, int month) {
        List<Sale> sales = salesRepository.findAll();
        double totalSaleValue = 0, totalInvestmentValue = 0, profitOnly = 0, lossOnly = 0;

        for (Sale sale : sales) {
            if (sale.getTimestamp() != null &&
                    sale.getTimestamp().getYear() == year &&
                    sale.getTimestamp().getMonthValue() == month) {
                double saleValue = sale.getSoldPrice() * sale.getQuantitySold();
                double investmentValue = sale.getOriginalPrice() * sale.getQuantitySold();
                totalSaleValue += saleValue;
                totalInvestmentValue += investmentValue;
                double diff = sale.getSoldPrice() - sale.getOriginalPrice();
                if (diff > 0) {
                    profitOnly += diff * sale.getQuantitySold();
                } else {
                    lossOnly += -diff * sale.getQuantitySold();
                }
            }
        }

        double overallProfit = totalSaleValue - totalInvestmentValue;
        return new ProfitLossDTO(totalInvestmentValue, totalSaleValue, overallProfit, profitOnly, lossOnly, 0);
    }
    public List<Sale> getMonthlySales(int year, int month, boolean profitPositive) {
        List<Sale> sales = salesRepository.findAll().stream()
                .filter(sale -> {
                    LocalDateTime ts = sale.getTimestamp();
                    if (ts != null && ts.getYear() == year && ts.getMonthValue() == month) {
                        double diff = sale.getSoldPrice() - sale.getOriginalPrice();
                        return profitPositive ? (diff > 0) : (diff < 0);
                    }
                    return false;
                })
                .collect(Collectors.toList());
        return sales;
    }

    public List<MonthlyProfitData> getMonthlyProfitData() {
        List<MonthlyProfitData> result = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 0; i < 3; i++) {
            YearMonth ym = YearMonth.from(now).minusMonths(i);
            double profit = salesRepository.findAll().stream()
                    .filter(sale -> {
                        LocalDateTime ts = sale.getTimestamp();
                        if (ts != null) {
                            YearMonth saleYm = YearMonth.of(ts.getYear(), ts.getMonthValue());
                            return saleYm.equals(ym);
                        }
                        return false;
                    })
                    .mapToDouble(sale -> (sale.getSoldPrice() - sale.getOriginalPrice()) * sale.getQuantitySold())
                    .sum();
            result.add(new MonthlyProfitData(ym.toString(), profit));
        }
        result.sort((a, b) -> a.getMonth().compareTo(b.getMonth()));
        return result;
    }
}
