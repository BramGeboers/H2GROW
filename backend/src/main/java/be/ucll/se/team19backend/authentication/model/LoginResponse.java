package be.ucll.se.team19backend.authentication.model;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import be.ucll.se.team19backend.user.model.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String username;
    private String email;
    private String token;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Long id;
}