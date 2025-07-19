package com.cyberwallet.walletapi.service;

import java.time.LocalDateTime;

public interface BlacklistedTokenService {
    void addTokenToBlacklist(String token, LocalDateTime expiresAt);
    boolean isTokenBlacklisted(String token);
    void clearExpiredTokens();
}
