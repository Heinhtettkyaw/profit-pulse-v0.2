package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.dto.MonthlyProfitData;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.entity.Inventory;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
import com.profitpulse.profit_pulse_backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
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

        // totalInventoryValue from InventoryRepository remains unchanged (handled separately)
        // For this report, we assume totalInvestmentValue comes only from sales.
        return new ProfitLossDTO(totalInvestmentValue, totalSaleValue, overallProfit, profitOnly, lossOnly, 0);
    }

//    // Monthly Profit Loss Report
//    public ProfitLossDTO calculateMonthlyProfitLoss(int year, int month) {
//
//        List<Sale> sales = salesRepository.findAll();
//
//        double totalSaleValue = 0, totalInvestmentValue = 0, profitOnly = 0, lossOnly = 0; totalInventoryValue=0;
//
//        for (Sale sale : sales) {
//            if (sale.getTimestamp() != null &&
//                    sale.getTimestamp().getYear() == year &&
//                    sale.getTimestamp().getMonthValue() == month) {
//                double saleValue = sale.getSoldPrice() * sale.getQuantitySold();
//                double investmentValue = sale.getInventory().getOriginalPrice() * sale.getQuantitySold();
//                totalSaleValue += saleValue;
//                totalInvestmentValue += investmentValue;
//                double diff = sale.getSoldPrice() - sale.getInventory().getOriginalPrice();
//                if (diff > 0) {
//                    profitOnly += diff * sale.getQuantitySold();
//                } else {
//                    lossOnly += -diff * sale.getQuantitySold();
//                }
//            }
//        }
//
//        double overallProfit = totalSaleValue - totalInvestmentValue;
//
//        return new ProfitLossDTO(totalInvestmentValue, totalSaleValue, overallProfit, profitOnly, lossOnly);
//    }
// Monthly Profit Loss Report (for a given year and month)
public ProfitLossDTO calculateMonthlyProfitLoss(int year, int month) {
    List<Sale> sales = salesRepository.findAll();
    double totalSaleValue = 0, totalInvestmentValue = 0, profitOnly = 0, lossOnly = 0;

    for (Sale sale : sales) {
        if (sale.getTimestamp() != null &&
                sale.getTimestamp().getYear() == year &&
                sale.getTimestamp().getMonthValue() == month) {
            double saleValue = sale.getSoldPrice() * sale.getQuantitySold();
            double investmentValue = sale.getInventory().getOriginalPrice() * sale.getQuantitySold();
            totalSaleValue += saleValue;
            totalInvestmentValue += investmentValue;
            double diff = sale.getSoldPrice() - sale.getInventory().getOriginalPrice();
            if (diff > 0) {
                profitOnly += diff * sale.getQuantitySold();
            } else {
                lossOnly += -diff * sale.getQuantitySold();
            }
        }
    }

    double overallProfit = totalSaleValue - totalInvestmentValue;
    // We also want to include the current total inventory value (unsold items) even for monthly report
    double totalInventoryValue = inventoryRepository.findAll().stream()
            .mapToDouble(item -> item.getOriginalPrice() * item.getQuantity())
            .sum();

    return new ProfitLossDTO(totalInvestmentValue, totalSaleValue, overallProfit, profitOnly, lossOnly, totalInventoryValue);
}
    // Aggregated monthly profit data for bar chart.
    // Returns an array of objects { month: "YYYY-MM", profit: number } for all months.
    public List<MonthlyProfitData> getMonthlyProfitData() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        List<Sale> sales = salesRepository.findAll();
        Map<String, Double> groupedProfit = sales.stream()
                .filter(sale -> sale.getTimestamp() != null)
                .collect(Collectors.groupingBy(
                        sale -> sale.getTimestamp().format(formatter),
                        Collectors.summingDouble(sale -> (sale.getSoldPrice() - sale.getInventory().getOriginalPrice()) * sale.getQuantitySold())
                ));
        return groupedProfit.entrySet().stream()
                .map(e -> new MonthlyProfitData(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }
}
