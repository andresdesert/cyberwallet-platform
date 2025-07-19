package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.dto.auth.*;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.user.UpdateUserProfileRequestDTO;

public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
    void activateAccount(String token);
    void logout(String token);
    void sendPasswordResetToken(ForgotPasswordRequest request); // 🔥
    void resetPassword(ResetPasswordRequest request); // 🔥
    void updateProfile(UpdateUserProfileRequestDTO request, String currentUserEmail);
    void changeUserPassword(String email, ChangePasswordRequestDTO dto);
    void forgotPassword(String email);

}
