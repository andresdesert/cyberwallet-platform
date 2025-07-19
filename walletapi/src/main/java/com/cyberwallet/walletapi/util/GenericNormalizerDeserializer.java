package com.cyberwallet.walletapi.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * Deserializador genérico para normalizar cadenas (trim, lower, espacios).
 * Se usa con @JsonDeserialize(using = GenericNormalizerDeserializer.class)
 */
@Slf4j
public class GenericNormalizerDeserializer extends JsonDeserializer<String> {

    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String rawValue = p.getValueAsString();

        if (rawValue == null) {
            return null;
        }

        String normalizedValue = rawValue.trim().replaceAll("\\s{2,}", " ");

        String fieldName = p.currentName();
        if (fieldName != null) {
            if (fieldName.equalsIgnoreCase("email") || fieldName.equalsIgnoreCase("username")) {
                normalizedValue = normalizedValue.toLowerCase();
            }

            log.debug("[NORMALIZER] [{}] → '{}'", fieldName, normalizedValue);
        } else {
            log.debug("[NORMALIZER] Campo sin nombre → '{}'", normalizedValue);
        }

        return normalizedValue;
    }
}
