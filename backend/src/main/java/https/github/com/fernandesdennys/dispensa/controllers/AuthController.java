package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.LoginRequest;
import https.github.com.fernandesdennys.dispensa.dtos.LoginResponse;
import https.github.com.fernandesdennys.dispensa.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Bate exatamente com o que o frontend chama: httpClient.post("/login", ...)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse resposta = authService.autenticar(request);
        return ResponseEntity.ok(resposta);
    }
}