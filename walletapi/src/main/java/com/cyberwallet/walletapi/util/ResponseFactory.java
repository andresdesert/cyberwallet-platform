package com.cyberwallet.walletapi.util;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public class ResponseFactory {

    private static final Logger log = LoggerFactory.getLogger(ResponseFactory.class);

    /**
     * Respuesta exitosa con status personalizado y datos adjuntos.
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(HttpStatus status, String message, T data) {
        log.debug("[RESPONSE FACTORY] Generando respuesta exitosa [{}] con mensaje: {}", status.value(), message);
        ApiResponse<T> response = buildResponse(message, data);
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Respuesta exitosa con status 200 OK y datos adjuntos.
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        log.debug("[RESPONSE FACTORY] Generando respuesta exitosa [200] con mensaje: {}", message);
        return success(HttpStatus.OK, message, data);
    }

    /**
     * Respuesta exitosa con status 200 OK y sin datos.
     */
    public static ResponseEntity<ApiResponse<Void>> success(String message) {
        log.debug("[RESPONSE FACTORY] Generando respuesta exitosa [200] sin datos con mensaje: {}", message);
        ApiResponse<Void> response = buildResponse(message, null);
        return ResponseEntity.ok(response);
    }

    /**
     * Construcción centralizada de ApiResponse.
     */
    private static <T> ApiResponse<T> buildResponse(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
