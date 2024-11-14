package be.ucll.se.team19backend.plantmodel.controller;

import be.ucll.se.team19backend.plantmodel.model.PlantModel;
import be.ucll.se.team19backend.plantmodel.service.PlantModelService;
import be.ucll.se.team19backend.security.JwtService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/plantmodel")
public class PlantModelController {

    @Autowired
    private PlantModelService plantService;

    @Autowired
    private JwtService jwtService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<PlantModel> getAllPlantModels(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getAllPlantModels(email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/all")
    public List<PlantModel> showPlantModels(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlantModels(email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<PlantModel> getPlantModelById(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.getPlantModelById(id, email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public PlantModel addPlantModel(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @RequestBody PlantModel plant) throws IllegalArgumentException {
        String email = jwtService.extractEmail(token.substring(7));
        return plantService.addPlantModel(plant, email);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public PlantModel updatePlantModel(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id, @RequestBody PlantModel plant) {
        String email = jwtService.extractEmail(token.substring(7));
        plant.setId(id);
        return plantService.updatePlantModel(plant, email);
    }

    
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public void deletePlantModel(@RequestHeader(name = "Authorization") @Parameter(hidden = true) String token, @PathVariable Long id) {
        String email = jwtService.extractEmail(token.substring(7));
        plantService.deletePlantModel(id, email);
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