package be.ucll.se.team19backend.unit.plantTests;

import static org.junit.jupiter.api.Assertions.*;
import java.util.Date;
import java.util.Set;

import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import be.ucll.se.team19backend.plant.model.Plant;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class PlantModelTests {

    private String validName = "Rose";
    private int validXP = 20;
    private int validWateringInterval = 50;
    private long validLastWatered = new Date().getTime();
    private int validWaterNeed = 60;
    private int validLevel = 1;
    private Plant plant;

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    public static void createValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    public static void close() {
        validatorFactory.close();
    }

    @BeforeEach
    public void setUp() {
        plant = Plant.builder()
                .name(validName)
                .XP(validXP)
                .wateringInterval(validWateringInterval)
                .lastWatered(validLastWatered)
                .waterNeed(validWaterNeed)
                .level(validLevel)
                .build();
    }

    @Test
    public void givenValidPlantDetails_whenCreatingPlant_thenPlantIsCreatedWithThoseDetails() {
        String validDeviceId = "validDeviceId";
        plant.setDeviceId(validDeviceId); // set the deviceId
    
        assertNotNull(plant);
        assertEquals(validName, plant.getName());
        assertEquals(validXP, plant.getXP());
        assertEquals(validWateringInterval, plant.getWateringInterval());
        assertEquals(validLastWatered, plant.getLastWatered());
        assertEquals(validWaterNeed, plant.getWaterNeed());
        assertEquals(validLevel, plant.getLevel());
        assertEquals(validDeviceId, plant.getDeviceId()); // check the deviceId
        Set<ConstraintViolation<Plant>> violations = validator.validate(plant);
        assertTrue(violations.isEmpty());
    }
    
    @Test
    public void givenEmptyName_whenCreatingPlant_thenNameViolationMessageIsThrown() {
        // when
        String emptyName = "   ";
        plant.setName(emptyName);
        String validDeviceId = "validDeviceId";
        plant.setDeviceId(validDeviceId); // set the deviceId
    
        // then
        Set<ConstraintViolation<Plant>> violations = validator.validate(plant);
        assertEquals(1, violations.size());
        ConstraintViolation<Plant> violation = violations.iterator().next();
        assertEquals("Name can not be empty!", violation.getMessage());
        assertEquals("name", violation.getPropertyPath().toString());
        assertEquals(emptyName, violation.getInvalidValue());
    }

    @Test
    public void givenNegativeXP_whenUpdatingXP_thenIllegalArgumentExceptionIsThrown() {
        // when
        int invalidXP = -1;

        // then
        assertThrows(IllegalArgumentException.class, () -> plant.updateXP(invalidXP), "XP can not be negative");
    }

    @Test
    public void givenXPMoreThan100_whenUpdatingXP_thenIllegalArgumentExceptionIsThrown() {
        // when
        int invalidXP = 101;

        // then
        assertThrows(IllegalArgumentException.class, () -> plant.updateXP(invalidXP), "XP can not be more than 100");
    }

    @Test
    public void givenValidXPAndCurrentXPPlusXPDoesNotExceed100_whenUpdatingXP_thenXPisUpdated() {
        // when
        int validXP = 50;
        plant.setXP(40);
        plant.updateXP(validXP);

        // then
        assertEquals(90, plant.getXP());
    }

    @Test
    public void givenValidXPAndCurrentXPPlusXPExceeds100_whenUpdatingXP_thenXPisResetAndLevelIsIncreased() {
        // when
        int validXP = 60;
        plant.setXP(50);
        plant.setLevel(1);
        plant.updateXP(validXP);

        // then
        assertEquals(10, plant.getXP()); // 50 + 60 - 100 = 10
        assertEquals(2, plant.getLevel());
}
}