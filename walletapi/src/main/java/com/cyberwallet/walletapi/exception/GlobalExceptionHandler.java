// src/main/java/com/cyberwallet/walletapi/exception/GlobalExceptionHandler.java

package com.cyberwallet.walletapi.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import com.cyberwallet.walletapi.exception.ProblemDetails.FieldError;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 🎯 Manejador global de excepciones con soporte RFC 7807.
 * Centraliza el manejo de errores y garantiza respuestas consistentes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private final ObjectMapper objectMapper;

    @Autowired
    public GlobalExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * 📌 Maneja excepciones de negocio personalizadas.
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetails> handleBusinessException(
            BusinessException ex, HttpServletRequest request
    ) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();
        ErrorCode code = ex.getErrorCode(); // ✅ Esto es lo importante

        ProblemDetails problem = buildProblemDetails(
                code.getType(),
                code.getTitle(),
                code.getHttpStatus(),
                ex.getMessage() != null ? ex.getMessage() : code.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return ResponseEntity.status(code.getHttpStatus()).body(problem);
    }

    /**
     * 📌 Maneja errores de validación de DTOs.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetails> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[EXCEPTION] Validación fallida: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        List<ProblemDetails.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> ProblemDetails.FieldError.builder()
                        .field(error.getField())
                        .message(error.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.VALIDATION_ERROR.getType(),
                ErrorCode.VALIDATION_ERROR.getTitle(),
                ErrorCode.VALIDATION_ERROR.getHttpStatus(),
                "Hay errores en los datos enviados. Por favor, revisa los campos.", // 👈 Ajustar el detail aquí
                request.getRequestURI(),
                fieldErrors,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, ErrorCode.VALIDATION_ERROR.getHttpStatus());
    }

    /**
     * 📌 Maneja excepciones de argumentos inválidos.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetails> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[EXCEPTION] IllegalArgumentException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.INVALID_ARGUMENT.getType(),
                ErrorCode.INVALID_ARGUMENT.getTitle(),
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, HttpStatus.BAD_REQUEST);
    }
    // 🔧 Handler de ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetails> handleConstraintViolationException(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[EXCEPTION] ConstraintViolationException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        List<ProblemDetails.FieldError> fieldErrors = ex.getConstraintViolations().stream()
                .map(violation -> ProblemDetails.FieldError.builder()
                        .field(extractFieldName(violation))
                        .message(violation.getMessage())
                        .build())
                .collect(Collectors.toList());

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.VALIDATION_ERROR.getType(),
                ErrorCode.VALIDATION_ERROR.getTitle(),
                ErrorCode.VALIDATION_ERROR.getHttpStatus(),
                ErrorCode.VALIDATION_ERROR.getDefaultDetail(),
                request.getRequestURI(),
                fieldErrors,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, ErrorCode.VALIDATION_ERROR.getHttpStatus());
    }

    // 🔧 Utilidad para extraer el nombre del campo del ConstraintViolation
    private String extractFieldName(ConstraintViolation<?> violation) {
        String path = violation.getPropertyPath().toString();
        if (path.contains(".")) {
            return path.substring(path.lastIndexOf('.') + 1);
        }
        return path;
    }
    /**
     * 📌 Maneja excepciones de integridad de datos de la base de datos.
     */
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetails> handleDataIntegrityViolationException(
            org.springframework.dao.DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.error("[EXCEPTION] DataIntegrityViolationException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.DATABASE_ERROR.getType(),
                ErrorCode.DATABASE_ERROR.getTitle(),
                ErrorCode.DATABASE_ERROR.getHttpStatus(),
                ErrorCode.DATABASE_ERROR.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        logger.debug("[EXCEPTION] ProblemDetails generado: {}", toJson(problem));
        return new ResponseEntity<>(problem, ErrorCode.DATABASE_ERROR.getHttpStatus());
    }
    @ExceptionHandler({
            org.springframework.web.client.HttpClientErrorException.class,
    
    })
    public ResponseEntity<ProblemDetails> handleExternalServiceException(Exception ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.error("[EXCEPTION] ExternalServiceException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId, ex);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.EXTERNAL_SERVICE_ERROR.getType(),
                ErrorCode.EXTERNAL_SERVICE_ERROR.getTitle(),
                ErrorCode.EXTERNAL_SERVICE_ERROR.getHttpStatus(),
                ErrorCode.EXTERNAL_SERVICE_ERROR.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, ErrorCode.EXTERNAL_SERVICE_ERROR.getHttpStatus());
    }

    /**
     * 📌 Maneja excepciones de punteros nulos.
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ProblemDetails> handleNullPointerException(NullPointerException ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.error("[EXCEPTION] NullPointerException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.NULL_POINTER.getType(),
                ErrorCode.NULL_POINTER.getTitle(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.NULL_POINTER.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 📌 Maneja excepciones de acceso denegado.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetails> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[EXCEPTION] AccessDeniedException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.UNAUTHORIZED_ACCESS.getType(),
                ErrorCode.UNAUTHORIZED_ACCESS.getTitle(),
                HttpStatus.FORBIDDEN,
                ErrorCode.UNAUTHORIZED_ACCESS.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, HttpStatus.FORBIDDEN);
    }

    /**
     * 📌 Maneja excepciones de autenticación fallida.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetails> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[EXCEPTION] AuthenticationException capturada: {} - TraceId: {} - ErrorId: {}", ex.getMessage(), traceId, errorId);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.INVALID_CREDENTIALS.getType(),
                ErrorCode.INVALID_CREDENTIALS.getTitle(),
                HttpStatus.BAD_REQUEST, // Cambiado de UNAUTHORIZED a BAD_REQUEST
                ErrorCode.INVALID_CREDENTIALS.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        return new ResponseEntity<>(problem, HttpStatus.BAD_REQUEST); // Cambiado aquí también
    }

    /**
     * 📌 Maneja cualquier excepción no contemplada.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetails> handleGenericException(Exception ex, HttpServletRequest request) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();
        String message = (ex.getMessage() != null) ? ex.getMessage() : "Excepción desconocida";

        logger.error("[UNHANDLED] {} - TraceId={} - ErrorId={}", message, traceId, errorId, ex);

        ProblemDetails problem = buildProblemDetails(
                ErrorCode.INTERNAL_SERVER_ERROR.getType(),
                ErrorCode.INTERNAL_SERVER_ERROR.getTitle(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR.getDefaultDetail(),
                request.getRequestURI(),
                null,
                buildExtensions(traceId, errorId),
                errorId
        );

        logger.debug("[UNHANDLED] ProblemDetails generado: {}", toJson(problem)); // ✅ Ahora sí se ejecuta
        return new ResponseEntity<>(problem, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // 🔧 Builder de ProblemDetails
    private ProblemDetails buildProblemDetails(String type, String title, HttpStatus status,
                                               String detail, String instance,
                                               List<ProblemDetails.FieldError> fieldErrors,
                                               Map<String, Object> extensions,
                                               String errorId) {
        logger.info("[EXCEPTION] Respuesta ProblemDetails lista para enviar. Tipo: {}", type);
        return ProblemDetails.builder()
                .type(type)
                .title(title)
                .status(status.value())
                .detail(detail)
                .instance(instance)
                .extensions(extensions)
                .errorId(errorId)
                .fieldErrors(fieldErrors != null ? fieldErrors : List.of())
                .build();
    }

    // 🔧 Extensions: timestamp + traceId + errorId
    Map<String, Object> buildExtensions(String traceId, String errorId) {
        if (traceId != null && !traceId.isBlank()) {
            return Map.of(
                    "timestamp", LocalDateTime.now(),
                    "traceId", traceId,
                    "errorId", errorId
            );
        }
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "errorId", errorId
        );
    }

    // 🔥 Para FilterExceptionHandler — convertir ProblemDetails a JSON
    public String toJson(ProblemDetails problemDetails) {
        try {
            return objectMapper.writeValueAsString(problemDetails);
        } catch (IOException e) {
            logger.error("Error serializando ProblemDetails a JSON", e);
            return "{}";
        }
    }
}
