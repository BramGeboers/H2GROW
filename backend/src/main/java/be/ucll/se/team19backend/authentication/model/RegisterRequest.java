package be.ucll.se.team19backend.authentication.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    private String username;

    @Email
    @NotBlank
    @Schema(defaultValue = "test@ucll.be")
    private String email;

    @NotBlank
    @Length(min = 4)
    private String password;

    @NotNull
    private String role;
}
