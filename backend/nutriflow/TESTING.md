# NutriFlow Backend — Test Cases

How to run: `cd backend/nutriflow && ./mvnw test` (automated), or start the app and use the curl /
H2 console steps below (manual). Fill the **Actual output** column from your own run.

## A. Automated (JUnit 5)

| ID | Test class / method | Input | Expected output | Actual output | Result |
|---|---|---|---|---|---|
| TC-01 | `GoalCalculatorTest.demoProfileCalorieTarget` | weight 68 kg, height 172 cm, age 24, `moderate`, `maintain` | `2400` kcal | | PASS / FAIL |
| TC-02 | `GoalCalculatorTest.loseGoalLowersTargetAndRaisesProtein` | same profile, goal `lose` | calories 2050, protein 154 g, carbs 215 g, fat 64 g | | PASS / FAIL |
| TC-03 | `WellnessCalculatorTest.demoDayScore` | 1170/1850 kcal, 1800/2500 ml, 0/30 min, 462/480 min | score 56; breakdown 63 / 72 / 0 / 96 | | PASS / FAIL |
| TC-04 | `AuthServiceTest.reservedEmailIsRejected` | register `"  DEMO@NutriFlow.app "` | `ConflictException` "…reserved…", repository `save` never called | | PASS / FAIL |
| TC-05 | `AuthServiceTest.duplicateEmailIsRejected` | register ` Deenu@Example.com ` when `deenu@example.com` exists | `ConflictException` "…already exists" | | PASS / FAIL |
| TC-06 | `DayLogServiceIntegrationTest.onlyDoneMealsCountTowardIntake` | add 480 kcal meal with `done=false`, then toggle | consumed 0 kcal → 480 kcal; nutrition 20 % | | PASS / FAIL |
| TC-07 | `DayLogServiceIntegrationTest.waterRangeGuard` | `setWater(12000)` | `BadRequestException` "waterMl…"; stored water stays 0 | | PASS / FAIL |

## B. Manual (HTTP)

| ID | Request | Expected response | Actual output | Result |
|---|---|---|---|---|
| TC-08 | `GET /api/ping` | 200 `{"app":"nutriflow","status":"ok",...}` | | PASS / FAIL |
| TC-09 | `POST /api/auth/login` `{"email":"demo@nutriflow.app","password":"demo1234"}` | 200 `{token:"tok-…", user:{name:"Vino", isDemo:true,…}}` | | PASS / FAIL |
| TC-10 | `POST /api/auth/login` with password `wrong` | 401 `{"message":"Incorrect password. Please try again."}` | | PASS / FAIL |
| TC-11 | `GET /api/goals` (demo token) | 200 `{calories:2400, proteinG:150, carbsG:282, fatG:75, waterMl:2500, workoutMin:30, sleepMin:480}` | | PASS / FAIL |
| TC-12 | `GET /api/log/<today>` (demo token) | 200, 5 meals, `consumed.kcal` 1170, `wellness.score` 52 (see note) | | PASS / FAIL |
| TC-13 | `PUT /api/log/<today>/water` `{"waterMl":-5}` | 400 `{"message":"waterMl must be between 0 and 10000."}` | | PASS / FAIL |
| TC-14 | `GET /api/user/profile` without `Authorization` | 401 `{"message":"Missing Authorization header."}` | | PASS / FAIL |
| TC-15 | H2 console `SELECT * FROM MEALS;` after TC-12 | 5 rows, `DONE` true for 4, false for the dinner | | PASS / FAIL |

Note on TC-12: the demo user's server-computed target is 2400 kcal, so nutrition = 1170/2400 = 49 %,
hydration 72 %, activity 0 %, sleep 96 % → score = round(14.7 + 18 + 0 + 19.2) = **52**. (The React
demo uses a hard-coded 1850 kcal goal, which is why the frontend shows a different score.)
