package com.cyberwallet.walletapi.entity;

/**
 * Enum que representa los diferentes estados que puede tener un usuario en la plataforma.
 *
 * <ul>
 *   <li>{@link #ACTIVE} - Usuario activo y con acceso completo.</li>
 *   <li>{@link #INACTIVE} - Usuario registrado pero aún no ha completado la activación (p. ej. email sin confirmar).</li>
 *   <li>{@link #SUSPENDED} - Usuario temporalmente suspendido por incumplimiento de políticas u otras razones.</li>
 *   <li>{@link #BLOCKED} - Usuario bloqueado permanentemente o inhabilitado por un administrador.</li>
 * </ul>
 *
 * 🔒 Se recomienda que el backend valide las transiciones de estado para evitar inconsistencias.
 */
public enum UserStatus {

    /**
     * Usuario activo y con acceso a todas las funcionalidades.
     */
    ACTIVE,

    /**
     * Usuario registrado pero aún no activado completamente (p. ej. email sin confirmar).
     */
    INACTIVE,

    /**
     * Usuario suspendido temporalmente (p. ej. por fraude o conducta sospechosa).
     */
    SUSPENDED,

    /**
     * Usuario bloqueado permanentemente por un administrador.
     */
    BLOCKED;

    /**
     * Método de utilidad para validar si un estado es transitorio (INACTIVE o SUSPENDED).
     *
     * @return true si es transitorio; false si es ACTIVE o BLOCKED.
     */
    public boolean isTransitory() {
        return this == INACTIVE || this == SUSPENDED;
    }
}
