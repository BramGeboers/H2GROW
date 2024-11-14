    package be.ucll.se.team19backend.authentication.model;

    import jakarta.persistence.Entity;
    import jakarta.persistence.Id;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDateTime;

    @Data
    @Entity
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public class PasswordResetToken {

        @Id
        private String token;

        private String email;

        private LocalDateTime expirationDate;
    }