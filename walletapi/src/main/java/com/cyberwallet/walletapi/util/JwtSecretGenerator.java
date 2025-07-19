package com.cyberwallet.walletapi.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Herramienta utilitaria para generar claves JWT y escribirlas en el archivo .env.
 * Uso exclusivo en entornos de desarrollo y testing.
 */
public class JwtSecretGenerator {

    private static final Logger log = LoggerFactory.getLogger(JwtSecretGenerator.class);

    /**
     * Punto de entrada principal para ejecutarlo como herramienta de línea de comandos.
     */
    public static void main(String[] args) {
        try {
            String secret = generateJwtSecret();
            writeSecretToEnv(secret);
        } catch (Exception e) {
            log.error("⚠️ Error generando o escribiendo el JWT_SECRET: {}", e.getMessage(), e);
        }
    }

    /**
     * Genera un secreto JWT en Base64 para uso en HS256.
     */
    public static String generateJwtSecret() {
        byte[] secretBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        String secret = Base64.getEncoder().encodeToString(secretBytes);
        log.info("✅ Nuevo JWT_SECRET generado: {}", secret);
        return secret;
    }

    /**
     * Escribe o actualiza el JWT_SECRET en el archivo .env.
     */
    public static void writeSecretToEnv(String secret) {
        Path envPath = Paths.get(".env");
        List<String> lines = new ArrayList<>();
        boolean jwtSecretFound = false;

        try {
            if (Files.exists(envPath)) {
                lines = Files.readAllLines(envPath, StandardCharsets.UTF_8);
            }

            for (int i = 0; i < lines.size(); i++) {
                if (lines.get(i).trim().startsWith("JWT_SECRET=")) {
                    lines.set(i, "JWT_SECRET=" + secret);
                    jwtSecretFound = true;
                    break;
                }
            }

            if (!jwtSecretFound) {
                if (!lines.isEmpty() && !lines.get(lines.size() - 1).trim().isEmpty()
                        && !lines.get(lines.size() - 1).trim().startsWith("#")) {
                    lines.add("");
                }
                lines.add("JWT_SECRET=" + secret);
            }

            Files.write(envPath, lines, StandardCharsets.UTF_8);
            log.info("✅ JWT_SECRET escrito exitosamente en el archivo .env");
        } catch (IOException e) {
            log.error("⚠️ Error al actualizar el archivo .env: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar el archivo .env", e);
        }
    }
}
