package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.auth.*;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.entity.*;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.entity.Pais;
import com.cyberwallet.walletapi.entity.Provincia;
import com.cyberwallet.walletapi.repository.*;
import com.cyberwallet.walletapi.security.JwtService;
import com.cyberwallet.walletapi.service.*;
import com.cyberwallet.walletapi.util.FieldNormalizer;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementación del servicio de autenticación.
 * Gestiona registro, autenticación, activación de cuenta, recuperación de contraseña, y más.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final ActivationTokenRepository activationTokenRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CountryValidationService countryValidationService;
    private final AliasGeneratorService aliasGeneratorService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final UserService userService;
    private final WalletService walletService;
    private final PaisRepository paisRepository;
    private final ProvinciaRepository provinciaRepository;

    /**
     * Registra un nuevo usuario validando todos los campos requeridos e integrando
     * el generador de alias para su billetera.
     *
     * @param request DTO de registro del usuario.
     * @return AuthenticationResponse con mensaje de éxito y token nulo.
     */
    @Override
    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        log.debug("[DEBUG] Iniciando registro de usuario: {}", request.getEmail());

        // Normalización explícita
        String nombre = FieldNormalizer.normalizeName(request.getNombre());
        String apellido = FieldNormalizer.normalizeName(request.getApellido());
        String email = FieldNormalizer.normalizeEmail(request.getEmail());
        String username = FieldNormalizer.normalizeUsername(request.getUsername());
        String calle = FieldNormalizer.normalizeDireccion(request.getCalle());
        Integer numero = request.getNumero();
        String genero = FieldNormalizer.normalizeGenero(request.getGenero());

        log.debug("[DEBUG] Campos normalizados: nombre={}, apellido={}, email={}, username={}", nombre, apellido, email, username);

        // Validaciones básicas
        if (!nombre.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,30}$")) {
            log.warn("[VALIDATION][NOMBRE] Valor inválido: '{}'.", nombre);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El nombre contiene caracteres no permitidos.");
        }
        if (!apellido.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,40}$")) {
            log.warn("[VALIDATION][APELLIDO] Valor inválido: '{}'.", apellido);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El apellido contiene caracteres no permitidos.");
        }
        if (!calle.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\\-\\.\\s]{3,100}$")) {
            log.warn("[VALIDATION][CALLE] Valor inválido: '{}'.", calle);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La calle contiene caracteres inválidos o es demasiado corta.");
        }
        if (numero == null || numero < 1 || numero > 9999) {
            log.warn("[VALIDATION][NUMERO] Valor inválido: '{}'.", numero);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El número de calle debe ser entre 1 y 9999.");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            log.warn("[VALIDATION][PASSWORD] Las contraseñas no coinciden para email: '{}'.", email);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Las contraseñas no coinciden.");
        }

        // 🔁 Validaciones de país y provincia (entidades)
        Pais pais = paisRepository.findById(request.getPaisId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "País no encontrado."));

        Provincia provincia = provinciaRepository.findById(request.getProvinciaId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Provincia no encontrada."));

        if (!provincia.getPais().getId().equals(pais.getId())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La provincia no pertenece al país seleccionado.");
        }

        // Validación de unicidad
        if (userRepository.existsByEmail(email)) {
            log.warn("[VALIDATION][EMAIL] Email duplicado: '{}'.", email);
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, "El email ya está registrado: " + email);
        }
        if (userRepository.existsByDni(request.getDni())) {
            log.warn("[VALIDATION][DNI] DNI duplicado: '{}'.", request.getDni());
            throw new BusinessException(ErrorCode.DUPLICATE_DNI, "DNI duplicado: " + request.getDni());
        }
        if (userRepository.existsByUsername(username)) {
            log.warn("[VALIDATION][USERNAME] Username duplicado: '{}'.", username);
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME, "El nombre de usuario ya está en uso: " + username);
        }

        // Validación edad
        LocalDateTime fechaNacimiento;
        try {
            fechaNacimiento = LocalDateTime.parse(request.getFechaNacimiento() + "T00:00:00");
        } catch (DateTimeParseException e) {
            log.warn("[VALIDATION][FECHA_NACIMIENTO] Formato inválido recibido: '{}'. Error: {}", request.getFechaNacimiento(), e.getMessage());
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Formato de fecha de nacimiento inválido.");
        }
        if (fechaNacimiento.isAfter(LocalDateTime.now().minusYears(18)) || fechaNacimiento.isBefore(LocalDateTime.now().minusYears(100))) {
            log.warn("[VALIDATION][FECHA_NACIMIENTO] Edad fuera de rango (18-100). Valor recibido: '{}'.", request.getFechaNacimiento());
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La edad debe ser entre 18 y 100 años.");
        }

        // Validaciones extra de password y alias
        if (!request.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,64}$")) {
            log.warn("[VALIDATION][PASSWORD] Password débil para email: '{}'.", email);
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "La contraseña no cumple con los requisitos de seguridad.");
        }

        if (!username.matches("^[a-zA-Z0-9_\\-\\.]+$")) {
            log.warn("[VALIDATION][USERNAME] Formato inválido: '{}'.", username);
            throw new BusinessException(ErrorCode.INVALID_ALIAS_FORMAT, "El nombre de usuario contiene caracteres no permitidos.");
        }

        if (!email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            log.warn("[VALIDATION][EMAIL] Formato inválido: '{}'.", email);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El email contiene caracteres no permitidos.");
        }

        // Validación de teléfono
        String telefono = request.getTelefono();
        if (telefono == null || !telefono.matches("^(?!0)(?!15)\\d{10}$")) {
            log.warn("[VALIDATION][TELEFONO] Formato inválido: '{}'.", telefono);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El teléfono debe tener exactamente 10 dígitos, no comenzar con 0 ni 15, ni contener letras, espacios o símbolos.");
        }
        if (telefono.chars().distinct().count() == 1) {
            log.warn("[VALIDATION][TELEFONO] Secuencia repetida: '{}'.", telefono);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El teléfono no puede ser una secuencia de dígitos idénticos (ejemplo: 1111111111).");
        }

        // 🔁 Alias generado y validado
        String alias;
        int maxAttempts = 5;
        int attempts = 0;
        do {
            alias = aliasGeneratorService.generateAlias();
            attempts++;
            if (!alias.matches("^[a-z.]{6,30}$") || alias.chars().filter(ch -> ch == '.').count() != 2) {
                log.warn("[ALIAS VALIDATION] Alias inválido generado: {}", alias);
                continue;
            }
            if (!userRepository.existsByWallet_Alias(alias)) {
                break;
            }
            log.warn("[ALIAS VALIDATION] Alias ya en uso, reintentando: {}", alias);
        } while (attempts < maxAttempts);

        if (attempts == maxAttempts) {
            throw new BusinessException(ErrorCode.ALIAS_ALREADY_EXISTS, "No se pudo generar un alias único después de varios intentos.");
        }
        if (alias == null || alias.isBlank()) {
            log.error("[ALIAS VALIDATION] Alias nulo o vacío generado en registro.");
            throw new BusinessException(ErrorCode.INVALID_ALIAS_FORMAT, "El alias generado no puede ser nulo ni vacío.");
        }
        log.info("\u001B[32m🟢 Alias final validado y único: {}\u001B[0m", alias);

        // Crear usuario
        User newUser = User.builder()
                .nombre(nombre)
                .apellido(apellido)
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .dni(request.getDni())
                .calle(calle)
                .numero(numero)
                .provincia(provincia)
                .pais(pais)
                .fechaNacimiento(fechaNacimiento.toLocalDate())
                .genero(genero)
                .status(UserStatus.ACTIVE)
                .telefono(telefono)
                .build();

        String cvu = walletService.generateCvu();
        newUser.setWallet(Wallet.builder()
                .alias(alias)
                .cvu(cvu)
                .balance(java.math.BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .user(newUser)
                .build());

        userRepository.save(newUser);
        log.debug("[DEBUG] Usuario registrado exitosamente: {}", newUser.getEmail());

        return AuthenticationResponse.builder()
                .accessToken(null)
                .tokenType("NONE")
                .message("Usuario registrado y activo. Ya puede iniciar sesión.")
                .alias(alias)
                .cvu(newUser.getWallet() != null ? newUser.getWallet().getCvu() : null)
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        String emailOrUsername = request.getEmailOrUsername();
        String password = request.getPassword();

        if (emailOrUsername == null || emailOrUsername.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El email o nombre de usuario no puede estar vacío.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La contraseña no puede estar vacía.");
        }

        String identifier = emailOrUsername.trim().toLowerCase();
        log.debug("[DEBUG] Intentando autenticación para: {}", identifier);

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "El usuario no existe."));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), password)
            );
        } catch (Exception ex) {
            log.warn("[SECURITY] Intento de login fallido para: {}", identifier);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Credenciales inválidas.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_INACTIVE, "La cuenta del usuario no está activa.");
        }

        String jwtToken = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );

        log.info("[SECURITY] Usuario autenticado exitosamente: {}", user.getEmail());

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
                .message("Autenticación exitosa.")
                .alias(user.getWallet() != null ? user.getWallet().getAlias() : null)
                .cvu(user.getWallet() != null ? user.getWallet().getCvu() : null)
                .build();
    }
    // ====================================
    // 🟢 Activación de cuenta
    // ====================================

    /**
     * Activa la cuenta de usuario mediante un token de activación válido.
     *
     * @param token Token de activación recibido.
     */
    @Override
    public void activateAccount(String token) {
        log.debug("[ACTIVATION] Iniciando activación de cuenta con token: {}", token);

        if (token == null || token.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El token no puede estar vacío.");
        }

        ActivationToken activationToken = activationTokenRepository.findByToken(token.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN, "El token de activación no existe."));

        if (activationToken.isUsed()) {
            log.warn("[ACTIVATION] Token ya utilizado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ya fue utilizado.");
        }

        if (activationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("[ACTIVATION] Token expirado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ha expirado.");
        }

        User user = activationToken.getUser();

        if (user.getStatus() == UserStatus.ACTIVE) {
            log.info("[ACTIVATION] Usuario ya estaba activo: {}", user.getEmail());
        } else {
            user.setStatus(UserStatus.ACTIVE);
            activationToken.setUsed(true);
            userRepository.save(user);
            activationTokenRepository.save(activationToken);
            log.info("\u001B[32m[ACTIVATION] Cuenta activada exitosamente: {}\u001B[0m", user.getEmail());
        }
    }


    // ====================================
    // 🔑 Recuperación de contraseña
    // ====================================

    /**
     * Envía un correo con instrucciones para restablecer la contraseña.
     *
     * @param request ForgotPasswordRequest con email del usuario.
     */

    @Override
    public void sendPasswordResetToken(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.debug("[🔐 RESET] Solicitud de recuperación para: {}", email);

        // 🔎 Validación de formato adicional
        if (!email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Formato de email inválido.");
        }

        // 🔎 Verificar existencia del usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "El usuario no existe."));

        // 🔥 Invalidar tokens previos
        List<PasswordResetToken> anteriores = passwordResetTokenService.findByUser(user.getId());
        for (PasswordResetToken token : anteriores) {
            token.setUsed(true);
            passwordResetTokenService.save(token);
            log.debug("[🔁 TOKEN] Token previo invalidado: {}", token.getToken());
        }

        // 🔐 Generar nuevo token
        String nuevoToken = UUID.randomUUID().toString();
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime vencimiento = ahora.plusHours(1);

        PasswordResetToken nuevo = PasswordResetToken.builder()
                .token(nuevoToken)
                .createdAt(ahora)
                .expiresAt(vencimiento)
                .used(false)
                .user(user)
                .build();

        passwordResetTokenService.save(nuevo);
        log.info("[📩 RESET] Nuevo token generado para {}: {}", email, nuevoToken);

        // 📧 TODO: Enviar correo con instrucciones (sin implementación aún)
    }
    @Override
    public void forgotPassword(String email) {
        log.debug("[🔐 RESET] Solicitud de recuperación para: {}", email);
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Seguridad: nunca revelar si el email existe
        if (optionalUser.isEmpty()) {
            log.info("[RESET] Email no encontrado: {}", email);
            return; // ✅ Terminar silenciosamente
        }

        User user = optionalUser.get();

        // 🔥 Invalidar tokens previos
        List<PasswordResetToken> anteriores = passwordResetTokenService.findByUser(user.getId());
        for (PasswordResetToken token : anteriores) {
            token.setUsed(true);
            passwordResetTokenService.save(token);
            log.debug("[🔁 TOKEN] Token previo invalidado: {}", token.getToken());
        }

        // 🔐 Generar nuevo token
        String nuevoToken = UUID.randomUUID().toString();
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime vencimiento = ahora.plusHours(1);

        PasswordResetToken nuevo = PasswordResetToken.builder()
                .token(nuevoToken)
                .createdAt(ahora)
                .expiresAt(vencimiento)
                .used(false)
                .user(user)
                .build();

        passwordResetTokenService.save(nuevo);
        log.info("[📩 RESET] Nuevo token generado para {}: {}", email, nuevoToken);

        // 📧 TODO: Enviar correo real
    }


    /**
     * Restablece la contraseña del usuario validando el token y las nuevas credenciales.
     *
     * @param request ResetPasswordRequest con token, email y nueva contraseña.
     */
    @Override
    public void resetPassword(ResetPasswordRequest request) {
        String token = request.getToken().trim();
        String email = request.getEmail().trim().toLowerCase();
        log.debug("[🔐 RESET] Intentando restablecer contraseña para: {} con token: {}", email, token);

        // 🔎 Buscar token en la base
        PasswordResetToken resetToken = passwordResetTokenService.findByToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN, "Token inválido o inexistente."));

        // 🔒 Validaciones del token
        if (resetToken.isUsed()) {
            log.debug("[❌ TOKEN] Token ya utilizado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ya fue utilizado.");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.debug("[❌ TOKEN] Token expirado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ha expirado.");
        }

        // 🔒 Validación de consistencia email-token
        User user = resetToken.getUser();
        if (!user.getEmail().equalsIgnoreCase(email)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token no corresponde al email ingresado.");
        }

        // 🔐 Validaciones de contraseña
        String newPassword = request.getNewPassword();
        String confirmPassword = request.getConfirmNewPassword();

        if (!newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,64}$")) {
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "La contraseña no cumple con los requisitos de seguridad.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Las contraseñas no coinciden.");
        }

        // 🔧 Guardar nueva contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenService.markTokenAsUsed(resetToken);

        log.info("[✅ RESET] Contraseña restablecida exitosamente para: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void changeUserPassword(String email, ChangePasswordRequestDTO dto) {
        log.debug("[🔐 CAMBIO CONTRASEÑA] Solicitud recibida para: {}", email);

        if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isBlank()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La contraseña actual no puede estar vacía.");
        }

        if (dto.getNewPassword() == null || dto.getNewPassword().isBlank()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La nueva contraseña no puede estar vacía.");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Las nuevas contraseñas no coinciden.");
        }

        if (!dto.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,64}$")) {
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "La nueva contraseña no cumple con los requisitos de seguridad.");
        }

        userService.changeUserPassword(email, dto);
        log.info("[✅ CAMBIO CONTRASEÑA] Contraseña actualizada exitosamente para: {}", email);
    }

    // ====================================
    // 🚪 Logout
    // ====================================

    /**
     * Cierra sesión invalidando el token JWT.
     *
     * @param token Token JWT a invalidar.
     */
    @Override
    @Transactional
    public void logout(String token) {
        log.debug("[🔐 LOGOUT] Intentando cerrar sesión con token: {}", token);

        if (token == null || token.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token de autenticación no puede estar vacío.");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (blacklistedTokenRepository.existsByToken(token)) {
            log.warn("[⚠️ LOGOUT] Token ya invalidado previamente: {}", token);
            throw new BusinessException(ErrorCode.ALREADY_LOGGED_OUT, "Este token ya fue invalidado anteriormente.");
        }

        Date expirationDate = jwtService.getExpirationDate(token);
        if (expirationDate == null) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "No se pudo determinar la expiración del token.");
        }

        LocalDateTime expiresAt = expirationDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                .token(token)
                .blacklistedAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .build();

        blacklistedTokenRepository.saveAndFlush(blacklistedToken);

        log.info("[✅ LOGOUT] Token invalidado y almacenado en blacklist: {}", token);
    }


    // ====================================
    // ✏️ Actualización de Perfil
    // ====================================

    /**
     * Actualiza el perfil del usuario, incluyendo email, dirección, país y/o contraseña.
     *
     * @param request          Datos de actualización.
     * @param currentUserEmail Email actual del usuario autenticado.
     */
    @Override
    public void updateProfile(UpdateUserProfileRequestDTO request, String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "El usuario no existe."));

        // ======================
        // ✉️ Email
        // ======================
        if (request.getEmail() != null && !request.getEmail().trim().equalsIgnoreCase(user.getEmail())) {
            String email = request.getEmail().trim().toLowerCase();

            if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El formato del email es inválido.");
            }
            if (userRepository.existsByEmail(email)) {
                throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, "El email ya está registrado: " + email);
            }

            user.setEmail(email);
            log.debug("[PROFILE] Email actualizado a: {}", email);
        }

        // ======================
