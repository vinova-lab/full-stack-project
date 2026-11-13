import { useState, useEffect } from "react";
import { Link, HashRouter } from "react-router-dom";
import { AppProviders } from "./context/AppProviders.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

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

export function Register() {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    function changeMode(nextMode) {
        setMode(nextMode);
        setMessage("");
        setMessageType("");
        setPassword("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setMessageType("");
        setLoading(true);

        const isLogin = mode === "login";

        const endpoint = isLogin
            ? "http://localhost:8082/api/users/login"
            : "http://localhost:8082/api/users";

        const requestBody = isLogin
            ? { email, password }
            : { name, email, password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isLogin
                        ? "Invalid email or password."
                        : "Registration failed.")
                );
            }

            if (isLogin) {
                setMessage(
                    "Welcome back, " + data.name + "! Login successful."
                );
                setMessageType("success");
            } else {
                setMessage(
                    "Account created successfully! Welcome, " +
                    data.name + ". Please log in."
                );
                setMessageType("success");
                setMode("login");
                setName("");
                setPassword("");
            }
        } catch (error) {
            setMessage(
                error.message === "Failed to fetch"
                    ? "Unable to connect to the User Service. Check that it is running."
                    : error.message
            );
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="section auth-page">
            <h1>Welcome to SkillHub</h1>

            <p className="lead">
                {mode === "login"
                    ? "Sign in to continue your learning journey."
                    : "Create your account and start learning."}
            </p>

            <div className="auth-tabs">
                <button
                    type="button"
                    onClick={() => changeMode("login")}
                    disabled={mode === "login"}
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => changeMode("register")}
                    disabled={mode === "register"}
                >
                    Register
                </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {mode === "register" && (
                    <label>
                        Full Name
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                    </label>
                )}

                <label>
                    Email Address
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                            mode === "login"
                                ? "Enter your password"
                                : "Create a password"
                        }
                        autoComplete={
                            mode === "login"
                                ? "current-password"
                                : "new-password"
                        }
                        required
                    />
                </label>

                {mode === "login" && (
                    <p className="forgot-password">
                        Forgot Password? (Coming soon)
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Please wait..."
                        : mode === "login"
                            ? "Login"
                            : "Create Account"}
                </button>

                {message && (
                    <p
                        role="status"
                        aria-live="polite"
                        className={
                            messageType === "success"
                                ? "auth-success"
                                : "auth-error"
                        }
                    >
                        {message}
                    </p>
                )}
            </form>
        </main>
    );
}

export default function App() {
  return (
    <HashRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </HashRouter>
  );
}
