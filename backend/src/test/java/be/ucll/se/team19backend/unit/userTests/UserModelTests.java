package be.ucll.se.team19backend.unit.userTests;

import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import static org.junit.jupiter.api.Assertions.*;

public class UserModelTests {

    @Test
    public void testUserModelConstructor() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);

        assertEquals(1L, user.getUserId());
        assertEquals("username", user.getUsername());
        assertEquals("test@ucll.be", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals(Role.MEMBER, user.getRole());
        assertFalse(user.getLocked());
        assertEquals(0, user.getEasterEggsFound());
    }


    @Test
    public void testGetAuthorities() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        for (GrantedAuthority authority : user.getAuthorities()) {
            assertTrue(authority.getAuthority().equals(Role.MEMBER.name()) || authority.getAuthority().equals("ROLE_" + Role.MEMBER.name()));
        }
    }
    
    @Test
    public void testIsAccountNonExpired() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        assertTrue(user.isAccountNonExpired());
    }
    
    @Test
    public void testIsAccountNonLocked() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        assertTrue(user.isAccountNonLocked());
    
        user.setLocked(true);
        assertFalse(user.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        assertTrue(user.isEnabled());
    }

    @Test
public void testSetAndGetUserId() {
    UserModel user = new UserModel();
    user.setUserId(2L);
    assertEquals(2L, user.getUserId());
}

@Test
public void testSetAndGetUsername() {
    UserModel user = new UserModel();
    user.setUsername("newUsername");
    assertEquals("newUsername", user.getUsername());
}

@Test
public void testSetAndGetEmail() {
    UserModel user = new UserModel();
    user.setEmail("newEmail@ucll.be");
    assertEquals("newEmail@ucll.be", user.getEmail());
}

@Test
public void testSetAndGetPassword() {
    UserModel user = new UserModel();
    user.setPassword("newPassword");
    assertEquals("newPassword", user.getPassword());
}

@Test
public void testSetAndGetRole() {
    UserModel user = new UserModel();
    user.setRole(Role.ADMIN);
    assertEquals(Role.ADMIN, user.getRole());
}

@Test
public void testSetAndGetLocked() {
    UserModel user = new UserModel();
    user.setLocked(true);
    assertTrue(user.getLocked());
}


@Test
    public void testFoundEasterEgg() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        user.foundEasterEgg();
        assertEquals(1, user.getEasterEggsFound());
    }

    @Test
    public void testGetEasterEggsFound() {
        UserModel user = new UserModel(1L, "username", "test@ucll.be", "password", Role.MEMBER, false, 0);
        assertEquals(0, user.getEasterEggsFound());
    }
}