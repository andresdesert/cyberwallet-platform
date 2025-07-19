package com.cyberwallet.walletapi.service;

public interface EmailService {
    void sendActivationEmail(String to, String activationToken);
}
