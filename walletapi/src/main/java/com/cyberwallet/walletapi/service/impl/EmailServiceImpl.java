package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {


    @Override
    public void sendActivationEmail(String to, String activationToken) {
        // Simula el envío de email registrando en el log
        log.info("[MOCK EMAIL] To: {}\nSubject: Activación de Cuenta\nBody: Su código de activación es: {}", to, activationToken);
        // Aquí, si usas MailSender real, lanzarías EmailSendException si falla
    }
}
