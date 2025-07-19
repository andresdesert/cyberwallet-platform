package com.cyberwallet.walletapi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta con los datos de perfil de usuario.
 * Totalmente sincronizado con UpdateUserProfileRequestDTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDTO {

    private String nombre;
    private String apellido;
    private String email;
    private String username;
    private String dni;
    private String telefono;
    private String fechaNacimiento;
    private String genero;
    private String pais;
    private String provincia;
    private String calle;
    private Integer numero;
}
