package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${JWT_SECRET}")
    private String jwtSecretHex;

    @Value("${JWT_EXPIRATION_MS:86400000}")
    private long jwtExpirationMs;

    public String generateToken(UserDetails userDetails) {
        log.debug("[JWT] Generando token para usuario: {}", userDetails.getUsername());
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .setId(UUID.randomUUID().toString())
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        log.debug("[JWT] Extrayendo username del token.");
        return extractClaim(token, Claims::getSubject);
    }

    public Date getExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = parseAllClaimsWithExceptionHandling(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            final String username = claims.getSubject();
            final Date expiration = claims.getExpiration();

            if (username == null) {
                log.warn("[JWT] Token sin username.");
                return false;
            }

            boolean valid = username.equals(userDetails.getUsername()) && !expiration.before(new Date());
            if (valid) {
                log.debug("[JWT] Token válido para usuario: {}", userDetails.getUsername());
            } else {
                log.warn("[JWT] Token inválido por expiración o mismatch.");
            }

            return valid;

        } catch (JwtException | IllegalArgumentException e) {
            log.warn("[JWT] Token inválido: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseAllClaimsWithExceptionHandling(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException ex) {
            log.warn("[JWT] Token expirado: {}", ex.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "Token expirado");
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("[JWT] Error al parsear token: {}", ex.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "Token inválido");
        }
    }

    public Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretHex));
    }

    public String extractUsernameFromBearer(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            log.warn("[JWT] Header Bearer malformado o ausente.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "Formato de token inválido");
        }
        log.debug("[JWT] Extrayendo username desde header Bearer.");
        String token = bearerToken.substring(7);
        return extractUsername(token);
    }

    public void setJwtSecretHex(String jwtSecretHex) {
        this.jwtSecretHex = jwtSecretHex;
    }

    public void setJwtExpirationMs(long jwtExpirationMs) {
        this.jwtExpirationMs = jwtExpirationMs;
    }
}
