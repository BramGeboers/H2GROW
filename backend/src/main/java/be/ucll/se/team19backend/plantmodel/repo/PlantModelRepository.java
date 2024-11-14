package be.ucll.se.team19backend.plantmodel.repo;

import be.ucll.se.team19backend.plantmodel.model.PlantModel;


import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantModelRepository extends JpaRepository<PlantModel, Long> {
}