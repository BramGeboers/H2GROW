package be.ucll.se.team19backend.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import be.ucll.se.team19backend.authentication.model.*;
import be.ucll.se.team19backend.authentication.repo.PasswordResetTokenRepository;
import be.ucll.se.team19backend.security.JwtService;
import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserException;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RegisterResponse register(RegisterRequest request, String frontend, String backend, Boolean allRoles)
            throws UserException {
        if (userService.checkEmail(request.getEmail())) {
            throw new UserException("Email", "Email already in use");
        }

        if (userService.checkUsername(request.getUsername())) {
            throw new UserException("Username", "Username already in use");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UserException("Role", "Please provide a valid role (ADMIN, MEMBER)");
        }

        if (!allRoles) {
            if (role.equals(Role.ADMIN)) {
                throw new UserException("Role", "You cannot register as an admin");
            }
        }

        UserModel user = UserModel.builder()
                .username(request.getUsername())
                .email(request.getEmail().toLowerCase())
                .password(request.getPassword())
                .locked(false)
                .role(role)
                .build();
        UserModel savedUser = userService.addUser(user);

        return RegisterResponse.builder()
                .user(savedUser)
                .build();
    }

    public static String generateToken() {
        return UUID.randomUUID().toString();
    }

    public LoginResponse login(LoginRequest loginRequest) throws UserException {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
    
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException e) {
            throw new UserException("Authentication", "Invalid credentials");
        }
    
        UserModel user = userService.getUserByEmail(email);
    
        if (user == null) {
            throw new UserException("Authentication", "User not found");
        }
    
        if (user.getLocked()) {
            throw new AccountLockedException("Your account is locked. Please contact an administrator.");
        }
    
        String token = jwtService.generateToken(user);
        return LoginResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .token(token)
                .role(user.getRole())
                .id(user.getUserId())
                .build();
    }

    public void passwordResetRequest(String email) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, email, LocalDateTime.now().plusHours(24));
        passwordResetTokenRepository.save(passwordResetToken);
        emailService.sendPasswordResetEmail(email, token);
    }

    public void passwordReset(PasswordResetRequest passwordResetRequest) throws Exception {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(passwordResetRequest.getToken());

        if (passwordResetToken == null) {
            throw new UserException("Token", "Invalid token");
        }
        if (passwordResetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new UserException("Token", "The token has expired");
        }

        // Parse the email from the token
        String emailJson = passwordResetToken.getEmail();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> map = mapper.readValue(emailJson, Map.class);
        String email = map.get("email");

        System.out.println("Email from token: " + email);
        UserModel user = userService.getUserByEmail(email);
        System.out.println("User found: " + user);

        if (user == null) {
            throw new UserException("Email", "No user associated with this email");
        }
        user.setPassword(passwordEncoder.encode(passwordResetRequest.getNewPassword()));
        userService.updateUser(user);

        passwordResetTokenRepository.delete(passwordResetToken);
    }
    
}
