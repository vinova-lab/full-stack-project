package com.skillhub.courseservice;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/api/courses")
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/api/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }
}
