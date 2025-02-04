package com.profitpulse.profit_pulse_backend.service;

import com.profitpulse.profit_pulse_backend.dto.ProfitLossDTO;
import com.profitpulse.profit_pulse_backend.dto.MonthlyProfitData;
import com.profitpulse.profit_pulse_backend.entity.Sale;
import com.profitpulse.profit_pulse_backend.repository.SalesRepository;
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

    // Overall Profit Loss Report
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

    // Monthly Profit Loss Report for a specific month
    public ProfitLossDTO calculateMonthlyProfitLoss(int year, int month) {
        List<Sale> sales = salesRepository.findAll();
        double totalProfit = 0, totalRevenue = 0, totalCost = 0;

        for (Sale sale : sales) {
            if (sale.getTimestamp() != null &&
                    sale.getTimestamp().getYear() == year &&
                    sale.getTimestamp().getMonthValue() == month) {
                double originalPrice = sale.getInventory().getOriginalPrice();
                totalProfit += (sale.getSoldPrice() - originalPrice) * sale.getQuantitySold();
                totalRevenue += sale.getSoldPrice() * sale.getQuantitySold();
                totalCost += originalPrice * sale.getQuantitySold();
            }
        }

        return new ProfitLossDTO(totalRevenue, totalCost, totalProfit);
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
