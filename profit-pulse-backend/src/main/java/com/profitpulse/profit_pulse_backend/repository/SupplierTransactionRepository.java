// src/main/java/com/profitpulse/profit_pulse_backend/repository/SupplierTransactionRepository.java
package com.profitpulse.profit_pulse_backend.repository;

import com.profitpulse.profit_pulse_backend.entity.SupplierTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierTransactionRepository extends JpaRepository<SupplierTransaction, Long> {
}
