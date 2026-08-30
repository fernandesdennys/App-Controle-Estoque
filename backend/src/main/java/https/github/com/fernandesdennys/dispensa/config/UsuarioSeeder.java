package https.github.com.fernandesdennys.dispensa.config;

import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Como o banco é recriado a cada restart (ddl-auto=create-drop),
        // este usuário de teste é recriado toda vez também.
        if (usuarioRepository.existsByEmail("teste@dispensa.com")) {
            return;
        }

        Usuario usuario = new Usuario();
        usuario.setNome("Usuário");
        usuario.setSobrenome("Teste");
        usuario.setEmail("teste@dispensa.com");
        usuario.setSenhaHash(passwordEncoder.encode("123456"));

        usuarioRepository.save(usuario);

        System.out.println("Usuário de teste criado: teste@dispensa.com / senha: 123456");
    }
}