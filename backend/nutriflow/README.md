# NutriFlow Backend — Spring Boot 4 / Java 21 / Maven

REST backend for the NutriFlow wellness tracker (the React app in the repo root).
Built for *Spring Boot Framework – Part 1*: a skeleton web app, auto-configuration,
three-layer architecture, JPA + H2 data layer, business rules in services, and JUnit tests.

```
backend/nutriflow
├── pom.xml                      Spring Boot 4.1.1 parent, Java 21
├── src/main/resources/application.properties   H2 + JPA + H2 console + demo seed flags
└── src/main/java/com/nutriflow
    ├── NutriflowApplication.java        @SpringBootApplication entry point
    ├── controller/   PRESENTATION  Ping, Auth, User, DayLog controllers (@RestController)
    ├── service/      BUSINESS      AuthService, UserService, DayLogService (@Service)
    │   └── calc/                   GoalCalculator, WellnessCalculator, PasswordHasher (pure Java)
    ├── repository/   DATA ACCESS   UserRepository, DayLogRepository, MealRepository (JpaRepository)
    ├── domain/       ENTITIES      User, DayLog, Meal (@Entity)
    ├── dto/                        request/response records (+ @Valid constraints)
    ├── exception/                  ApiException family + @RestControllerAdvice -> { "message" }
    └── config/DemoDataSeeder.java  CommandLineRunner that seeds the demo account at startup
```

## 1. Run it

```bash
cd backend/nutriflow
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
# or open the folder in IntelliJ IDEA -> run NutriflowApplication
```

| URL | What |
|---|---|
| http://localhost:8080/api/ping | smoke test → `{"app":"nutriflow","status":"ok","time":"..."}` |
| http://localhost:8080/h2-console | H2 console — JDBC URL `jdbc:h2:mem:nutriflowdb`, user `sa`, blank password |
| http://localhost:8080/actuator/health | `{"status":"UP"}` |

Tables created by Hibernate from the entities: `APP_USERS`, `DAY_LOGS`, `MEALS`.
On startup the demo user **demo@nutriflow.app / demo1234** ("Vino") and today's 5 demo meals are seeded.

## 2. Request flow (Client → Controller → Service → Repository → Data)

```
POST /api/log/2026-10-27/meal   { "type":"lunch","name":"Quinoa Bowl","kcal":480,"p":22,"c":68,"f":14 }
Authorization: Bearer tok-…
        │
        ▼
DayLogController.addMeal()           (controller)  validates JSON (@Valid), reads Bearer header
        │  authService.requireUser(token)  →  UserRepository.findByToken()  → APP_USERS
        ▼
DayLogService.addMeal()              (service)     RULE #4 date check, RULE #3 totals, wellness score
        │  dayLogRepository.findByUserIdAndDateKey()   → DAY_LOGS  (creates the row on first access)
        │  log.addMeal(meal); dayLogRepository.save(log) → MEALS   (cascade)
        ▼
DayLogResponse { meals[], waterMl, workoutMin, sleepMin, consumed{kcal,…}, wellness{score,…} }
        │
        ▼
JSON 200 back to the client
```

Spring Boot auto-configures every piece this flow touches: embedded Tomcat, Jackson JSON,
Bean Validation, the HikariCP `DataSource` from `spring.datasource.*`, Hibernate `EntityManager`,
Spring Data repository proxies, transaction management and the H2 console.
There is **no** `@Configuration` class in the project.

## 3. Domain model

| Entity | Table | Key attributes | Relationship |
|---|---|---|---|
| `User` | `app_users` | id, name, email (unique), passwordHash, token, demo, age, heightCm, weightKg, goal, activityLevel, dietPreference, waterGoalMl, sleepGoalMin | — |
| `DayLog` | `day_logs` | id, userId, dateKey (unique per user), waterMl, workoutMin, workoutDone, sleepMin | `@OneToMany` meals (cascade ALL, orphanRemoval) |
| `Meal` | `meals` | id, type, name, time, kcal, proteinG, carbsG, fatG, done | `@ManyToOne` dayLog |

`User.id` is referenced from `DayLog.userId` as a scalar (same approach as the course handout's
`Attempt.userId`); `DayLog ↔ Meal` is a real JPA association.

## 4. Business rules (all in `service/`, none in controllers)

