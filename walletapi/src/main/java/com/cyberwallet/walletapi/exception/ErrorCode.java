package com.cyberwallet.walletapi.exception;

import org.springframework.http.HttpStatus;

/**
 * Enum que representa todos los códigos de error utilizados en la aplicación.
 * Cumple con la especificación RFC 7807 y contiene:
 * - type: la URI única que identifica el tipo de error.
 * - title: un título amigable para el usuario.
 * - defaultDetail: un detalle explicativo.
 * - httpStatus: el código HTTP que debe retornar.
 */
public enum ErrorCode {
    // 1️⃣ Errores de Identidad y Usuario
    DUPLICATE_EMAIL(
            "urn:cyberwallet:problems:duplicate-email",
            "Email ya registrado",
            "El email ya está en uso.",
            HttpStatus.CONFLICT
    ),
    DUPLICATE_DNI(
            "urn:cyberwallet:problems:duplicate-dni",
            "DNI ya registrado",
            "El DNI ya está en uso.",
            HttpStatus.CONFLICT
    ),
    DUPLICATE_USERNAME(
            "urn:cyberwallet:problems:duplicate-username",
            "Nombre de usuario ya registrado",
            "El nombre de usuario ya está en uso.",
            HttpStatus.CONFLICT
    ),

    INVALID_CREDENTIALS(
            "urn:cyberwallet:problems:invalid-credentials",
            "Credenciales inválidas",
            "El correo electrónico o la contraseña son incorrectos.",
            HttpStatus.UNAUTHORIZED
    ),
    ACCOUNT_INACTIVE(
            "urn:cyberwallet:problems:account-inactive",
            "Cuenta inactiva",
            "La cuenta aún no ha sido activada.",
            HttpStatus.UNAUTHORIZED
    ),
    USER_NOT_FOUND(
            "urn:cyberwallet:problems:user-not-found",
            "Usuario no encontrado",
            "El usuario solicitado no existe en el sistema.",
            HttpStatus.UNAUTHORIZED
    ),
    NOT_FOUND(
            "urn:cyberwallet:problems:not-found",
            "Recurso no encontrado",
            "El recurso solicitado no existe o fue eliminado.",
            HttpStatus.NOT_FOUND
    ),

    // Tokens de seguridad y activación
    INVALID_TOKEN(
            "urn:cyberwallet:problems:invalid-token",
            "Token inválido o expirado",
            "El token JWT proporcionado no es válido o ha expirado.",
            HttpStatus.UNAUTHORIZED
    ),
    ACTIVATION_TOKEN_EXPIRED(
            "urn:cyberwallet:problems:activation-token-expired",
            "Token de activación expirado",
            "El token de activación ha expirado. Solicita uno nuevo.",
            HttpStatus.UNAUTHORIZED
    ),
    ACTIVATION_TOKEN_USED(
            "urn:cyberwallet:problems:activation-token-used",
            "Token de activación ya utilizado",
            "Este token de activación ya fue usado previamente.",
            HttpStatus.UNAUTHORIZED
    ),

