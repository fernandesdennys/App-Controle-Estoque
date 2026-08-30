package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Corpo que o frontend envia em POST /login:
 * { email, senha, lembrarDeMim }
 */
public record LoginRequest(
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Digite um e-mail válido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String senha,

        Boolean lembrarDeMim
) {
}