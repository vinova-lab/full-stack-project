package microservices.book.multiplication;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MockitoDemoTest {

    @Test
    void demonstrateMock() {
        Challenge challenge = Mockito.mock(Challenge.class);

        Mockito.when(challenge.getResult())
                .thenReturn(100);

        assertEquals(100, challenge.getResult());
    }
}