| # | Rule | Where | Why it matters |
|---|---|---|---|
| 1 | **Registration integrity** – e-mail trimmed + lower-cased, demo e-mail reserved, duplicates rejected (409), password stored as salted SHA-256 | `AuthService.register` | prevents duplicate / spoofed accounts; same behaviour as `authService.js` |
| 2 | **Calorie target & macros** – gender-neutral Mifflin-St Jeor × activity factor × goal offset, rounded to 50 kcal; macro split 25–30 % protein / 28 % fat | `GoalCalculator`, `UserService.goals` | server and React app compute identical numbers (`calculations.js`) |
| 3 | **Only completed meals count** toward intake; wellness score = 30 % nutrition (bell curve), 25 % hydration, 25 % activity, 20 % sleep | `DayLogService.consumed`, `WellnessCalculator` | a planned dinner must not inflate today's calories |
| 4 | **Range guards** – water 0–10 000 ml, workout 0–600 min, sleep 0–1 440 min, ISO date not in the future | `DayLogService` | rejects garbage before it reaches the database (400) |

Edge cases handled: missing profile values fall back to 70 kg / 170 cm / 25 y (same defaults as the
frontend); goals of 0 fall back to 1800 kcal / 2500 ml / 30 min / 480 min to avoid division by zero;
first `GET /api/log/{date}` of a day creates an empty log instead of 404 (mirrors `loadDayLog`).

## 5. REST API

All endpoints except `/api/ping` and `/api/auth/*` need `Authorization: Bearer <token>`.
Errors come back as `{ "message": "..." }` with 400 / 401 / 404 / 409.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/ping` | — | status |
| POST | `/api/auth/register` | `{name,email,password}` | 201 `{token,user}` |
| POST | `/api/auth/login` | `{email,password}` | `{token,user}` |
| POST | `/api/auth/logout` | — | 204 |
| GET / PUT | `/api/user/profile` | partial profile | `UserResponse` |
| GET | `/api/goals` | — | `{calories,proteinG,carbsG,fatG,waterMl,workoutMin,sleepMin}` |
| GET | `/api/log` | — | `DayLogResponse[]` newest first |
| GET | `/api/log/{date}` | — | `DayLogResponse` |
| POST | `/api/log/{date}/meal` | `{type,name,time,kcal,p,c,f,done}` | `DayLogResponse` |
| PUT | `/api/log/{date}/meal/{id}` | any subset of meal fields | `DayLogResponse` |
| PATCH | `/api/log/{date}/meal/{id}/toggle` | — | `DayLogResponse` |
| DELETE | `/api/log/{date}/meal/{id}` | — | `DayLogResponse` |
| PUT | `/api/log/{date}/water` | `{waterMl}` | `DayLogResponse` |
| PUT | `/api/log/{date}/workout` | `{workoutMin,done}` | `DayLogResponse` |
| PUT | `/api/log/{date}/sleep` | `{sleepMin}` | `DayLogResponse` |
| GET | `/api/log/{date}/wellness` | — | `{score,breakdown}` |

### Quick manual check (curl)

```bash
TOKEN=$(curl -s -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"demo@nutriflow.app","password":"demo1234"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')

curl -s localhost:8080/api/goals -H "Authorization: Bearer $TOKEN"
curl -s localhost:8080/api/log/$(date +%F) -H "Authorization: Bearer $TOKEN"
```

## 6. Tests

```bash
./mvnw test
```

| Class | Kind | Covers |
|---|---|---|
| `GoalCalculatorTest` | unit | Rule 2 |
| `WellnessCalculatorTest` | unit | Rule 3 scoring |
| `AuthServiceTest` | unit + Mockito | Rule 1 |
| `DayLogServiceIntegrationTest` | `@SpringBootTest` + H2 | Rules 3 & 4 through the real repository |
| `NutriflowApplicationTests` | `@SpringBootTest` | context loads |

The manual test-case table (input / expected / actual / PASS-FAIL) is in [`TESTING.md`](TESTING.md).

## 7. Wiring the React app

Create `.env.local` in the repo root with `VITE_API_URL=http://localhost:8080`, then swap the
localStorage stubs in `src/services/*.js` for `apiFetch()` calls — the endpoint paths above are the
ones already documented in `apiClient.js`. Controllers allow CORS from `http://localhost:5173`.
