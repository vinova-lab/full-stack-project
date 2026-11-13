# NutriFlow Backend — Test Cases

How to run: `cd backend/nutriflow && ./mvnw test` (Windows: `.\mvnw.cmd test`), or start the app and use the
HTTP / H2 console steps below.

**Run record:** 2026-10-27, Windows 11 / PowerShell 5.1, Java 21, Spring Boot 4.1.1.
- Automated: `Tests run: 15, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS` (19.6 s, 03:10 IST).
- Manual: 8 HTTP / H2 checks against the running app (03:00–03:30 IST).
- **Result: 15 / 15 PASS.**

## A. Automated (JUnit 5)

| ID | Test class / method | Input | Expected output | Actual output | Result |
|---|---|---|---|---|---|
| TC-01 | `GoalCalculatorTest.demoProfileCalorieTarget` | weight 68 kg, height 172 cm, age 24, `moderate`, `maintain` | `2400` kcal | `2400` | **PASS** |
| TC-02 | `GoalCalculatorTest.loseGoalLowersTargetAndRaisesProtein` | same profile, goal `lose` | calories 2050, protein 154 g, carbs 215 g, fat 64 g | calories 2050, protein 154 g, carbs 215 g, fat 64 g | **PASS** |
| TC-03 | `WellnessCalculatorTest.demoDayScore` | 1170/1850 kcal, 1800/2500 ml, 0/30 min, 462/480 min | score 56; breakdown 63 / 72 / 0 / 96 | score 56; breakdown 63 / 72 / 0 / 96 | **PASS** |
| TC-04 | `AuthServiceTest.reservedEmailIsRejected` | register `"  DEMO@NutriFlow.app "` | `ConflictException` "…reserved…", repository `save` never called | `ConflictException`, `save` never called | **PASS** |
| TC-05 | `AuthServiceTest.duplicateEmailIsRejected` | register ` Deenu@Example.com ` when `deenu@example.com` exists | `ConflictException` "…already exists" | `ConflictException` "already exists" | **PASS** |
| TC-06 | `DayLogServiceIntegrationTest.onlyDoneMealsCountTowardIntake` | add 480 kcal meal with `done=false`, then toggle | consumed 0 kcal → 480 kcal; nutrition 20 % | consumed 0 → 480 kcal; nutrition 20 % | **PASS** |
| TC-07 | `DayLogServiceIntegrationTest.waterRangeGuard` | `setWater(12000)` | `BadRequestException` "waterMl…"; stored water stays 0 | `BadRequestException`; water stays 0 | **PASS** |

## B. Manual (HTTP)

| ID | Request | Expected response | Actual output | Result |
|---|---|---|---|---|
| TC-08 | `GET /api/ping` | 200 `{"app":"nutriflow","status":"ok",...}` | 200 `{"app":"nutriflow","time":"2026-10-26T21:58:34Z","status":"ok"}` | **PASS** |
| TC-09 | `POST /api/auth/login` `{"email":"demo@nutriflow.app","password":"demo1234"}` | 200 `{token:"tok-…", user:{name:"Vino", isDemo:true,…}}` | 200 `token: tok-3b3ec89a-66c1-47c0-bb4b-ed031704baa7`, `user.name=Vino`, `isDemo=True`, `id=1` | **PASS** |
| TC-10 | `POST /api/auth/login` with password `wrong` | 401 `{"message":"Incorrect password. Please try again."}` | 401 `{"message":"Incorrect password. Please try again."}` | **PASS** |
| TC-11 | `GET /api/goals` (demo token) | 200 `{calories:2400, proteinG:150, carbsG:282, fatG:75, waterMl:2500, workoutMin:30, sleepMin:480}` | 200 `calories 2400, proteinG 150, carbsG 282, fatG 75, waterMl 2500, workoutMin 30, sleepMin 480` | **PASS** |
| TC-12 | `GET /api/log/<today>` (demo token) | 200, 5 meals, `consumed.kcal` 1170, `wellness.score` 52 (see note) | 200 `dateKey 2026-10-27`, 5 meals (ids 1–5, dinner `done=False`), `consumed {kcal 1170, proteinG 48, carbsG 160, fatG 41}`, `wellness.score 52` | **PASS** |
| TC-13 | `PUT /api/log/<today>/water` `{"waterMl":-5}` | 400 `{"message":"waterMl must be between 0 and 10000."}` | 400 `{"message":"waterMl must be between 0 and 10000."}` | **PASS** |
| TC-14 | `GET /api/user/profile` without `Authorization` | 401 `{"message":"Missing Authorization header."}` | 401 `{"message":"Missing Authorization header."}` | **PASS** |
| TC-15 | H2 console `SELECT ID, NAME, DONE FROM MEALS;` after TC-12 | 5 rows, `DONE` true for 4, false for the dinner | 5 rows: ids 1–4 (Oatmeal with Berries, Green Smoothie, Quinoa Buddha Bowl, Mixed Nuts) `TRUE`; id 5 (Stir-fried Tofu & Veggies) `FALSE` | **PASS** |

Note on TC-12: the demo user's server-computed target is 2400 kcal, so nutrition = 1170/2400 = 49 %,
hydration 72 %, activity 0 %, sleep 96 % → score = round(14.7 + 18 + 0 + 19.2) = **52**. (The React
demo uses a hard-coded 1850 kcal goal, which is why the frontend shows a different score.)
