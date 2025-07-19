package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.entity.ActivationToken;
import com.cyberwallet.walletapi.entity.User;

public interface ActivationTokenService {
    ActivationToken generateAndSaveTokenForUser(User user);
    ActivationToken getValidToken(String token);
    void markTokenAsUsed(ActivationToken token);
}
