package be.ucll.se.team19backend.watering.service;

import java.util.Date;
import java.util.List;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.watering.model.WateringLog;
import be.ucll.se.team19backend.watering.model.WateringType;
import be.ucll.se.team19backend.watering.repo.WateringLogRepository;
import jakarta.persistence.EntityNotFoundException;
import be.ucll.se.team19backend.plant.service.PlantService;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;
import org.springframework.data.domain.Pageable;

@Service
public class WateringService {

    @Autowired
    private WateringLogRepository wateringLogRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PlantService plantService;

    @Autowired
    private WateringLogRepository wateringRepository;

    public void logWatering(Long plantId, String email, WateringType type) {
        WateringLog wateringLog = new WateringLog();
        UserModel existingUser = userService.getUserByEmail(email);
        Optional<Plant> optionalPlant = plantService.getPlantById(plantId, existingUser.getEmail());

        if (optionalPlant.isPresent()) {
            Plant existingPlant = optionalPlant.get();
            wateringLog.setPlant(existingPlant);
            wateringLog.setUser(existingUser);
            wateringLog.setTimestamp(new Date());
            wateringLog.setType(type);
            wateringLogRepository.save(wateringLog);
        } else {
            throw new EntityNotFoundException("Plant not found for ID: " + plantId);
        }
    }

    public List<WateringLog> getAllLogs() {
        System.out.println("getting all logs");
        return wateringRepository.findAll();
    }

    public List<WateringLog> getAllLogsByUserId(long userId) {
        return wateringRepository.findWateringLogsByUserUserId(userId);
    }

    public List<WateringLog> getAllLogsByPlantId(long plantId) {
        return wateringRepository.findWateringLogsByPlantId(plantId);
    }

    public List<WateringLog> getLast10Logs() {
        Pageable pageable = PageRequest.of(0, 10);
        return wateringRepository.findLast10WateringLogs(pageable);
    }

    // public List<WateringLog> getWateringLogsByUserId(Long userId) {
    // List<Plant> userPlants = plantService.getPlantsByUserId(userId);
    // List<Long> plantIds =
    // userPlants.stream().map(Plant::getId).collect(Collectors.toList());
    // return wateringLogRepository.findByPlantIdIn(plantIds);
    // }

    // public List<WateringLog> getWateringLogsByPlantId(Long plantId) {
    // return wateringLogRepository.findByPlantId(plantId);
    // }

}