// 🏠 Dirección
// ======================
        if (request.getCalle() != null && !request.getCalle().trim().isEmpty()) {
            String calle = request.getCalle().trim();
            if (!calle.matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\\-\\.\\s]{3,100}$")) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La calle contiene caracteres inválidos.");
            }
            user.setCalle(calle);
            log.debug("[PROFILE] Calle actualizada a: {}", calle);
        }

        if (request.getNumero() != null) {
            int numero = request.getNumero();
            if (numero < 1 || numero > 9999) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El número de calle debe estar entre 1 y 9999.");
            }
            user.setNumero(numero);
            log.debug("[PROFILE] Número de calle actualizado a: {}", numero);
        }


        if (request.getPaisId() != null) {
            Pais pais = countryValidationService.findPaisById(request.getPaisId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.VALIDATION_ERROR, "El país seleccionado no existe."));
            user.setPais(pais);
            log.debug("[PROFILE] País actualizado a: {} (ID: {})", pais.getNombre(), pais.getId());

            // Si viene provinciaId, validamos relación con el país
            if (request.getProvinciaId() != null) {
                Provincia provincia = countryValidationService.findProvinciaById(request.getProvinciaId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.VALIDATION_ERROR, "La provincia seleccionada no existe."));

                if (!provincia.getPais().getId().equals(pais.getId())) {
                    throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La provincia no pertenece al país seleccionado.");
                }

                user.setProvincia(provincia);
                log.debug("[PROFILE] Provincia actualizada a: {} (ID: {})", provincia.getNombre(), provincia.getId());
            }
        }

        // ======================
        // 🔐 Cambio de contraseña
        // ======================
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Debes ingresar tu contraseña actual para cambiarla.");
            }

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "La contraseña actual es incorrecta.");
            }

            if (!request.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,64}$")) {
                throw new BusinessException(ErrorCode.WEAK_PASSWORD, "La nueva contraseña no cumple con los requisitos de seguridad.");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            log.debug("[PROFILE] Contraseña actualizada correctamente.");
        }

        userRepository.save(user);
        log.info("[PROFILE] Perfil actualizado con éxito para: {}", user.getEmail());
    }
}
