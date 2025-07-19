package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.ProblemDetails;
import com.cyberwallet.walletapi.repository.BlacklistedTokenRepository;
import com.cyberwallet.walletapi.security.util.PublicPathMatcher;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Order(1)
public class JwtBlacklistFilter extends OncePerRequestFilter {

    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    private static final Logger log = LoggerFactory.getLogger(JwtBlacklistFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean skip = PublicPathMatcher.isPublicPath(path);
        if (skip) {
            log.debug("\u001B[34m[SECURITY] 🔓 Skipping JwtBlacklistFilter for public path: {}\u001B[0m", path);
        }
        return skip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String method = request.getMethod();
        final String uri = request.getRequestURI();
        final String ip = request.getRemoteAddr();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            final String token = authHeader.substring(7).trim();

            if (token.isEmpty()) {
                log.warn("\u001B[31m[SECURITY] ❌ Token vacío detectado en Authorization header.\u001B[0m");
            } else {
                log.debug("\u001B[36m[SECURITY] 🎫 Verificando token en blacklist: {} [{} {} desde {}]\u001B[0m",
                        token, method, uri, ip);

                if (blacklistedTokenRepository.existsByToken(token)) {
                    log.warn("\u001B[31m[SECURITY] ⚠️ Token en blacklist detectado. Acceso denegado. [{} {}]\u001B[0m",
                            method, uri);
                    SecurityContextHolder.clearContext();

                    ProblemDetails problemDetails = ProblemDetails.builder()
                            .type("https://api.cyberwallet.com/problems/already-logged-out")
                            .title("Sesión ya cerrada")
                            .status(HttpStatus.UNAUTHORIZED.value())
                            .detail("El token ya fue invalidado. Debes volver a iniciar sesión.")
                            .instance(uri)
                            .extensions(Map.of("timestamp", LocalDateTime.now()))
                            .build();

                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write(objectMapper.writeValueAsString(problemDetails));
                    response.getWriter().flush(); // ✅ importante para asegurar envío
                    return;
                }
            }

        } else {
            log.debug("\u001B[34m[SECURITY] No se detectó Authorization header válido [{} {} desde {}].\u001B[0m",
                    method, uri, ip);
        }

        filterChain.doFilter(request, response);
    }
}
