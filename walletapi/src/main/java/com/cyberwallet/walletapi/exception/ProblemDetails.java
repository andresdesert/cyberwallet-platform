package com.cyberwallet.walletapi.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetails {

    private String type;
    private String title;
    private int status;
    private String detail;
    private String instance;
    private List<FieldError> fieldErrors;
    private Map<String, Object> extensions;
    private String errorId;
    private LocalDateTime timestamp;

    /**
     * ✅ Clase anidada personalizada para representar errores de campos,
     * separada de la `FieldError` de Spring para evitar conflictos y facilitar serialización.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldError {
        private String field;
        private String message;
    }
}
