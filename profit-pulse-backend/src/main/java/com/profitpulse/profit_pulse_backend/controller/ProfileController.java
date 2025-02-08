// src/main/java/com/profitpulse/profit_pulse_backend/controller/ProfileController.java
package com.profitpulse.profit_pulse_backend.controller;

import com.profitpulse.profit_pulse_backend.repository.UserRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cashier/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var userOpt = userRepository.findByUsername(username);
        if(userOpt.isEmpty()){
            return ResponseEntity.badRequest().body("User not found.");
        }
        var user = userOpt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }
}
