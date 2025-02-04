package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Role;
import com.profitpulse.profit_pulse_backend.entity.User;
import com.profitpulse.profit_pulse_backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/cashiers")
public class ManageCashierController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get a list of all cashiers
    @GetMapping
    public ResponseEntity<List<User>> getAllCashiers() {
        List<User> cashiers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.CASHIER)
                .toList();
        return ResponseEntity.ok(cashiers);
    }

    // Add a new cashier (expects JSON with username and password)
    @PostMapping
    public ResponseEntity<?> addCashier(@RequestBody User cashier) {
        // Check if user already exists
        Optional<User> existing = userRepository.findByUsername(cashier.getUsername());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }
        cashier.setPassword(passwordEncoder.encode(cashier.getPassword()));
        cashier.setRole(Role.CASHIER);
        User saved = userRepository.save(cashier);
        return ResponseEntity.ok(saved);
    }

    // Remove a cashier by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCashier(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.CASHIER) {
            return ResponseEntity.badRequest().body("Cashier not found.");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Cashier deleted successfully.");
    }
}
