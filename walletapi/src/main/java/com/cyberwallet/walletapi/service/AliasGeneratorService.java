package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.util.WordLoader;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
public class AliasGeneratorService {

    private final UserRepository userRepository;
    private final Random random = new Random();
    private List<String> wordDictionary;

    // ✅ Constructor principal usado por Spring
    @Autowired
    public AliasGeneratorService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Constructor alternativo solo para tests unitarios
    public AliasGeneratorService(List<String> testDictionary) {
        this.userRepository = null;
        this.wordDictionary = testDictionary;
    }

    @PostConstruct
    public void initDictionaryIfNeeded() {
        if (wordDictionary == null || wordDictionary.isEmpty()) {
            try {
                var resource = new ClassPathResource("palabras.txt");
                wordDictionary = WordLoader.loadWords(resource.getInputStream());
                if (wordDictionary.size() < 100) {
                    throw new IllegalStateException("El diccionario de palabras es demasiado pequeño para generar alias únicos y seguros.");
                }
                log.info("[ALIAS] Diccionario de palabras cargado: {} palabras", wordDictionary.size());
            } catch (Exception e) {
                log.error("[ALIAS] Error al cargar palabras.txt: {}", e.getMessage(), e);
                throw new IllegalStateException("No se pudo cargar el diccionario de palabras para alias.");
            }
        }
    }

    public String generateAlias() {
        if (wordDictionary == null || wordDictionary.size() < 100) {
            throw new IllegalStateException("Diccionario de palabras no cargado o insuficiente para alias.");
        }
        String alias;
        int maxTries = 10;
        int tries = 0;
        do {
            String w1 = wordDictionary.get(random.nextInt(wordDictionary.size()));
            String w2 = wordDictionary.get(random.nextInt(wordDictionary.size()));
            String w3 = wordDictionary.get(random.nextInt(wordDictionary.size()));
            alias = w1 + "." + w2 + "." + w3;
            tries++;
            // Validación reforzada: solo minúsculas, 6-30 caracteres, exactamente dos puntos, sin números
            boolean formatoValido = alias.matches("^[a-z]{2,}\\.[a-z]{2,}\\.[a-z]{2,}$")
                && alias.length() >= 6 && alias.length() <= 30
                && alias.chars().filter(ch -> ch == '.').count() == 2;
            if (!formatoValido) {
                log.warn("[ALIAS VALIDATION] Alias generado inválido: {} (intento {}/{})", alias, tries, maxTries);
                continue;
            }
            if (userRepository != null && userRepository.existsByWallet_Alias(alias)) {
                log.warn("[ALIAS VALIDATION] Alias ya en uso: {} (intento {}/{})", alias, tries, maxTries);
                continue;
            }
            break;
        } while (tries < maxTries);
        if (tries == maxTries) {
            log.error("[ALIAS VALIDATION] No se pudo generar un alias válido y único tras {} intentos", maxTries);
            throw new IllegalStateException("No se pudo generar un alias válido y único tras varios intentos");
        }
        log.info("[ALIAS] Alias generado: {} (intentos: {})", alias, tries);
        return alias;
    }
}
