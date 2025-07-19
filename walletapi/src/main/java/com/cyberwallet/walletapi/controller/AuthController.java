package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.auth.*;
import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.exception.ProblemDetails;
import com.cyberwallet.walletapi.security.JwtService;
import com.cyberwallet.walletapi.service.AuthService;
import com.cyberwallet.walletapi.service.PasswordResetTokenService;
import com.cyberwallet.walletapi.service.UserService;
import com.cyberwallet.walletapi.util.ResponseFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Endpoints para autenticación de usuarios (login, registro, activación, recuperación de contraseña y logout).")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final JwtService jwtService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final UserService userService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    // ===============================
    // 🔐 Registro
    // ===============================
    @Operation(summary = "Registrar nuevo usuario", description = "Crea un nuevo usuario y devuelve un JWT válido si el registro es exitoso. Valida país y otros campos.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Usuario registrado correctamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de registro inválidos (RFC7807).", content = @Content(schema = @Schema(implementation = ProblemDetails.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email, DNI o nombre de usuario duplicado.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.debug("[AUTH] Intentando registrar usuario: {}", request.getEmail());
        AuthenticationResponse authResponse = authService.register(request);
        log.info("[AUTH] Usuario registrado exitosamente: {}", authResponse.getMessage());
        return ResponseFactory.success(HttpStatus.CREATED, "Usuario registrado exitosamente.", authResponse);
    }

    // 🔑 Login
    @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve un JWT válido.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Autenticación exitosa.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Credenciales inválidas o cuenta inactiva.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        String emailOrUsername = request.getEmailOrUsername() != null ? request.getEmailOrUsername().trim().toLowerCase() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        log.debug("[AUTH] Intento de login para: {}", emailOrUsername);

        if (emailOrUsername.isBlank() || password.isBlank()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Email/usuario y contraseña no pueden estar vacíos.");
        }

        AuthenticationRequest normalizedRequest = AuthenticationRequest.builder()
                .emailOrUsername(emailOrUsername)
                .password(password)
                .build();

        AuthenticationResponse authResponse = authService.authenticate(normalizedRequest);
        log.info("[AUTH] Usuario autenticado exitosamente: {}", emailOrUsername);
        return ResponseFactory.success("Autenticación exitosa.", authResponse);
    }

    // ✅ Activación de cuenta
    @Operation(summary = "Activar cuenta", description = "Activa la cuenta del usuario a través del token de activación.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cuenta activada exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token inválido o expirado.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<Void>> activateAccount(@RequestParam String token) {
        log.debug("[AUTH] Intentando activar cuenta con token: {}", token);
        authService.activateAccount(token);
        log.info("[AUTH] Cuenta activada exitosamente para token: {}", token);
        return ResponseFactory.success("Cuenta activada exitosamente.");
    }

    // 🔐 Recuperación de contraseña
    @Operation(summary = "Solicitud de recuperación de contraseña", description = "Envía un correo con instrucciones para restablecer la contraseña.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Correo de recuperación enviado exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "El email no está registrado.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        log.debug("[AUTH] Endpoint público de recuperación de contraseña recibido: {}", request.getEmail());
        authService.forgotPassword(request.getEmail()); // Usa el método seguro
        return ResponseEntity.ok(ApiResponse.success("Solicitud de recuperación procesada correctamente."));
    }

    @Operation(summary = "Eliminar tokens de recuperación expirados", description = "Elimina todos los tokens de restablecimiento de contraseña que hayan expirado.")
    @DeleteMapping("/password-reset-tokens/expired")
    public ResponseEntity<ApiResponse<Void>> deleteExpiredTokens() {
        log.debug("[AUTH] Eliminando tokens de recuperación expirados.");
        passwordResetTokenService.deleteExpiredTokens(LocalDateTime.now());
        return ResponseFactory.success("Tokens de recuperación expirados eliminados correctamente.");
    }
    //🔑 Reset de contraseña
    @Operation(summary = "Restablecer contraseña con token", description = "Permite restablecer la contraseña usando un token enviado por email.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Token inválido o expirado.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.debug("[AUTH] Restablecimiento de contraseña usando token: {}", request.getToken());
        authService.resetPassword(request);
        log.info("[AUTH] Contraseña restablecida con éxito para token: {}", request.getToken());
        return ResponseFactory.success("Contraseña restablecida exitosamente.");
    }
    // 🔑 Cambio de contraseña
    @Operation(summary = "Cambiar contraseña", description = "Permite al usuario cambiar su contraseña actual.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Contraseña cambiada exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Contraseña actual incorrecta.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        log.debug("[AUTH] Cambio de contraseña para usuario: {}", email);

        authService.changeUserPassword(email, request);
        log.info("[AUTH] Contraseña actualizada correctamente para: {}", email);
        return ResponseFactory.success("Contraseña actualizada exitosamente.");
    }

    // 🛠️ Actualizar perfil
    @Operation(summary = "Actualizar perfil", description = "Permite al usuario actualizar su email, dirección, país y contraseña.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de actualización inválidos (RFC7807).", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @Valid @RequestBody UpdateUserProfileRequestDTO request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);
        log.debug("[AUTH] Actualización de perfil solicitada por: {}", email);

        userService.actualizarPerfilUsuario(email, request);
        log.info("[AUTH] Perfil actualizado correctamente para: {}", email);
        return ResponseEntity.ok(ApiResponse.success("Perfil actualizado correctamente."));
    }

    // 🚪 Logout
    @Operation(summary = "Cerrar sesión", description = "Agrega el token actual a la blacklist para invalidarlo.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logout exitoso."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token inválido o ya fue invalidado.",
                    content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader
    ) {
        log.debug("[AUTH] Solicitud de logout recibida. Header: {}", authHeader);

        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "El token Authorization es requerido para cerrar sesión.");
        }

        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);

        return ResponseFactory.success("Sesión cerrada exitosamente.");
    }

    // 🧪 Endpoint temporal para crear usuario de prueba (SOLO DESARROLLO)
    @Operation(summary = "Crear usuario de prueba", description = "Crea un usuario de prueba para desarrollo. SOLO DISPONIBLE EN DESARROLLO.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Usuario de prueba creado exitosamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Error en la creación del usuario de prueba.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/test-users")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> createTestUser() {
        log.info("[AUTH] Creando usuario de prueba para desarrollo");
        
        RegisterRequest testUser = new RegisterRequest();
        testUser.setCalle("Calle de Prueba");
        testUser.setNumero(123);
        testUser.setProvinciaId(1L); // Buenos Aires
        testUser.setPaisId(1L); // Argentina
        testUser.setNombre("Usuario");
        testUser.setApellido("Prueba");
        testUser.setDni("40123456");
        testUser.setFechaNacimiento("1990-01-01");
        testUser.setGenero("Masculino");
        testUser.setEmail("email@email.com");
        testUser.setUsername("warholy");
        testUser.setPassword("StrongP@ss123");
        testUser.setConfirmPassword("StrongP@ss123");
        testUser.setTelefono("1123456789");

        AuthenticationResponse authResponse = authService.register(testUser);
        log.info("[AUTH] Usuario de prueba creado exitosamente: {}", authResponse.getMessage());
        return ResponseFactory.success(HttpStatus.CREATED, "Usuario de prueba creado exitosamente.", authResponse);
    }
}
