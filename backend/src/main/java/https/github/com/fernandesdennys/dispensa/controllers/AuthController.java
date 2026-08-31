package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.LoginRequest;
import https.github.com.fernandesdennys.dispensa.dtos.LoginResponse;
import https.github.com.fernandesdennys.dispensa.dtos.RegisterRequest;
import https.github.com.fernandesdennys.dispensa.dtos.RegisterResponse;
import https.github.com.fernandesdennys.dispensa.services.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
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

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse resposta = authService.autenticar(request);

        return ResponseEntity.ok(resposta);
    }

    // =========================
    // CADASTRO
    // =========================
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        RegisterResponse resposta = authService.cadastrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }
}