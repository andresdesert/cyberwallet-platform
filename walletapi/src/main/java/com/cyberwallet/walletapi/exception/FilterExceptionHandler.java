// src/main/java/com/cyberwallet/walletapi/exception/FilterExceptionHandler.java

package com.cyberwallet.walletapi.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.UUID;

/**
 * 🎯 Handler para capturar excepciones en filtros antes de llegar al controlador.
 * Asegura la respuesta uniforme RFC 7807.
 */
@Component
public class FilterExceptionHandler implements HandlerExceptionResolver {

    private static final Logger logger = LoggerFactory.getLogger(FilterExceptionHandler.class);

    private final GlobalExceptionHandler globalExceptionHandler;

    public FilterExceptionHandler(GlobalExceptionHandler globalExceptionHandler) {
        this.globalExceptionHandler = globalExceptionHandler;
    }

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String traceId = request.getHeader("X-Trace-Id");
        String errorId = UUID.randomUUID().toString();

        logger.warn("[FILTER-EXCEPTION] Capturada: {} - TraceId: {} - ErrorId: {}", ex.getClass().getName(), traceId, errorId, ex);

        try {
            ProblemDetails problemDetails = null;

            if (ex instanceof BusinessException) {
                BusinessException businessEx = (BusinessException) ex;
                problemDetails = globalExceptionHandler
                        .handleBusinessException(businessEx, request)
                        .getBody();
            } else {
                // Fallback genérico si la excepción no es BusinessException.
                problemDetails = ProblemDetails.builder()
                        .type(ErrorCode.INTERNAL_SERVER_ERROR.getType())
                        .title(ErrorCode.INTERNAL_SERVER_ERROR.getTitle())
                        .status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus().value())
                        .detail(ErrorCode.INTERNAL_SERVER_ERROR.getDefaultDetail())
                        .instance(request.getRequestURI())
                        .errorId(errorId)
                        .extensions(globalExceptionHandler.buildExtensions(traceId, errorId))
                        .build();
            }

            response.setStatus(problemDetails.getStatus());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.getWriter().write(globalExceptionHandler.toJson(problemDetails));
            response.getWriter().flush();
        } catch (IOException ioEx) {
            logger.error("Error serializando ProblemDetails a JSON", ioEx);
        }

        return new ModelAndView();
    }
}
