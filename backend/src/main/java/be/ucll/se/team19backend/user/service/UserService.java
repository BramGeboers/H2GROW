package be.ucll.se.team19backend.user.service;

import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserException;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.repo.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserModel addUser(UserModel user) throws UserException {
        if (userRepository.findByEmail(user.getEmail()).orElse(null) != null) {
            throw new UserException("email", "Email already in use");
        }
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        return userRepository.save(user);
    }

    public UserModel updateUser(UserModel user) {
        return userRepository.save(user);
    }

    public List<UserModel> getAllUsers(String email) {
        UserModel user = getUserByEmail(email);

        if (user.getRole().equals(Role.ADMIN)) {
            return userRepository.findAll();
        }

        throw new RuntimeException("You are not authorized to do this");
    }

    public Boolean checkEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Boolean checkUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public UserModel getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public UserModel getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserModel getBot() {
        return userRepository.findByEmail("boxter.buddy@ucll.be").orElse(null);
    }

    public String getUserEmailById(Long userId) {
        UserModel user = userRepository.findById(userId).orElse(null);
        return (user != null) ? user.getEmail() : null;
    }

    public List<UserModel> getAllAdmins() {
        return userRepository.findAll().stream().filter(userModel -> userModel.getRole() == Role.ADMIN).toList();
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public UserModel updateUserRole(Long userId, String role) throws UserException {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("userId", "User not found"));

        if (role.equalsIgnoreCase("ADMIN")) {
            user.setRole(Role.ADMIN);
        } else if (role.equalsIgnoreCase("MEMBER")) {
            user.setRole(Role.MEMBER);
        } else {
            throw new UserException("role", "Invalid role");
        }

        return userRepository.save(user);
    }

    public UserModel lockUser(Long userId) throws UserException {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("userId", "User not found"));

        user.setLocked(true);
        return userRepository.save(user);
    }

    public UserModel unlockUser(Long userId) throws UserException {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("userId", "User not found"));

        user.setLocked(false);
        return userRepository.save(user);
    }

    public Integer getEasterEggsFound(String email) {
        UserModel user = getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }        
        return (user != null) ? user.getEasterEggsFound() : null;
    }

    public UserModel incrementEasterEggsFound(String email) {
        UserModel user = getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        if (user != null) {
            user.foundEasterEgg();
            userRepository.save(user);
        }
        return user;
    }
}
