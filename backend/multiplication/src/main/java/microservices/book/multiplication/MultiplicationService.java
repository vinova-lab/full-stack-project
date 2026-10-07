package microservices.book.multiplication;

import org.springframework.stereotype.Service;

@Service
public class MultiplicationService {

    public Challenge createChallenge(int factorA, int factorB) {
        return new Challenge(factorA, factorB);
    }
}