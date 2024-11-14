package be.ucll.se.team19backend.plantmodel.service;

import be.ucll.se.team19backend.plantmodel.model.PlantModel;
import be.ucll.se.team19backend.plantmodel.repo.PlantModelRepository;
import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlantModelService {

    @Autowired
    private PlantModelRepository plantModelRepository;

    @Autowired
    private UserService userService;

    public List<PlantModel> getAllPlantModels(String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return plantModelRepository.findAll();
    }

    public List<PlantModel> getPlantModels(String email) {
            return plantModelRepository.findAll();
    }

    public Optional<PlantModel> getPlantModelById(Long id, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return plantModelRepository.findById(id);
    }

    public PlantModel addPlantModel(PlantModel plantModel, String email) {
        return plantModelRepository.save(plantModel);
    }

    public PlantModel updatePlantModel(PlantModel plantModel, String email) {
        return plantModelRepository.save(plantModel);
    }
    public void deletePlantModel(Long id, String email) {
        UserModel user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
    
        Optional<PlantModel> optionalPlantModel = plantModelRepository.findById(id);
        if (!optionalPlantModel.isPresent()) {
            throw new IllegalArgumentException("PlantModel does not exist");
        }
    
            plantModelRepository.deleteById(id);
            throw new RuntimeException("User does not have permission to delete this plantModel");
        }
    }

    // public void deletePlantModel(Long id, String email) {
    //     UserModel user = userService.getUserByEmail(email);
    //     if (user == null) {
    //         throw new RuntimeException("User not found with email: " + email);
    //     }
    //     if (!plantModelRepository.existsById(id)) {
    //         throw new IllegalArgumentException("PlantModel does not exist");
    //     }
    //     plantModelRepository.deleteById(id);
    // }
