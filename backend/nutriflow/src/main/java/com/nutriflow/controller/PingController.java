package com.nutriflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/** Smallest possible endpoint - proves the skeleton web app answers a request. */
@RestController
public class PingController {

    @GetMapping("/api/ping")
    public Map<String, String> ping() {
        return Map.of("app", "nutriflow", "status", "ok", "time", Instant.now().toString());
    }
}
