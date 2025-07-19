package com.cyberwallet.walletapi.util;

import com.cyberwallet.walletapi.dto.auth.RegisterRequest;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
@Builder(toBuilder = true)
public class RegisterRequestTestData {

    private String nombre;
    private String apellido;
    private String email;
    private String dni;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String genero;
    private Long pais;       // ✅ Tipo corregido
    private Long provincia;  // ✅ Tipo corregido
    private String calle;
    private Integer numero;
    private String username;
    private String password;
    private String confirmPassword;

    public RegisterRequest toRegisterRequest() {
        return new RegisterRequest(
                calle,
                numero,
                provincia,
                pais,
                nombre,
                apellido,
                dni,
                formatDate(fechaNacimiento),
                genero,
                email,
                username,
                password,
                confirmPassword,
                telefono
        );
    }

    private String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // ------------------------
    // Factory methods para tests
    // ------------------------

    public static RegisterRequestTestData valid() {
        return RegisterRequestTestData.builder()
                .nombre("Andrés")
                .apellido("Simahan")
                .email("andres.test." + System.currentTimeMillis() + "@mail.com")
                .dni("40440440")
                .telefono("1123456789")
                .fechaNacimiento(LocalDate.of(1995, 6, 15))
                .genero("Masculino")
                .pais(1L)             // ✅ Long literal
                .provincia(1L)        // ✅ Long literal
                .calle("Avenida Siempre Viva")
                .numero(742)
                .username("andresTest")
                .password("StrongP@ss123")
                .confirmPassword("StrongP@ss123")
                .build();
    }

    public static RegisterRequestTestData invalidEmail() {
        return valid().toBuilder()
                .email("no-valido@")
                .build();
    }

    public static RegisterRequestTestData mismatchedPasswords() {
        return valid().toBuilder()
                .confirmPassword("otraClave123")
                .build();
    }

    public static RegisterRequestTestData underageUser() {
        return valid().toBuilder()
                .fechaNacimiento(LocalDate.now().minusYears(12)) // menor de edad
                .build();
    }

    public static RegisterRequestTestData invalidDni() {
        return valid().toBuilder()
                .dni("0001234") // empieza en 0 y tiene menos dígitos
                .build();
    }

    public static RegisterRequestTestData invalidCountry() {
        return valid().toBuilder()
                .pais(9999L) // ID de país no existente
                .build();
    }

    public static RegisterRequestTestData emptyProvince() {
        return valid().toBuilder()
                .provincia(null)
                .build();
    }
}
