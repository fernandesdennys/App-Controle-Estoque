package https.github.com.fernandesdennys.dispensa.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Defina em application.properties:
    // jwt.secret=uma-chave-bem-grande-e-secreta-aqui-com-32-caracteres-ou-mais
    @Value("${jwt.secret}")
    private String secret;

    // Tempo de expiração do token, em milissegundos (aqui: 24h)
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000;

    private SecretKey getChave() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String gerarToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getChave())
                .compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parser()
                .verifyWith(getChave())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean tokenValido(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getChave())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}