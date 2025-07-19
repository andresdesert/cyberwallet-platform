// src/main/java/com/cyberwallet/walletapi/dto/ProvinceRequestDTO.java
package com.cyberwallet.walletapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProvinceRequestDTO {

    @NotBlank(message = "El país no puede estar vacío.")
    @Size(min = 2, max = 2, message = "El código de país debe tener exactamente 2 letras.")
    @Pattern(regexp = "^[A-Z]{2}$", message = "El código de país debe tener dos letras mayúsculas.")
    private String pais;
}
