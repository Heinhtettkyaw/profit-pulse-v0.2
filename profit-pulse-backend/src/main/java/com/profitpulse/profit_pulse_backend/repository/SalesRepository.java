// src/main/java/com/profitpulse/profit_pulse_backend/repository/SalesRepository.java
package com.profitpulse.profit_pulse_backend.repository;

import com.profitpulse.profit_pulse_backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByBuyerNameContainingIgnoreCaseOrItemNameContainingIgnoreCase(String buyer, String itemName);
}
