package com.skillhub.courseservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CourseServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CourseServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner loadCourses(CourseService courseService) {
        return args -> {
            courseService.saveCourse(
                    new Course("Full Stack Web Development",
                            "Web Development", "12 Weeks"));
            courseService.saveCourse(
                    new Course("Artificial Intelligence",
                            "AI", "10 Weeks"));
            courseService.saveCourse(
                    new Course("Data Science Fundamentals",
                            "Data Science", "8 Weeks"));
            courseService.saveCourse(
                    new Course("Cloud Computing",
                            "Cloud", "6 Weeks"));
        };
    }
}
