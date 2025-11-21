package com.discordclone.lingo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.discordclone.lingo.model.User;
import com.discordclone.lingo.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    

   @PostMapping
public ResponseEntity<?> createUser(@RequestBody User user) {

    if (userRepository.existsByEmail(user.getEmail())) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", "Email already exists"));
    }

    if (userRepository.existsByUsername(user.getUsername())) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", "Username already exists"));
    }

    User saved = userRepository.save(user);
    return ResponseEntity.ok(saved);
    }
}


