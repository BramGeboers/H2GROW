package be.ucll.se.team19backend.plant.repo;

import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.user.model.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    Optional<Plant> findByName(String name);

    Optional<Plant> findById(Long id);

    Page<Plant> findAll(Pageable pageable);

    Page<Plant> findPlantByOwner(Pageable pageable, UserModel owner);

    List<Plant> findPlantByOwner(UserModel owner);

    List<Plant> findPlantByOwnerUserId(Long userId);

    List<Plant> findByUser_UserId(Long userId);

}