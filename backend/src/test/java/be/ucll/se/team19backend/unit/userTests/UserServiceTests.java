package be.ucll.se.team19backend.unit.userTests;

import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserException;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.repo.UserRepository;
import be.ucll.se.team19backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UserModel user1;
    private UserModel user2;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);

        user1 = new UserModel(1L, "username1", "test1@ucll.be", "password1", Role.MEMBER, false, 0);
        user2 = new UserModel(2L, "username2", "test2@ucll.be", "password2", Role.ADMIN, true, 0);
    }

    @Test
    public void whenGetAllUsers_thenReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<UserModel> result = userService.getAllUsers(user2.getEmail());

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    public void whenGetUserById_thenReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        UserModel result = userService.getUserById(1L);

        assertEquals(user1, result);
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void whenGetUserByIdWithInvalidId_thenReturnNull() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        UserModel result = userService.getUserById(1L);

        assertNull(result);
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void whenGetUserByEmail_thenReturnUser() {
        when(userRepository.findByEmail("test1@ucll.be")).thenReturn(Optional.of(user1));

        UserModel result = userService.getUserByEmail("test1@ucll.be");

        assertEquals(user1, result);
        verify(userRepository, times(1)).findByEmail("test1@ucll.be");
    }

    @Test
    public void whenGetUserByEmailWithInvalidEmail_thenReturnNull() {
        when(userRepository.findByEmail("invalidEmail@ucll.be")).thenReturn(Optional.empty());

        UserModel result = userService.getUserByEmail("invalidEmail@ucll.be");

        assertNull(result);
        verify(userRepository, times(1)).findByEmail("invalidEmail@ucll.be");
    }

    @Test
    public void whenAddUser_thenUserShouldBeAdded() throws UserException {
        when(userRepository.save(any(UserModel.class))).thenReturn(user1);

        UserModel result = userService.addUser(user1);

        assertEquals(user1, result);
        verify(userRepository, times(1)).save(user1);
    }

    @Test
    public void whenDeleteUser_thenUserShouldBeDeleted() {
        doNothing().when(userRepository).deleteById(any(Long.class));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }
}
