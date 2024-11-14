package be.ucll.se.team19backend.authentication.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.se.team19backend.authentication.model.VerifyToken;

public interface VerifyRepository extends JpaRepository<VerifyToken, String> {
    Optional<VerifyToken> findByToken(String token);
}
