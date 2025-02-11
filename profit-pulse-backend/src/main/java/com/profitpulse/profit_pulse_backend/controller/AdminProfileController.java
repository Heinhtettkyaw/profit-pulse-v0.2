package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.entity.User;
import com.profitpulse.profit_pulse_backend.repository.UserRepository;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/profile")
public class AdminProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");
        String confirmPassword = payload.get("confirmPassword");

        if (newPassword == null || !newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> adminOpt = userRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        User admin = adminOpt.get();
        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect.");
        }
        admin.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(admin);
        return ResponseEntity.ok("Password updated successfully.");
    }
}
