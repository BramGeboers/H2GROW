package be.ucll.se.team19backend.plant.controller;

import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.plant.service.PlantService;
import be.ucll.se.team19backend.security.JwtService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/plants")
public class PlantController {

    @Autowired
    private PlantService plantService;

    @Autowired
    private JwtService jwtService;

    // @SecurityRequirement(name = "bearerAuth")
    // @GetMapping
    // public List<Plant> getAllPlants(@RequestHeader(name = "Authorization")
    // @Parameter(hidden = true) String token) {
    // String email = jwtService.extractEmail(token.substring(7));
    // return plantService.getAllPlants(email);
    // }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public Page<Plant> getPlantsForEmail(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
            @RequestParam(name = "page", defaultValue = "0") Integer page) {
        Integer size = 11; // Set the page size
        Pageable pageable = PageRequest.of(page, size);
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlantsPageableByOwner(pageable, email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/all")
    public List<Plant> showPlants(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlants(email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/all/{id}")
    public List<Plant> showPlantsByOwnerId(
            @RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlantsByOwnerId(email, id);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(
            @RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlantById(id, email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public Plant addPlant(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
            @RequestBody Plant plant) throws IllegalArgumentException {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.addPlant(plant, email);
    }

    @PutMapping("/edit/{id}")
    public Plant editPlant(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
            @RequestBody Plant plant, @PathVariable Long id) throws IllegalArgumentException {
        System.out.println("Received Plant ID: " + id); // Log the received id
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.editPlant(id, plant, email); // Pass the path variable id
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public Plant updatePlant(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
            @PathVariable Long id, @RequestBody Plant plant) {
        String email = jwtService.extractEmail(token.substring(7));
        plant.setId(id);
        return plantService.updatePlant(plant, email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public void deletePlant(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
            @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        plantService.deletePlant(id, email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/water")
    public ResponseEntity<Plant> waterPlant(
            @RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        Plant wateredPlant = plantService.waterPlant(id, email);

        if (wateredPlant != null) {
            return ResponseEntity.ok(wateredPlant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/sort")
    public Page<Plant> sortPlants(
        @RequestHeader(name = "Authorization") @Parameter(hidden = true) String token,
        @RequestParam(defaultValue = "name") String sortBy, 
        @RequestParam(defaultValue = "asc") String direction,
        Pageable pageable) {
    
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getSortedPlants(pageable, sortBy, direction, email);
    }
    
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ IllegalArgumentException.class })
    public Map<String, String> handleValidationExceptions(IllegalArgumentException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ex.getMessage());
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}