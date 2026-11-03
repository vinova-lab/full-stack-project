package com.skillhub.courseservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CourseServiceApplicationTests {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @Test
    void contextLoads() {
        assertThat(courseService).isNotNull();
        assertThat(courseRepository).isNotNull();
    }

    @Test
    void testInitialCoursesLoaded() {
        List<Course> courses = courseService.getAllCourses();
        assertThat(courses).isNotEmpty();
        assertThat(courses.size()).isGreaterThanOrEqualTo(4);
    }

    @Test
    void testSaveCourse() {
        Course newCourse = new Course("DevOps Engineering", "Cloud", "8 Weeks");
        Course saved = courseService.saveCourse(newCourse);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("DevOps Engineering");
        assertThat(saved.getCategory()).isEqualTo("Cloud");
        assertThat(saved.getDuration()).isEqualTo("8 Weeks");
    }
}
