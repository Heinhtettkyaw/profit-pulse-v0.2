package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.Role;
import com.profitpulse.profit_pulse_backend.entity.User;
import com.profitpulse.profit_pulse_backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/cashiers")
public class ManageCashierController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Verify that the provided admin password matches the password of the currently authenticated admin.
     */
    private boolean verifyAdminPassword(String providedPassword) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> adminOpt = userRepository.findByUsername(currentUsername);
        if (adminOpt.isEmpty()) {
            return false;
        }
        User adminUser = adminOpt.get();
        return passwordEncoder.matches(providedPassword, adminUser.getPassword());
    }

    // Retrieve all cashiers.
    @GetMapping
    public ResponseEntity<List<User>> getAllCashiers() {
        List<User> cashiers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.CASHIER)
                .toList();
        return ResponseEntity.ok(cashiers);
    }

    // Add a new cashier. Requires a query parameter "adminPassword".
    @PostMapping
    public ResponseEntity<?> addCashier(@RequestBody User cashier,
                                        @RequestParam("adminPassword") String adminPassword) {
        if (!verifyAdminPassword(adminPassword.trim())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid admin password.");
        }
        Optional<User> existing = userRepository.findByUsername(cashier.getUsername());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }
        cashier.setPassword(passwordEncoder.encode(cashier.getPassword()));
        cashier.setRole(Role.CASHIER);
        User saved = userRepository.save(cashier);
        return ResponseEntity.ok(saved);
    }

    // Delete a cashier by ID. Requires a query parameter "adminPassword".
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCashier(@PathVariable Long id,
                                           @RequestParam("adminPassword") String adminPassword) {
        if (!verifyAdminPassword(adminPassword.trim())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid admin password.");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.CASHIER) {
            return ResponseEntity.badRequest().body("Cashier not found.");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Cashier deleted successfully.");
    }

    // Reset a cashier's password to the default value ("cashier"). Requires a query parameter "adminPassword".
    @PutMapping("/{id}/reset")
    public ResponseEntity<?> resetCashierPassword(@PathVariable Long id,
                                                  @RequestParam("adminPassword") String adminPassword) {
        if (!verifyAdminPassword(adminPassword.trim())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid admin password.");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.CASHIER) {
            return ResponseEntity.badRequest().body("Cashier not found.");
        }
        User cashier = userOpt.get();
        cashier.setPassword(passwordEncoder.encode("cashier"));
        userRepository.save(cashier);
        return ResponseEntity.ok("Cashier password reset successfully.");
    }
}
