package com.nutriflow.config;

import com.nutriflow.domain.DayLog;
import com.nutriflow.domain.Meal;
import com.nutriflow.domain.User;
import com.nutriflow.repository.DayLogRepository;
import com.nutriflow.repository.UserRepository;
import com.nutriflow.service.calc.PasswordHasher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Runs once after the context starts and seeds the demo account "Vino" plus today's demo
 * meals (same values as DEMO_USER / DEMO_MEALS in the React app). Because H2 is in-memory
 * the data is recreated on every restart, so a fresh demo is always available at
 * {@code demo@nutriflow.app / demo1234}. Disable with {@code nutriflow.demo.seed=false}.
 */
@Component
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final DayLogRepository dayLogRepository;
    private final String demoEmail;
    private final String demoPassword;
    private final boolean enabled;

    public DemoDataSeeder(UserRepository userRepository,
                          DayLogRepository dayLogRepository,
                          @Value("${nutriflow.demo.email:demo@nutriflow.app}") String demoEmail,
                          @Value("${nutriflow.demo.password:demo1234}") String demoPassword,
                          @Value("${nutriflow.demo.seed:true}") boolean enabled) {
        this.userRepository = userRepository;
        this.dayLogRepository = dayLogRepository;
        this.demoEmail = demoEmail.trim().toLowerCase();
        this.demoPassword = demoPassword;
        this.enabled = enabled;
    }

    @Override
    public void run(String... args) {
        if (!enabled || userRepository.existsByEmail(demoEmail)) {
            return;
        }

        User vino = new User("Vino", demoEmail, PasswordHasher.hash(demoPassword));
        vino.setDemo(true);
        vino.setAge(24);
        vino.setHeightCm(172.0);
        vino.setWeightKg(68.0);
        vino.setGoal("maintain");
        vino.setActivityLevel("moderate");
        vino.setDietPreference("vegetarian");
        vino.setWaterGoalMl(2500);
        vino.setSleepGoalMin(480);
        vino = userRepository.save(vino);

        DayLog today = new DayLog(vino.getId(), LocalDate.now().toString());
        today.setWaterMl(1800);
        today.setSleepMin(462);
        today.addMeal(done(new Meal("breakfast", "Oatmeal with Berries", "08:15", 320, 14, 52, 7)));
        today.addMeal(done(new Meal("breakfast", "Green Smoothie", "08:30", 180, 6, 32, 4)));
        today.addMeal(done(new Meal("lunch", "Quinoa Buddha Bowl", "13:00", 480, 22, 68, 14)));
        today.addMeal(done(new Meal("snack", "Mixed Nuts", "16:00", 190, 6, 8, 16)));
        today.addMeal(new Meal("dinner", "Stir-fried Tofu & Veggies", "19:30", 250, 34, 28, 9));
        dayLogRepository.save(today);

        log.info("Seeded demo user {} (id={}) with {} meals for {}", demoEmail, vino.getId(),
                today.getMeals().size(), today.getDateKey());
    }

    private static Meal done(Meal m) {
        m.setDone(true);
        return m;
    }
}
