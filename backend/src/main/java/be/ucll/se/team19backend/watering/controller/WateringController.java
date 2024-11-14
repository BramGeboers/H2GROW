package be.ucll.se.team19backend.watering.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.se.team19backend.watering.model.WateringLog;
import be.ucll.se.team19backend.watering.model.WateringType;
import be.ucll.se.team19backend.watering.service.WateringService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/watering")
@SecurityRequirement(name = "bearerAuth")
public class WateringController {

    @Autowired
    private WateringService wateringService;

    @PostMapping("/{plantId}/{email}/{type}")
    public void logWatering(@PathVariable Long plantId, @PathVariable String email, @PathVariable WateringType type) {
        wateringService.logWatering(plantId, email, type);
    }

    @GetMapping()
    public List<WateringLog> getAllLogs() {
        return wateringService.getAllLogs();
    }

    @GetMapping("getByUserId/{userId}")
    public List<WateringLog> getAllLogsByUserId(@PathVariable Long userId) {
        return wateringService.getAllLogsByUserId(userId);
    }

    @GetMapping("getByPlantId/{plantId}")
    public List<WateringLog> getAllLogsByPlantId(@PathVariable Long plantId) {
        return wateringService.getAllLogsByPlantId(plantId);
    }

    @GetMapping("getLast10Logs")
    public List<WateringLog> getLast10Logs() {
        return wateringService.getLast10Logs();
    }

}