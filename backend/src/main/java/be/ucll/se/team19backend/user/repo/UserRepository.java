package be.ucll.se.team19backend.user.repo;

import be.ucll.se.team19backend.user.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {

    // @Query("SELECT u FROM UserModel u WHERE u.email = ?1")
    Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserModel")
    Integer forceDelete();

}
