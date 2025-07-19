package com.cyberwallet.walletapi.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class WordLoader {

    private static final Logger log = LoggerFactory.getLogger(WordLoader.class);

    /**
     * Carga palabras desde un archivo de texto.
     * Filtra líneas vacías y solo permite caracteres alfabéticos.
     *
     * @param inputStream InputStream del archivo a procesar.
     * @return Lista de palabras válidas.
     * @throws IOException si ocurre un error de lectura.
     */
    public static List<String> loadWords(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            log.error("[WORD LOADER] El InputStream es nulo. No se puede cargar el diccionario.");
            throw new IOException("El InputStream del diccionario es nulo.");
        }


        List<String> words = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim().toLowerCase();
                if (!line.isEmpty() && line.matches("^[a-z]+$")) {
                    words.add(line);
                }
            }
            log.info("[WORD LOADER] Diccionario cargado exitosamente con {} palabras.", words.size());
        } catch (IOException e) {
            log.error("[WORD LOADER] Error cargando palabras: {}", e.getMessage(), e);
            throw e;
        }

        return words;
    }
}
