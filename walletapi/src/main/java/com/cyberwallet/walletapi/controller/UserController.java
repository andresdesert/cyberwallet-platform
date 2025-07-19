package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;
import com.cyberwallet.walletapi.dto.user.UserProfileResponseDTO;
import com.cyberwallet.walletapi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "Endpoints para gestión de usuario (perfil, contraseña)")
public class UserController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Operation(summary = "Obtener perfil de usuario", description = "Devuelve los datos del usuario logueado.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Perfil obtenido exitosamente.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado.",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class))
            )
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponseDTO>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        String traceId = UUID.randomUUID().toString();

        log.info("[USER] Solicitando perfil para email: {} - TraceId: {}", email, traceId);

        UserProfileResponseDTO profileDto = userService.getUserProfile(email);

        ApiResponse<UserProfileResponseDTO> response = ApiResponse.<UserProfileResponseDTO>builder()
                .message("Perfil obtenido exitosamente.")
                .data(profileDto)
                .timestamp(LocalDateTime.now())
                .build();

        log.info("[USER] Perfil obtenido para email: {} - TraceId: {}", email, traceId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cambiar contraseña", description = "Permite al usuario cambiar su contraseña actual.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Contraseña cambiada exitosamente.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Contraseña actual incorrecta.",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class))
            )
    })
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changeUserPassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequestDTO requestDTO) {

        String email = authentication.getName();
        String traceId = UUID.randomUUID().toString();

        log.info("[USER] Solicitud de cambio de contraseña para email: {} - TraceId: {}", email, traceId);

        userService.changeUserPassword(email, requestDTO);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Contraseña cambiada exitosamente.")
                .timestamp(LocalDateTime.now())
                .build();

        log.info("[USER] Contraseña cambiada para email: {} - TraceId: {}", email, traceId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizar perfil", description = "Actualiza los datos de perfil del usuario autenticado.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Perfil actualizado exitosamente.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Usuario no encontrado.",
                    content = @Content(schema = @Schema(implementation = ProblemDetail.class))
            )
    })
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateUserProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserProfileRequestDTO requestDTO) {

        String email = authentication.getName();
        String traceId = UUID.randomUUID().toString();

        log.info("[USER] Solicitud de actualización de perfil para email: {} - TraceId: {}", email, traceId);

        userService.actualizarPerfilUsuario(email, requestDTO);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Perfil actualizado exitosamente.")
                .timestamp(LocalDateTime.now())
                .build();

        log.info("[USER] Perfil actualizado para email: {} - TraceId: {}", email, traceId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Eliminar perfil", description = "Elimina la cuenta del usuario autenticado permanentemente.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Perfil eliminado exitosamente.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    @DeleteMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteOwnProfile() {
        userService.deleteAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Perfil eliminado exitosamente."));
    }
}
