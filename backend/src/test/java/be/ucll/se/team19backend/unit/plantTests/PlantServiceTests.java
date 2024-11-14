package be.ucll.se.team19backend.unit.plantTests;

import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.plant.repo.PlantRepository;
import be.ucll.se.team19backend.plant.service.PlantService;
import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PlantServiceTests {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private PlantService plantService;

    private Plant plant1;
    private Plant plant2;
    private UserModel user;

    @SuppressWarnings("deprecation")
    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);

        plant1 = new Plant();
        plant1.setId(1L);
        plant1.setName("Plant1");
        plant1.setXP(10);

        plant2 = new Plant();
        plant2.setId(2L);
        plant2.setName("Plant2");
        plant2.setXP(20);

        user = new UserModel();
        user.setEmail("user@example.com");
        user.setRole(Role.ADMIN); // or Role.MEMBER depending on the test
    }

    @Test
    public void whenGetAllPlants_thenReturnAllPlants() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findAll()).thenReturn(Arrays.asList(plant1, plant2));

        List<Plant> result = plantService.getAllPlants("user@example.com");

        assertEquals(2, result.size());
        verify(plantRepository, times(1)).findAll();
    }

    @Test
    public void whenGetPlantById_thenReturnPlant() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(1L)).thenReturn(Optional.of(plant1));

        Optional<Plant> result = plantService.getPlantById(1L, "user@example.com");

        assertTrue(result.isPresent());
        assertEquals(plant1, result.get());
        verify(plantRepository, times(1)).findById(1L);
    }

    @Test
    public void whenGetPlantByIdWithInvalidId_thenReturnEmpty() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Plant> result = plantService.getPlantById(1L, "user@example.com");

        assertFalse(result.isPresent());
        verify(plantRepository, times(1)).findById(1L);
    }

    @Test
    public void whenDeletePlant_thenPlantIsDeleted() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(plant1.getId())).thenReturn(Optional.of(plant1));
        doNothing().when(plantRepository).deleteById(plant1.getId());

        plantService.deletePlant(plant1.getId(), "user@example.com");

        verify(plantRepository, times(1)).deleteById(plant1.getId());
    }

    @Test
    public void whenDeletePlantWithNull_thenThrowException() {
        assertThrows(RuntimeException.class, () -> plantService.deletePlant(null, "user@example.com"));
        verify(plantRepository, times(0)).delete(any());
    }
    @Test
    public void whenAddPlant_thenPlantIsAdded() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findByName(plant1.getName())).thenReturn(Optional.empty());
        when(plantRepository.save(plant1)).thenReturn(plant1);

        Plant result = plantService.addPlant(plant1, "user@example.com");

        assertEquals(plant1, result);
        verify(plantRepository, times(1)).save(plant1);
    }

    @Test
    public void whenAddPlantWithExistingName_thenThrowException() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findByName(plant1.getName())).thenReturn(Optional.of(plant1));

        assertThrows(IllegalArgumentException.class, () -> plantService.addPlant(plant1, "user@example.com"));
        verify(plantRepository, times(0)).save(any());
    }

    @Test
    public void whenDeletePlantById_thenPlantIsDeleted() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(1L)).thenReturn(Optional.of(plant1));
        doNothing().when(plantRepository).deleteById(1L);

        plantService.deletePlant(1L, "user@example.com");

        verify(plantRepository, times(1)).deleteById(1L);
    }

    @Test
    public void whenWaterPlant_thenXPisUpdated() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(1L)).thenReturn(Optional.of(plant1));
        when(plantRepository.save(plant1)).thenReturn(plant1);

        Plant result = plantService.waterPlant(1L, "user@example.com");

        assertEquals(20, result.getXP());
        verify(plantRepository, times(1)).save(plant1);
    }

    @Test
    public void whenUpdatePlant_thenPlantIsUpdated() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.existsById(plant1.getId())).thenReturn(true);
        when(plantRepository.save(plant1)).thenReturn(plant1);

        Plant result = plantService.updatePlant(plant1, "user@example.com");

        assertEquals(plant1, result);
        verify(plantRepository, times(1)).save(plant1);
    }

    @Test
    public void whenUpdatePlantWithNonExistingPlant_thenThrowException() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.existsById(any())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> plantService.updatePlant(plant1, "user@example.com"));
        verify(plantRepository, times(0)).save(any());
    }

    @Test
    public void whenDeletePlantWithNonExistingId_thenThrowException() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> plantService.deletePlant(1L, "user@example.com"));
        verify(plantRepository, times(0)).deleteById(any());
    }

    @Test
    public void whenWaterPlantWithNonExistingPlant_thenThrowException() {
        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(plantRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> plantService.waterPlant(1L, "user@example.com"));
        verify(plantRepository, times(0)).save(any());
    }

}
