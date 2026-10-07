package microservices.book.multiplication;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ChallengeTest {

    @Test
    void shouldReturnCorrectResult() {
        // Given
        int factorA = 5;
        int factorB = 6;

        // When
        Challenge challenge = new Challenge(factorA, factorB);

        // Then
        assertEquals(30, challenge.getResult());
    }
}