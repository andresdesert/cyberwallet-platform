package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.exception.FilterExceptionHandler;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class LoginRateLimiter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Value("${cyberwallet.ratelimit.enabled:true}")
    private boolean rateLimitEnabled;

    @Autowired
    private FilterExceptionHandler filterExceptionHandler;

    @Autowired
    private Environment environment;

    private Bucket createNewBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1))))
                .build();
    }

    private boolean isTestProfileActive() {
        String[] profiles = environment.getActiveProfiles();
        if (profiles == null) return false;
        for (String profile : profiles) {
            if ("test".equalsIgnoreCase(profile) || "dev".equalsIgnoreCase(profile)) {
                return true;
            }
        }
        return false;
    }

    private boolean isRateLimitEnabled() {
        return rateLimitEnabled && !isTestProfileActive();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = getBucketKey(request);

        try {
            if (isRateLimitEnabled()) {
                Bucket bucket = buckets.computeIfAbsent(key, k -> createNewBucket());

                if (!bucket.tryConsume(1)) {
                    log.warn("\u001B[33m[RATE LIMITER] ⚠️ Excedido el límite para clave: {}\u001B[0m", key);
                    throw new BusinessException(ErrorCode.RATE_LIMIT_EXCEEDED, "Demasiadas solicitudes. Por favor intente más tarde.");
                }
            }

            filterChain.doFilter(request, response);
            log.debug("\u001B[34m[RATE LIMITER] ✅ Intento permitido para clave: {}\u001B[0m", key);
        } catch (BusinessException ex) {
            log.error("\u001B[31m[RATE LIMITER] ❌ Error: {}\u001B[0m", ex.getMessage());
            filterExceptionHandler.resolveException(request, response, null, ex);
        }
    }

    public String getBucketKey(HttpServletRequest request) {
        String testId = request.getHeader("X-Test-Id");
        if (testId != null && !testId.isBlank()) {
            log.debug("\u001B[34m[RATE LIMITER] X-Test-Id detectado: {}\u001B[0m", testId);
            return "test-" + testId;
        }

        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank()) {
            String clientIp = ip.split(",")[0].trim();
            log.debug("\u001B[34m[RATE LIMITER] X-Forwarded-For detectado: {}\u001B[0m", clientIp);
            return clientIp;
        }

        String remoteAddr = request.getRemoteAddr();
        log.debug("\u001B[34m[RATE LIMITER] RemoteAddr detectado: {}\u001B[0m", remoteAddr);
        return remoteAddr;
    }

    /** 🔁 Utilizado para reiniciar los buckets en tests */
    public synchronized void resetAllBuckets() {
        log.debug("\u001B[34m[RATE LIMITER] 🔄 Reseteando todos los buckets\u001B[0m");
        buckets.clear();
    }

    /** 🔁 Opcional: Resetear bucket individual por IP o header */
    public synchronized void resetBucket(String key) {
        log.debug("\u001B[34m[RATE LIMITER] 🔄 Reseteando bucket para clave: {}\u001B[0m", key);
        buckets.remove(key);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        log.debug("\u001B[34m[FILTER] URI recibido: {}\u001B[0m", uri);
        return !uri.endsWith("/api/v1/auth/login");
    }
}
