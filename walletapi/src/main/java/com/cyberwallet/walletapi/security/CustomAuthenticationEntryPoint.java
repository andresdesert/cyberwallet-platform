package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.exception.ProblemDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * EntryPoint personalizado que devuelve una respuesta JSON estandarizada (RFC 7807)
 * cuando un usuario no autenticado intenta acceder a un recurso protegido.
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {

        ProblemDetails problem = ProblemDetails.builder()
                .type("https://cyberwallet.com/errors/unauthorized")
                .title("No autorizado")
                .status(HttpStatus.UNAUTHORIZED.value())
                .detail("Acceso denegado. Debes iniciar sesión.")
                .timestamp(LocalDateTime.now())
                .instance(request.getRequestURI())  // 🔁 Corregido
                .extensions(Map.of("auth", "Falta token JWT o es inválido"))  // 🔁 Cambiado de "errors" a "extensions"
                .build();

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), problem);
    }
}

