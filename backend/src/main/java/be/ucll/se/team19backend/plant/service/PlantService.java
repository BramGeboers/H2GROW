package be.ucll.se.team19backend.plant.service;

import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.plant.repo.PlantRepository;
import be.ucll.se.team19backend.plantmodel.model.PlantModel;
import be.ucll.se.team19backend.plantmodel.repo.PlantModelRepository;
import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import be.ucll.se.team19backend.watering.model.WateringLog;
import be.ucll.se.team19backend.watering.repo.WateringLogRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private PlantModelRepository plantModelRepository;

    @Autowired
    private UserService userService;

    public List<Plant> getAllPlants(String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return plantRepository.findAll();
    }

    public List<Plant> getPlantsByOwnerId(String email, Long id) {
        UserModel user = userService.getUserByEmail(email);

        if (user.getRole().equals(Role.ADMIN)) {
            return plantRepository.findPlantByOwnerUserId(id);
        }

        throw new RuntimeException("You are not authorized to do this");
    }

    public Page<Plant> getPlantsPageableByOwner(Pageable pageable, String email) {
        UserModel user = userService.getUserByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        if (user.getRole().equals(Role.ADMIN)) {
            return plantRepository.findAll(pageable);
        }

        return plantRepository.findPlantByOwner(pageable, user);
    }

    public List<Plant> getPlants(String email) {

        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        if (user.getRole().equals(Role.ADMIN)) {
            return plantRepository.findAll();
        }
        if (user.getRole().equals(Role.MEMBER)) {
            return plantRepository.findPlantByOwner(user);
        }
        throw new RuntimeException("User not found with email: " + email);
    }

    public Optional<Plant> getPlantById(Long id, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return plantRepository.findById(id);
    }

    public Plant addPlant(Plant plant, String email) {
        PlantModel plantModel = plant.getPlantModel();
    
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
    
        Optional<Plant> existingPlant = plantRepository.findByName(plant.getName());
        plant.setOwner(user);
        if (existingPlant.isPresent()) {
            throw new IllegalArgumentException("A plant with this name already exists");
        }
    
        if (plantModel != null) {
            plantModelRepository.save(plantModel);
        }
        // Convert hours to milliseconds
        plant.setWateringInterval(plant.getWateringInterval() * 1000 * 60 * 60);
        
        // Set the device id
        plant.setDeviceId("72641060-11e8-11ef-a3a3-a770882bbf4c");
    
        return plantRepository.save(plant);
    }

    public Plant editPlant(Long plantId, Plant plant, String email) {
        PlantModel plantModel = plant.getPlantModel();

        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

    
        Optional<Plant> existingPlantOptional = plantRepository.findById(plantId);
        if (!existingPlantOptional.isPresent()) {
            throw new IllegalArgumentException("Plant not found with ID: " + plantId);
        }

        Plant existingPlant = existingPlantOptional.get();

        // Update the plant fields as needed
        if (plant.getName() != null) {
            existingPlant.setName(plant.getName());
        }
        if (plantModel != null) {
            existingPlant.setPlantModel(plantModel);
        }
        existingPlant.setWateringInterval(plant.getWateringInterval() * 1000 * 60 * 60);
        existingPlant.setLastWatered(plant.getLastWatered());
        existingPlant.setWaterNeed(plant.getWaterNeed());
        existingPlant.setIdealMoisture(plant.getIdealMoisture());
        existingPlant.setWorstMoisture(plant.getWorstMoisture());
        existingPlant.setFilelink(plant.getFilelink());
        existingPlant.setLevel(plant.getLevel());

        // Save the updated plant
        return plantRepository.save(existingPlant);
    }

    public Plant updatePlant(Plant plant, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        if (plant == null || !plantRepository.existsById(plant.getId())) {
            throw new IllegalArgumentException("Plant does not exist");
        }
        return plantRepository.save(plant);
    }

    public void deletePlant(Long id, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        Optional<Plant> optionalPlant = plantRepository.findById(id);
        if (!optionalPlant.isPresent()) {
            throw new IllegalArgumentException("Plant does not exist");
        }

        Plant plant = optionalPlant.get();
        if (user.getRole().equals(Role.ADMIN) || plant.getOwner().equals(user)) {
            plantRepository.deleteById(id);
        } else {
            throw new RuntimeException("User does not have permission to delete this plant");
        }
    }

    public Plant waterPlant(Long id, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        Optional<Plant> optionalPlant = plantRepository.findById(id);
        if (!optionalPlant.isPresent()) {
            throw new IllegalArgumentException("Plant does not exist");
        }
        Plant plant = optionalPlant.get();
        if (plant.getLastWatered() + plant.getWateringInterval() < System.currentTimeMillis()) {
            plant.water();
            return plantRepository.save(plant);
        } else {
            throw new IllegalArgumentException("Plant does not need to be watered yet");
        }
    }

    public List<Plant> getPlantsByUserId(Long userId) {
        return plantRepository.findByUser_UserId(userId);
    }

    public Page<Plant> getSortedPlants(Pageable pageable, String sortBy, String direction, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        if (user.getRole().equals(Role.ADMIN)) {
            return plantRepository.findAll(sortedPageable);
        }

        return plantRepository.findPlantByOwner(sortedPageable, user);
    }

    

}