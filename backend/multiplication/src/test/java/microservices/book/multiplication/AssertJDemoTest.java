package microservices.book.multiplication;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AssertJDemoTest {

    @Test
    void shouldUseAssertJ() {
        Challenge challenge = new Challenge(5, 6);

        assertThat(challenge.getResult()).isEqualTo(30);
    }
}