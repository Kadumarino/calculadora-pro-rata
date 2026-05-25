import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class MassaProRata {

    public static void main(String[] args) {
        LocalDate dataInicio = LocalDate.of(2026, 5, 1);   // backdate
        LocalDate dataCorte = LocalDate.of(2026, 5, 29);   // fatura aberta (28 dias)
        int diasProRata = 5;                               // consumo desejado

        long diasFatura = ChronoUnit.DAYS.between(dataInicio, dataCorte);

        System.out.println("Fatura aberta com " + diasFatura + " dias.");
        System.out.println("Consumo ajustado para " + diasProRata + " dias de pró-rata.");
    }
}
