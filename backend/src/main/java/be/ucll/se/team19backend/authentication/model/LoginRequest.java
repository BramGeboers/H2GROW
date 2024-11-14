package be.ucll.se.team19backend.authentication.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    private String email;

    @NotBlank
    @Length(min = 4)
    private String password;

    public String getEmail() {
        return email;
    }
}
