package com.cyberwallet.walletapi.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String identifier; // puede ser email o username
    private String password;
}
