package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityUtils {

    public UUID getCurrentUserIdOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "No se pudo determinar el usuario autenticado.");
        }
        return ((UserDetailsImpl) auth.getPrincipal()).getId();
    }
}
