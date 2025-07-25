package com.cyberwallet.walletapi.security;

import com.cyberwallet.walletapi.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Getter
public class UserDetailsImpl implements UserDetails {

    private final User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Si no usás roles aún, devolvé colección vacía
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // o .getUsername() si usás username en lugar de email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // modificar si tenés lógica para expiración
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // idem
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // idem
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() == com.cyberwallet.walletapi.entity.UserStatus.ACTIVE;
    }

    public UUID getId() {
        return user.getId();
    }
}
