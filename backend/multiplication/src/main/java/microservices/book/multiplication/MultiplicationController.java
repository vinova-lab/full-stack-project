package microservices.book.multiplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MultiplicationController {

    private final MultiplicationService multiplicationService;

    public MultiplicationController(MultiplicationService multiplicationService) {
        this.multiplicationService = multiplicationService;
    }

    @GetMapping("/multiply/{factorA}/{factorB}")
    public String multiply(
            @PathVariable int factorA,
            @PathVariable int factorB) {

        Challenge challenge =
                multiplicationService.createChallenge(factorA, factorB);

        return String.valueOf(challenge.getResult());
    }
}