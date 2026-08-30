package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.config.JwtUtil;
import https.github.com.fernandesdennys.dispensa.dtos.LoginRequest;
import https.github.com.fernandesdennys.dispensa.dtos.LoginResponse;
import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.exception.InvalidCredentialsException;
import https.github.com.fernandesdennys.dispensa.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse autenticar(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new InvalidCredentialsException("E-mail ou senha inválidos");
        }

        String token = jwtUtil.gerarToken(usuario.getEmail());

        return new LoginResponse(
                token,
                usuario.getNome(),
                usuario.getSobrenome(),
                usuario.getEmail()
        );
    }
}