package com.cyberwallet.walletapi.validator;

import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CardValidator {

    private static final long MAX_AMOUNT = 3_000_000L;

    public static void validateCardHolderMatchesUserName(String cardHolder, String userName) {
        if (cardHolder == null || userName == null) {
            throw new BusinessException(
                    ErrorCode.CARDHOLDER_NAME_MISMATCH,
                    "El nombre del titular de la tarjeta es inválido o no está registrado."
            );
        }

        String normalizedCardHolder = normalizeName(cardHolder);
        String normalizedUserName = normalizeName(userName);

        log.debug("[CARD] Validando nombre titular tarjeta: '{}', registrado: '{}'", normalizedCardHolder, normalizedUserName);

        if (!normalizedCardHolder.contains(normalizedUserName)) {
            throw new BusinessException(
                    ErrorCode.CARDHOLDER_NAME_MISMATCH,
                    "El nombre del titular de la tarjeta no coincide con el registrado en el sistema. Por favor verifica tus datos."
            );
        }
    }

    public static void validateCardBIN(String cardNumber) {
        if (cardNumber == null || !cardNumber.matches("\\d{16}")) {
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El número de tarjeta debe tener 16 dígitos.");
        }

        String type = getCardTypeFromBIN(cardNumber);
        log.debug("[CARD] Tipo de tarjeta detectado por BIN: {}", type);

        if ("UNKNOWN".equalsIgnoreCase(type)) {
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El BIN de la tarjeta no es válido (Visa, Mastercard, Amex).");
        }

        if (!isValidLuhn(cardNumber)) {
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El número de tarjeta no pasa la validación de Luhn.");
        }


        // Ahora usamos getCardTypeFromBIN para validar el BIN. Si devuelve "UNKNOWN", significa que no es válido.
        if ("UNKNOWN".equalsIgnoreCase(getCardTypeFromBIN(cardNumber))) { //
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El BIN de la tarjeta no es válido (Visa, Mastercard, Amex)."); //
        }

        if (!isValidLuhn(cardNumber)) { //
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El número de tarjeta no pasa la validación de Luhn."); //
        }
    }

    public static void validateExpirationDate(String expirationDate) {
        if (!isValidExpirationDate(expirationDate)) { //
            throw new BusinessException(ErrorCode.CARD_EXPIRED, "La tarjeta está vencida o su fecha de expiración es inválida."); //
        }
    }

    public static void validateAmount(long amount) {
        if (amount > MAX_AMOUNT) { //
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto excede el límite permitido de 3 millones."); //
        }
    }

    /**
     * Determina el tipo de tarjeta (VISA, MASTERCARD, AMEX) basándose en su BIN.
     * Si el BIN no es reconocido, devuelve "UNKNOWN".
     *
     * @param cardNumber El número de tarjeta completo.
     * @return El tipo de tarjeta como String, o "UNKNOWN".
     */
    public static String getCardTypeFromBIN(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 2) { //
            return "UNKNOWN";
        }
        if (cardNumber.startsWith("4")) { //
            return "VISA";
        }
        String twoDigits = cardNumber.substring(0, 2);
        if (twoDigits.startsWith("51") || twoDigits.startsWith("52") ||
                twoDigits.startsWith("53") || twoDigits.startsWith("54") ||
                twoDigits.startsWith("55")) { //
            return "MASTERCARD";
        }
        if (twoDigits.startsWith("34") || twoDigits.startsWith("37")) { //
            return "AMEX";
        }
        return "UNKNOWN";
    }

    // Se mantiene privado porque la validación de BIN ya maneja el caso de BIN inválido con excepción.
    // Este método solo se usa para determinar el tipo *después* de que se sabe que es un BIN válido.
    private static boolean isValidBIN(String cardNumber) { //
        String cardType = getCardTypeFromBIN(cardNumber);
        return !"UNKNOWN".equalsIgnoreCase(cardType);
    }

    private static boolean isValidLuhn(String cardNumber) {
        int sum = 0; //
        boolean alternate = false; //
        for (int i = cardNumber.length() - 1; i >= 0; i--) { //
            int n = Integer.parseInt(cardNumber.substring(i, i + 1)); //
            if (alternate) { //
                n *= 2; //
                if (n > 9) { //
                    n = (n % 10) + 1; //
                }
            }
            sum += n; //
            alternate = !alternate; //
        }
        return (sum % 10 == 0); //
    }

    private static boolean isValidExpirationDate(String expirationDate) {
        try {
            LocalDate expDate = LocalDate.parse(
                            "01/" + expirationDate,
                            DateTimeFormatter.ofPattern("dd/MM/yy")
                    ).withDayOfMonth(1)
                    .plusMonths(1)
                    .minusDays(1);
            return expDate.isAfter(LocalDate.now());
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    private static String normalizeName(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD); //
        return normalized.replaceAll("\\p{M}", "").toLowerCase().trim(); //
    }
}