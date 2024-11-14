package be.ucll.se.team19backend.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserModel implements UserDetails {

    @Id
    @Hidden
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long userId;

    @NotBlank
    private String username;

    @Schema(defaultValue = "test@ucll.be")
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Length(min = 4)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean locked;

    private Integer easterEggsFound = 0;

    public void foundEasterEgg() {
        if (this.easterEggsFound == null) {
            this.easterEggsFound = 0;
        }
        this.easterEggsFound++;
    }

    public int getEasterEggsFound() {
        return easterEggsFound != null ? easterEggsFound : 0;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(role.name()));
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));

        return authorities;
    }

    

    @Override
    @JsonIgnore
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}