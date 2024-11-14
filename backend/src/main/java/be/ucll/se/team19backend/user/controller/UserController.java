package be.ucll.se.team19backend.user.controller;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import be.ucll.se.team19backend.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import be.ucll.se.team19backend.security.JwtService;
import be.ucll.se.team19backend.user.model.UserException;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/all")
    @SecurityRequirement(name = "bearerAuth")
    public List<UserModel> getAllUsers(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        return userService.getAllUsers(email);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserModel user = userService.getUserById(id);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserModel user) {
        try {
            UserModel newUser = userService.addUser(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (UserException e) {
            Map<String, String> errors = new HashMap<>();
            errors.put(e.getField(), String.format("%s: %s", e.getField(), e.getMessage()));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id, @Valid @RequestBody UserModel user) {
        UserModel existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        user.setUserId(id); // Ensure the ID remains the same
        UserModel updatedUser = userService.updateUser(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserModel existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestParam String role) {
        try {
            UserModel updatedUser = userService.updateUserRole(userId, role);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{userId}/lock")
    public ResponseEntity<?> lockUser(@PathVariable Long userId) {
        try {
            UserModel updatedUser = userService.lockUser(userId);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{userId}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Long userId) {
        try {
            UserModel updatedUser = userService.unlockUser(userId);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/easter-eggs")
    public ResponseEntity<?> incrementEasterEggsFound(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        UserModel user = userService.incrementEasterEggsFound(email);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
    }
    
    @GetMapping("/get-easter-eggs")
    public ResponseEntity<?> getEasterEggsFound(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        Integer easterEggsFound = userService.getEasterEggsFound(email);
        if (easterEggsFound == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(easterEggsFound, HttpStatus.OK);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach((error) -> {
            System.out.println(error);
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
