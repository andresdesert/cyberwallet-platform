package com.cyberwallet.walletapi.exception;

import lombok.Getter;
import java.util.List;
import com.cyberwallet.walletapi.exception.ProblemDetails.FieldError;

/**
 * Excepción de negocio centralizada y alineada con RFC 7807.
 * Permite reportar errores de negocio y validaciones de manera uniforme.
 * Incluye opcionalmente errores de campos y soporta un identificador de error para trazabilidad distribuida.
 */
@Getter
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Código de error alineado con RFC 7807 (incluye type, title, status y defaultDetail).
     */
    private final ErrorCode errorCode;

    /**
     * Descripción detallada del error (permite personalizar el defaultDetail).
     */
    private final String detail;

    /**
     * Lista opcional de errores de validación de campos (usado en validaciones de DTOs).
     */
    private final List<ProblemDetails.FieldError> fieldErrors;

    /**
     * Identificador único de error (opcional) para trazabilidad distribuida.
     */
    private final String errorId;

    // 🔗 Constructores

    /**
     * Constructor para excepciones de negocio sin errores de campo ni errorId.
     *
     * @param errorCode Código de error predefinido.
     * @param detail    Mensaje de error detallado.
     */
    public BusinessException(ErrorCode errorCode, String detail) {
        super(detail);
        this.errorCode = errorCode;
        this.detail = detail;
        this.fieldErrors = null;
        this.errorId = null;
    }

    /**
     * Constructor para excepciones de negocio con errores de campo.
     *
     * @param errorCode   Código de error predefinido.
     * @param detail      Mensaje de error detallado.
     * @param fieldErrors Lista de errores de validación de campos.
     */
    public BusinessException(ErrorCode errorCode, String detail, List<ProblemDetails.FieldError> fieldErrors) {
        super(detail);
        this.errorCode = errorCode;
        this.detail = detail;
        this.fieldErrors = fieldErrors;
        this.errorId = null;
    }

    /**
     * Constructor para excepciones de negocio con causa subyacente.
     *
     * @param errorCode Código de error predefinido.
     * @param detail    Mensaje de error detallado.
     * @param cause     Excepción causante.
     */
    public BusinessException(ErrorCode errorCode, String detail, Throwable cause) {
        super(detail, cause);
        this.errorCode = errorCode;
        this.detail = detail;
        this.fieldErrors = null;
        this.errorId = null;
    }

    /**
     * Constructor para excepciones de negocio con errores de campo y causa subyacente.
     *
     * @param errorCode   Código de error predefinido.
     * @param detail      Mensaje de error detallado.
     * @param fieldErrors Lista de errores de validación de campos.
     * @param cause       Excepción causante.
     */
    public BusinessException(ErrorCode errorCode, String detail, List<ProblemDetails.FieldError> fieldErrors, Throwable cause) {
        super(detail, cause);
        this.errorCode = errorCode;
        this.detail = detail;
        this.fieldErrors = fieldErrors;
        this.errorId = null;
    }

    /**
     * Constructor extendido para excepciones con errorId.
     *
     * @param errorCode   Código de error predefinido.
     * @param detail      Mensaje de error detallado.
     * @param fieldErrors Lista de errores de validación de campos (puede ser null).
     * @param cause       Excepción causante (puede ser null).
     * @param errorId     Identificador único del error.
     */
    public BusinessException(ErrorCode errorCode, String detail, List<ProblemDetails.FieldError> fieldErrors, Throwable cause, String errorId) {
        super(detail, cause);
        this.errorCode = errorCode;
        this.detail = detail;
        this.fieldErrors = fieldErrors;
        this.errorId = errorId;
    }

    // 🔗 Categoría: Excepciones especializadas

    /**
     * Excepción para errores de validación en campos concretos.
     */
    public static class InvalidFieldException extends BusinessException {
        public InvalidFieldException(ErrorCode errorCode, String detail) {
            super(errorCode, detail);
        }
    }
}
