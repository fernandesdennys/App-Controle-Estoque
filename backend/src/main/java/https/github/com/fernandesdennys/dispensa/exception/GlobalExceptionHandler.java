package https.github.com.fernandesdennys.dispensa.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Login/senha errados -> 401
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        logger.warn("Tentativa de login inválida: {}", ex.getMessage());

        ErrorResponse erro = new ErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    // E-mail já cadastrado -> 409
    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<ErrorResponse> handleEmailDuplicado(EmailJaCadastradoException ex) {
        logger.warn("Tentativa de cadastro com e-mail duplicado: {}", ex.getMessage());

        ErrorResponse erro = new ErrorResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    // Erros de validação do @Valid (ex: e-mail em formato errado, senha curta) -> 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new HashMap<>();

        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            campos.put(erro.getField(), erro.getDefaultMessage());
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("detail", "Dados inválidos");
        resposta.put("status", HttpStatus.BAD_REQUEST.value());
        resposta.put("errors", campos);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
    }

    // Qualquer outra exceção não tratada (SQL, NullPointer, JPA, etc.)
    // Nunca deixa o stacktrace/mensagem interna vazar pro cliente.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Erro não tratado", ex); // detalhe completo só no log do servidor

        ErrorResponse erro = new ErrorResponse(
                "Erro interno. Tente novamente mais tarde.",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}