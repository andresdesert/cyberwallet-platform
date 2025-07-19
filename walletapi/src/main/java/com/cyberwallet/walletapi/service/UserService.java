package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.dto.auth.AuthenticationResponse;
import com.cyberwallet.walletapi.dto.auth.RegisterRequest;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;
import com.cyberwallet.walletapi.dto.user.UserProfileResponseDTO;
import com.cyberwallet.walletapi.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Interfaz que define los métodos para gestión de perfil de usuario:
 * - Obtener datos de perfil
 * - Cambiar contraseña
 * - Actualizar datos del perfil
 * - Eliminar cuenta
 * 
 * Nota: El registro se maneja exclusivamente a través de AuthService
 */
public interface UserService {
    void actualizarPerfilUsuario(String email, UpdateUserProfileRequestDTO dto);

    UserProfileResponseDTO getUserProfile(String email);

    void changeUserPassword(String email, ChangePasswordRequestDTO dto);

    void deleteAuthenticatedUser();
}