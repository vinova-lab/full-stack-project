package com.nutriflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point. {@code @SpringBootApplication} turns on component scanning for every
 * sub-package ({@code controller}, {@code service}, {@code repository} ...) and
 * Spring Boot auto-configuration (embedded Tomcat, Jackson, DataSource, JPA, H2 console).
 * Nothing in this project configures those pieces by hand.
 */
@SpringBootApplication
public class NutriflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(NutriflowApplication.class, args);
    }
}
