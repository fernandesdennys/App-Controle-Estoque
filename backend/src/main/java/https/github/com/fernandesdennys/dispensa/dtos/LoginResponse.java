package https.github.com.fernandesdennys.dispensa.dtos;

/**
 * Resposta quando o login dá certo.
 * O frontend usa "token" para autenticar as próximas requisições,
 * e "nome"/"sobrenome" para exibir no Header/Dashboard.
 */
public record LoginResponse(
        String token,
        String nome,
        String sobrenome,
        String email
) {
}