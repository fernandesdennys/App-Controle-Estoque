package https.github.com.fernandesdennys.dispensa.exception;

import java.time.Instant;

public record ErrorResponse(
        String detail,
        int status,
        Instant timestamp
) {
    public ErrorResponse(String detail, int status) {
        this(detail, status, Instant.now());
    }
}