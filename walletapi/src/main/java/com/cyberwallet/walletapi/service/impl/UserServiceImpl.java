package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.auth.AuthenticationResponse;
import com.cyberwallet.walletapi.dto.auth.RegisterRequest;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;
import com.cyberwallet.walletapi.dto.user.UserProfileResponseDTO;
import com.cyberwallet.walletapi.entity.ActivationToken;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.entity.UserStatus;
import com.cyberwallet.walletapi.entity.Wallet;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.PaisRepository;
import com.cyberwallet.walletapi.repository.ProvinciaRepository;
import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.security.SecurityUtils;
import com.cyberwallet.walletapi.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import com.cyberwallet.walletapi.entity.Pais;
import com.cyberwallet.walletapi.entity.Provincia;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;
    private final PaisRepository paisRepository;
    private final ProvinciaRepository provinciaRepository;

    // Método obsoleto removido - el registro se hace únicamente a través de AuthServiceImpl

    private void checkDuplicateFields(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, "El email ya está en uso: " + request.getEmail());
        }
        if (userRepository.existsByDni(request.getDni())) {
            throw new BusinessException(ErrorCode.DUPLICATE_DNI, "El DNI ya está en uso: " + request.getDni());
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME, "El nombre de usuario ya está en uso: " + request.getUsername());
        }
    }

    private LocalDateTime parseBirthDate(String fechaNacimiento) {
        try {
            LocalDateTime date = LocalDateTime.parse(fechaNacimiento + "T00:00:00");
            if (date.isAfter(LocalDateTime.now().minusYears(18))) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Debes ser mayor de 18 años para registrarte.");
            }
            return date;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Formato de fecha de nacimiento inválido.");
        }
    }

    private void validatePasswordStrength(String password) {
        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,64}$")) {
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "La contraseña no cumple con los requisitos de seguridad.");
        }
    }

    private User buildUserEntity(RegisterRequest request, LocalDateTime fechaNacimiento) {
        var pais = paisRepository.findById(request.getPaisId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "País no encontrado con ID: " + request.getPaisId()));

        var provincia = provinciaRepository.findById(request.getProvinciaId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Provincia no encontrada con ID: " + request.getProvinciaId()));

        if (!provincia.getPais().getId().equals(pais.getId())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La provincia no pertenece al país indicado.");
        }

        return User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail().trim().toLowerCase())
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .dni(request.getDni())
                .calle(request.getCalle().trim())
                .numero(request.getNumero())
                .fechaNacimiento(fechaNacimiento.toLocalDate())
                .genero(request.getGenero())
                .pais(pais)
                .provincia(provincia)
                .status(UserStatus.INACTIVE)
                .build();
    }

    // Método generateWalletAlias removido - se maneja en AuthServiceImpl

    @Override
    @Transactional
    public void actualizarPerfilUsuario(String email, UpdateUserProfileRequestDTO dto) {
        log.debug("[PROFILE] Actualizando perfil para email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + email));

        // 1. Validar EMAIL
        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(user.getEmail())) {
            String nuevoEmail = dto.getEmail().trim().toLowerCase();
            if (!nuevoEmail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Formato de email inválido.");
            }
            if (userRepository.existsByEmail(nuevoEmail)) {
                throw new BusinessException(ErrorCode.DUPLICATE_EMAIL, "El email ya está en uso: " + nuevoEmail);
            }
            user.setEmail(nuevoEmail);
        }

        // 2. Validar USERNAME (nuevo agregado)
        if (dto.getUsername() != null && !dto.getUsername().equalsIgnoreCase(user.getUsername())) {
            String nuevoUsername = dto.getUsername().trim();
            if (!nuevoUsername.matches("^[a-zA-Z0-9]{4,20}$")) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El username debe tener entre 4 y 20 caracteres alfanuméricos.");
            }
            if (userRepository.existsByUsername(nuevoUsername)) {
                throw new BusinessException(ErrorCode.DUPLICATE_USERNAME, "El nombre de usuario ya está en uso.");
            }
            user.setUsername(nuevoUsername);
        }

        // 3. Calle y número
        if (dto.getCalle() != null) {
            if (!dto.getCalle().matches("^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\\-\\.\\s]+$")) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La calle contiene caracteres inválidos.");
            }
            user.setCalle(dto.getCalle().trim());
        }

        if (dto.getNumero() != null) {
            if (dto.getNumero() < 1 || dto.getNumero() > 9999) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El número debe estar entre 1 y 9999.");
            }
            user.setNumero(dto.getNumero());
        }

        // 4. Cambio de contraseña (si corresponde)
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isBlank()) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "La contraseña actual es requerida.");
            }

            if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "La contraseña actual es incorrecta.");

            }

            validatePasswordStrength(dto.getNewPassword());
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        // 5. Validar teléfono (obligatorio y reglas)
        if (dto.getTelefono() == null || !dto.getTelefono().matches("^(?!0)(?!15)\\d{10}$")) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El teléfono debe tener exactamente 10 dígitos, no comenzar con 0 ni 15, ni contener letras, espacios o símbolos.");
        }
        if (dto.getTelefono().chars().distinct().count() == 1) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El teléfono no puede ser una secuencia de dígitos idénticos (ejemplo: 1111111111).");
        }
        user.setTelefono(dto.getTelefono());

        userRepository.save(user);
        log.info("[PROFILE] Perfil actualizado correctamente para: {}", email);
    }


    @Override
    public UserProfileResponseDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + email));

        return UserProfileResponseDTO.builder()
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .email(user.getEmail())
                .username(user.getUsername())
                .calle(user.getCalle())
                .numero(user.getNumero())
                .provincia(user.getProvincia() != null ? user.getProvincia().getNombre() : null)
                .pais(user.getPais() != null ? user.getPais().getNombre() : null)
                .genero(user.getGenero())
                .dni(user.getDni())
                .build();
    }

    @Override
    @Transactional
    public void changeUserPassword(String email, ChangePasswordRequestDTO dto) {
        log.debug("[PASSWORD] Cambiando contraseña para: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + email));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "La contraseña actual no es correcta.");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Las nuevas contraseñas no coinciden.");
        }

        validatePasswordStrength(dto.getNewPassword());
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        log.info("[PASSWORD] Contraseña cambiada correctamente para: {}", email);
    }

    @Override
    @Transactional
    public void deleteAuthenticatedUser() {
        UUID userId = securityUtils.getCurrentUserIdOrThrow();
        User user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.USER_NOT_FOUND,
                        "No se encontró el usuario autenticado o ya fue eliminado."
                ));

        userRepository.softDeleteById(userId);
    }
}