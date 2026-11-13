import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8081/api/courses")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load courses");
                }
                return response.json();
            })
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Unable to load courses. Please try again.");
                setLoading(false);
            });
    }, []);

    return (
        <main className="section">
            <h1>Our Courses</h1>
            <p className="lead"> Choose a skill and start learning.</p>
            {loading && <p>Loading courses...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && (
                <div className="course-grid">
                    {courses.map((course) => (
                        <article
                            className="course-card"
                            key={course.id}
                        >
                            <h2>{course.title}</h2>
                            <p>Category: {course.category}</p>
                            <p>Duration: {course.duration}</p>
                            <Link
                                className="btn"
                                to="/contact"     >
                                Enquire
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Courses;