    UNAUTHORIZED_ACCESS(
            "urn:cyberwallet:problems:unauthorized-access",
            "Acceso no autorizado",
            "No tienes permiso para acceder a este recurso.",
            HttpStatus.UNAUTHORIZED
    ),
    UNAUTHORIZED(
            "urn:cyberwallet:problems:unauthorized",
            "No autorizado",
            "Acceso denegado. No se proporcionaron credenciales válidas.",
            HttpStatus.UNAUTHORIZED
    ),
    ALREADY_LOGGED_OUT(
            "urn:cyberwallet:problems:already-logged-out",
            "Sesión ya cerrada",
            "El token ya ha sido invalidado previamente. Vuelve a iniciar sesión.",
            HttpStatus.UNAUTHORIZED
    ),
    // 2️⃣ Errores de Validación y Reglas de Negocio
    WEAK_PASSWORD(
            "urn:cyberwallet:problems:weak-password",
            "Contraseña insegura",
            "La contraseña no cumple con los requisitos de seguridad.",
            HttpStatus.BAD_REQUEST
    ),
    VALIDATION_ERROR(
            "urn:cyberwallet:problems:validation-error",
            "Datos inválidos",
            "Hay errores en los datos enviados. Por favor, revisa los campos.",
            HttpStatus.BAD_REQUEST
    ),
    BUSINESS_RULE_VIOLATION(
            "urn:cyberwallet:problems:business-rule-violation",
            "Violación de regla de negocio",
            "No se pudo completar la operación debido a una restricción de negocio.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_ARGUMENT(
            "urn:cyberwallet:problems:invalid-argument",
            "Argumento inválido",
            "El argumento proporcionado no es válido o está mal formado.",
            HttpStatus.BAD_REQUEST
    ),
    OPERATION_NOT_ALLOWED(
            "urn:cyberwallet:problems:operation-not-allowed",
            "Operación no permitida",
            "No tienes permiso para realizar esta operación.",
            HttpStatus.FORBIDDEN
    ),

    // Seguridad
    RATE_LIMIT_EXCEEDED(
            "urn:cyberwallet:problems:rate-limit-exceeded",
            "Rate limit excedido",
            "Has excedido el límite de solicitudes permitidas. Intenta de nuevo más tarde.",
            HttpStatus.TOO_MANY_REQUESTS
    ),
    INVALID_AMOUNT(
            "urn:cyberwallet:problems:invalid-amount",
            "Monto inválido",
            "El monto excede el límite permitido o es inválido.",
            HttpStatus.BAD_REQUEST
    ),
    MISSING_AUTHORIZATION_HEADER(
            "urn:cyberwallet:problems:missing-auth-header",
            "Falta token de autorización",
            "No se proporcionó el token de autenticación requerido.",
            HttpStatus.UNAUTHORIZED
    ),

    // 3️⃣ Errores Técnicos y de Dominio
    METHOD_NOT_ALLOWED(
            "urn:cyberwallet:problems:method-not-allowed",
            "Método no permitido",
            "El método HTTP utilizado no está permitido para este recurso.",
            HttpStatus.METHOD_NOT_ALLOWED
    ),
    REQUEST_TIMEOUT(
            "urn:cyberwallet:problems:request-timeout",
            "Tiempo de espera agotado",
            "El servidor no pudo completar la solicitud a tiempo. Intenta nuevamente.",
            HttpStatus.REQUEST_TIMEOUT
    ),

    // Wallet y Transferencias
    WALLET_NOT_FOUND(
            "urn:cyberwallet:problems:wallet-not-found",
            "Billetera no encontrada",
            "No se encontró una billetera asociada al usuario.",
            HttpStatus.NOT_FOUND
    ),
    INSUFFICIENT_FUNDS(
            "urn:cyberwallet:problems:insufficient-funds",
            "Fondos insuficientes",
            "No hay suficiente saldo para completar la transacción.",
            HttpStatus.BAD_REQUEST
    ),
    TRANSACTION_FAILED(
            "urn:cyberwallet:problems:transaction-failed",
            "Transacción fallida",
            "La transacción no pudo ser completada debido a un error interno.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INVALID_ALIAS_FORMAT(
            "urn:cyberwallet:problems:invalid-alias-format",
            "Formato de alias inválido",
            "El alias no cumple con el formato requerido.",
            HttpStatus.BAD_REQUEST
    ),
    ALIAS_ALREADY_EXISTS(
            "urn:cyberwallet:problems:alias-already-exists",
            "Alias ya en uso",
            "El alias elegido ya está registrado.",
            HttpStatus.CONFLICT
    ),
    SELF_TRANSFER(
            "urn:cyberwallet:problems:self-transfer",
            "Transferencia a la misma cuenta",
            "No se puede transferir a uno mismo.",
            HttpStatus.BAD_REQUEST
    ),
    TRANSFER_PERSISTENCE_ERROR(
            "urn:cyberwallet:problems:transfer-persistence-error",
            "Error al procesar transferencia",
            "Ha ocurrido un error al guardar la transferencia.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    RECEIVER_NOT_FOUND(
            "urn:cyberwallet:problems:receiver-not-found",
            "Usuario destinatario no encontrado",
            "No se encontró un usuario con el alias especificado.",
            HttpStatus.NOT_FOUND
    ),

