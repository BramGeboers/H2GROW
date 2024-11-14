package be.ucll.se.team19backend.security;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

        private final AuthenticationProvider authenticationProvider;
        private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow only this origin
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // Allow these HTTP methods
                configuration.setAllowCredentials(true);
                configuration.addAllowedHeader("authorization");
                configuration.addAllowedHeader("content-type");
                return configuration;
            }))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/plants/**").permitAll()
                                                .requestMatchers("/plantmodel/**").permitAll()
                    .requestMatchers("/media/**").permitAll()
                    .requestMatchers("/files/**").permitAll()
                    .requestMatchers("/auth/**").permitAll()
                    .requestMatchers("/user/**").permitAll()
                    .requestMatchers("/watering/**").permitAll()
                    .requestMatchers("/manage/**").hasAnyAuthority("ADMIN")
                    .requestMatchers("/", "/auth/**", "/*", "/swagger-ui/**", "/v3/api-docs/**", "/h2-console", "/h2-console/**").permitAll()
                    .requestMatchers("/**").hasAnyAuthority("ADMIN")
                    .anyRequest().denyAll()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}