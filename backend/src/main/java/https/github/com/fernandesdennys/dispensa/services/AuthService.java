package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.config.JwtUtil;
import https.github.com.fernandesdennys.dispensa.dtos.LoginRequest;
import https.github.com.fernandesdennys.dispensa.dtos.LoginResponse;
import https.github.com.fernandesdennys.dispensa.dtos.RegisterRequest;
import https.github.com.fernandesdennys.dispensa.dtos.RegisterResponse;
import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.exception.EmailJaCadastradoException;
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

    // =========================
    // LOGIN
    // =========================
    public LoginResponse autenticar(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new InvalidCredentialsException("E-mail ou senha inválidos")
                );

        if (!passwordEncoder.matches(
                request.senha(),
                usuario.getSenhaHash()
        )) {
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

    // =========================
    // CADASTRO
    // =========================
    public RegisterResponse cadastrar(RegisterRequest request) {

        // Verifica se o e-mail já existe
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException(
                    "Este e-mail já está cadastrado"
            );
        }

        // Cria um novo usuário
        Usuario usuario = new Usuario();

        usuario.setNome(request.nome());
        usuario.setSobrenome(request.sobrenome());
        usuario.setEmail(request.email());

        // Criptografa a senha antes de salvar
        usuario.setSenhaHash(
                passwordEncoder.encode(request.senha())
        );

        // Salva o usuário no banco
        usuario = usuarioRepository.save(usuario);

        // Retorna os dados do usuário cadastrado
        return new RegisterResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getSobrenome(),
                usuario.getEmail()
        );
    }
}