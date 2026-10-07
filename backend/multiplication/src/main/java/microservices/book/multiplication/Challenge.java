package microservices.book.multiplication;

public class Challenge {

    private int factorA;
    private int factorB;

    public Challenge(int factorA, int factorB) {
        this.factorA = factorA;
        this.factorB = factorB;
    }

    public int getResult() {
        return factorA * factorB;
    }


}