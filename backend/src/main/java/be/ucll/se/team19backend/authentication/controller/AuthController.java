package be.ucll.se.team19backend.authentication.controller;

import be.ucll.se.team19backend.authentication.model.ErrorResponse;
import be.ucll.se.team19backend.authentication.model.LoginRequest;
import be.ucll.se.team19backend.authentication.model.LoginResponse;
import be.ucll.se.team19backend.authentication.model.PasswordResetRequest;
import be.ucll.se.team19backend.authentication.model.RegisterRequest;
import be.ucll.se.team19backend.authentication.model.RegisterResponse;
import be.ucll.se.team19backend.authentication.service.AuthService;
import be.ucll.se.team19backend.user.model.UserException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.login(loginRequest);
            return ResponseEntity.ok(loginResponse);
        } catch (UserException e) {
            if (e.getMessage().equals("Invalid credentials")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
            } else if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
            } else if (e.getMessage().equals("Your account is locked. Please contact an administrator.")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(e.getMessage()));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(e.getMessage()));
            }
        }
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestHeader HttpHeaders headers,
            @Valid @RequestBody RegisterRequest registerRequest) {
        String frontend = headers.getFirst("Origin");
        String backend = headers.getFirst("Host");
        try {
            return authService.register(registerRequest, frontend, backend, false);
        } catch (UserException e) {
            if (e.getMessage().equals("Email already in use")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
            } else if (e.getMessage().equals("Username already in use")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Registration failed");
            }
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public String logout() {
        return "logout";
    }

    @PostMapping("/password-reset-request")
        public void passwordResetRequest(@RequestBody String email) {
        authService.passwordResetRequest(email);
    }

    @PostMapping("/password-reset")
        public void passwordReset(@Valid @RequestBody PasswordResetRequest passwordResetRequest) throws Exception {
        authService.passwordReset(passwordResetRequest);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ UserException.class })
    public Map<String, String> handleServiceExceptions(UserException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put(ex.getField(), String.format("%s: %s", ex.getField(), ex.getMessage()));
        return errors;
    }
}
