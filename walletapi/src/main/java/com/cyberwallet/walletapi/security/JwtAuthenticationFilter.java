package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.security.util.PublicPathMatcher;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Order(2)
public class JwtAuthenticationFilter extends OncePerRequestFilter implements Ordered {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public int getOrder() {
        return 2;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean skip = PublicPathMatcher.isPublicPath(path);
        if (skip) {
            log.debug("\u001B[34m[SECURITY] 🔓 Skipping JwtAuthenticationFilter for public path: {}\u001B[0m", path);
        }
        return skip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("\u001B[33m[JWT] ⛔ Authorization header ausente o mal formado.\u001B[0m");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = authHeader.substring(7);
            username = jwtService.extractUsername(jwt);
        } catch (JwtException e) {
            log.warn("\u001B[31m[JWT] 🧨 Token JWT mal formado o inválido: {}\u001B[0m", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("\u001B[32m[JWT] ✅ Token válido. Usuario autenticado: {}\u001B[0m", username);
            } else {
                log.warn("\u001B[31m[JWT] 🚫 Token inválido para usuario: {}\u001B[0m", username);
            }
        }

        filterChain.doFilter(request, response);

        log.debug("[SECURITY] ✅ JwtAuthenticationFilter finalizado para: {}", request.getServletPath());
    }
}
