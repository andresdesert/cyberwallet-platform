package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Spring Security usa este método para cargar un usuario por email (username).
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("[SECURITY] Buscando usuario por email: {}", email);

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> {
                    log.warn("[SECURITY] Usuario no encontrado: {}", email);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado.");
                });

        log.info("[SECURITY] Usuario encontrado: {} ({})", user.getEmail(), user.getId());
        return new UserDetailsImpl(user);
    }
}