    // Tarjetas Virtuales
    INVALID_CARD_FORMAT(
            "urn:cyberwallet:problems:invalid-card-format",
            "Formato de tarjeta inválido",
            "El número de tarjeta proporcionado no cumple con el formato esperado.",
            HttpStatus.BAD_REQUEST
    ),
    CARD_EXPIRED(
            "urn:cyberwallet:problems:card-expired",
            "Tarjeta vencida",
            "La tarjeta utilizada para la carga está vencida.",
            HttpStatus.BAD_REQUEST
    ),
    CARDHOLDER_NAME_MISMATCH(
            "urn:cyberwallet:problems:cardholder-name-mismatch",
            "Nombre del titular inválido",
            "El nombre del titular de la tarjeta no coincide con el usuario autenticado.",
            HttpStatus.BAD_REQUEST
    ),
    AMOUNT_EXCEEDS_LIMIT(
            "urn:cyberwallet:problems:amount-exceeds-limit",
            "Monto excede límite",
            "El monto de la operación excede el límite permitido.",
            HttpStatus.TOO_MANY_REQUESTS
    ),

    // Movimientos y Exportación
    MOVEMENT_NOT_FOUND(
            "urn:cyberwallet:problems:movement-not-found",
            "Movimiento no encontrado",
            "No se encontró la transacción solicitada.",
            HttpStatus.NOT_FOUND
    ),
    EXPORT_FAILED(
            "urn:cyberwallet:problems:export-failed",
            "Error al exportar datos",
            "Ha ocurrido un error interno al generar el archivo de exportación.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INVALID_CARD_NUMBER(
            "urn:cyberwallet:problems:invalid-card-number",
            "Número de tarjeta inválido",
            "El número de tarjeta no pasa la validación de Luhn.",
            HttpStatus.BAD_REQUEST
    ),
    INVALID_CARD_EXPIRATION(
            "urn:cyberwallet:problems:invalid-card-expiration",
            "Fecha de expiración inválida",
            "La tarjeta está vencida o su fecha de expiración es incorrecta.",
            HttpStatus.BAD_REQUEST
    ),
    NULL_POINTER(
            "urn:cyberwallet:problems:null-pointer",
            "Error interno",
            "Se encontró una referencia nula inesperada.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INTERNAL_SERVER_ERROR(
            "urn:cyberwallet:problems:internal-server-error",
            "Error interno del servidor",
            "Ha ocurrido un error inesperado.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    DATABASE_ERROR(
            "urn:cyberwallet:problems:database-error",
            "Error de base de datos",
            "Se produjo un error al acceder a la base de datos.",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    EXTERNAL_SERVICE_ERROR(
            "urn:cyberwallet:problems:external-service-error",
            "Error en servicio externo",
            "Se produjo un error al comunicarse con un servicio externo.",
            HttpStatus.BAD_GATEWAY
    ),

    SERVICE_UNAVAILABLE(
            "urn:cyberwallet:problems:service-unavailable",
            "Servicio no disponible",
            "El servicio no está disponible temporalmente. Intenta nuevamente más tarde.",
            HttpStatus.SERVICE_UNAVAILABLE
    );

    private final String type;
    private final String title;
    private final String defaultDetail;
    private final HttpStatus httpStatus;

    ErrorCode(String type, String title, String defaultDetail, HttpStatus httpStatus) {
        this.type = type;
        this.title = title;
        this.defaultDetail = defaultDetail;
        this.httpStatus = httpStatus;
    }

    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getDefaultDetail() { return defaultDetail; }
    public HttpStatus getHttpStatus() { return httpStatus; }
}

