package https.github.com.fernandesdennys.dispensa.dtos;

public record RegisterResponse(
        Integer id,
        String nome,
        String sobrenome,
        String email
) {}