package be.ucll.se.team19backend.authentication.repo;

import be.ucll.se.team19backend.authentication.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
    PasswordResetToken findByToken(String token);
}