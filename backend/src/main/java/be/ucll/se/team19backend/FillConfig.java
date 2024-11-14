package be.ucll.se.team19backend;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import be.ucll.se.team19backend.authentication.model.RegisterRequest;
import be.ucll.se.team19backend.authentication.service.AuthService;
import be.ucll.se.team19backend.customexception.ServiceException;
import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.plant.service.PlantService;
import be.ucll.se.team19backend.plantmodel.model.PlantModel;
import be.ucll.se.team19backend.plantmodel.service.PlantModelService;
import be.ucll.se.team19backend.security.JwtService;
import be.ucll.se.team19backend.user.model.UserException;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.user.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.Data;

@Component
@Data
public class FillConfig {

        @Value("${custom.fill}")
        private boolean fill;

        @Autowired
        private AuthService authService;

        @Autowired
        private PlantService plantService;

        @Autowired
        private PlantModelService plantModelService;

        @Autowired
        private UserService userService;

        @Autowired
        private JwtService jwtService;

        public static LocalDateTime getRandomDateTime() {
                LocalDateTime now = LocalDateTime.now().minusDays(10);
                LocalDateTime maxDate = now.plusMonths(1);
                long randomSeconds = ThreadLocalRandom.current().nextLong(0,
                                ChronoUnit.SECONDS.between(now, maxDate));
                return now.plusSeconds(randomSeconds);
        }

        public static int getRandomNumberInRange(int min, int max) {
                if (min >= max) {
                        throw new IllegalArgumentException("Max must be greater than min");
                }
                Random random = new Random();
                return random.nextInt(max - min + 1) + min;
        }

        /**
         * @throws ServiceException
         * @throws IOException
         * @throws InterruptedException
         * @throws UserException
         */
        @PostConstruct
        public void fill() throws ServiceException, IOException,
                        InterruptedException, UserException {
                if (fill) {

                        UserModel hugo = authService.register(RegisterRequest.builder()
                                        .username("hugo")
                                        .email("hugo@ucll.be")
                                        .password("hugo")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel gleb = authService.register(RegisterRequest.builder()
                                        .username("gleb")
                                        .email("gleb@ucll.be")
                                        .password("gleb")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel davy = authService.register(RegisterRequest.builder()
                                        .username("davy")
                                        .email("davy@ucll.be")
                                        .password("davy")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel kylian = authService.register(RegisterRequest.builder()
                                        .username("kylian")
                                        .email("kylian@ucll.be")
                                        .password("kylian")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel joren = authService.register(RegisterRequest.builder()
                                        .username("joren")
                                        .email("joren@ucll.be")
                                        .password("joren")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel wout = authService.register(RegisterRequest.builder()
                                        .username("wout")
                                        .email("wout@ucll.be")
                                        .password("wout")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel bart = authService.register(RegisterRequest.builder()
                                        .username("bart")
                                        .email("bart@ucll.be")
                                        .password("bart")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel bram = authService.register(RegisterRequest.builder()
                                        .username("bram")
                                        .email("bram@ucll.be")
                                        .password("bram")
                                        .role("MEMBER")
                                        .build(), "", "", true).getUser();

                        UserModel admin = authService.register(RegisterRequest.builder()
                                        .username("admin")
                                        .email("admin@ucll.be")
                                        .password("admin")
                                        .role("ADMIN")
                                        .build(), "", "", true).getUser();

                        PlantModel plantModel1 = PlantModel.builder()
                                        .modelLink("plant2.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel2 = PlantModel.builder()
                                        .modelLink("plant1.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel3 = PlantModel.builder()
                                        .modelLink("plant4.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel4 = PlantModel.builder()
                                        .modelLink("plant3.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel5 = PlantModel.builder()
                                        .modelLink("succelent.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel6 = PlantModel.builder()
                                        .modelLink("cactus.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel7 = PlantModel.builder()
                                        .modelLink("flower1.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel8 = PlantModel.builder()
                                        .modelLink("flower2.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel9 = PlantModel.builder()
                                        .modelLink("lily.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel10 = PlantModel.builder()
                                        .modelLink("bonsai.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel11 = PlantModel.builder()
                                        .modelLink("violet.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel12 = PlantModel.builder()
                                        .modelLink("sansevieria.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel13 = PlantModel.builder()
                                        .modelLink("bayleaf.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel14 = PlantModel.builder()
                                        .modelLink("basil1.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel15 = PlantModel.builder()
                                        .modelLink("flower3.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel16 = PlantModel.builder()
                                        .modelLink("variegatum.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel17 = PlantModel.builder()
                                        .modelLink("madelief.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel18 = PlantModel.builder()
                                        .modelLink("basil2.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel19 = PlantModel.builder()
                                        .modelLink("plant5.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        // PlantModel plantModel20 = PlantModel.builder()
                        // .modelLink("monstera.glb")
                        // .scale(1f)
                        //
                        // .rotation(0f)
                        // .x(0f)
                        // .y(0f)
                        // .z(0f)
                        //
                        //
                        //
                        // .build();

                        PlantModel plantModel21 = PlantModel.builder()
                                        .modelLink("daffodil.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel22 = PlantModel.builder()
                                        .modelLink("cactus2.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        PlantModel plantModel23 = PlantModel.builder()
                                        .modelLink("bananenplant.glb")
                                        .scale(1f)
                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)
                                        .build();

                        PlantModel plantModel24 = PlantModel.builder()
                                        .modelLink("flower4.glb")
                                        .scale(1f)
                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)
                                        .build();

                        PlantModel plantModel25 = PlantModel.builder()
                                        .modelLink("goudsbloem.glb")
                                        .scale(1f)

                                        .rotation(0f)
                                        .x(0f)
                                        .y(0f)
                                        .z(0f)

                                        .build();

                        Plant plant1 = Plant.builder()
                                        .name("Koffieplant")
                                        .plantModel(plantModel1)
                                        .type(1)
                                        .filelink("unnamed_512838fd-1893-4688-993a-65f2e867b772_700x700.webp")
                                        .wateringInterval(1)
                                        .lastWatered(0)
                                        .waterNeed(100)
                                        .worstMoisture(40)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(hugo)
                                        .build();

                        Plant plant2 = Plant.builder()
                                        .name("Monstera Deliciosa")
                                        .type(2)
                                        .plantModel(plantModel2)
                                        .filelink("VIS_018129_2_BK_1705411406384.webp")
                                        .wateringInterval(168)
                                        .lastWatered(0)
                                        .waterNeed(10)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(hugo)

                                        .build();

                        Plant plant3 = Plant.builder()
                                        .name("Aardbeienplant")
                                        .type(3)
                                        .plantModel(plantModel3)
                                        .filelink("aardbeienplant_n.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(60)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(70)
                                        .owner(hugo)

                                        .build();

                        Plant plant4 = Plant.builder()
                                        .name("Ficus")
                                        .type(4)
                                        .plantModel(plantModel4)
                                        .filelink("ficus-elastica-robusta-potplant-rubberboom__1334424_pe946784_s5.avif")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(40)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(50)
                                        .owner(bram)

                                        .build();

                        Plant plant5 = Plant.builder()
                                        .name("Echeveria")
                                        .type(6)
                                        .plantModel(plantModel5)
                                        .filelink("fd17900wh.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(10)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(20)
                                        .owner(bram)

                                        .build();

                        Plant plant6 = Plant.builder()
                                        .name("Cactus")
                                        .plantModel(plantModel6)
                                        .type(7)
                                        .filelink("29377.webp")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(5)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(15)
                                        .owner(bart)
                                        .build();

                        Plant plant7 = Plant.builder()
                                        .name("Tulp")
                                        .plantModel(plantModel7)
                                        .type(8)
                                        .filelink("tulipa-barcelona.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(40)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(50)
                                        .owner(bart)
                                        .build();

                        Plant plant8 = Plant.builder()
                                        .name("Roos")
                                        .type(9)
                                        .plantModel(plantModel8)
                                        .filelink("f23bba21-617d-4ba8-8f6d-962bda7fd959_flower-1421903_1920.avif")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(bart)
                                        .build();

                        Plant plant9 = Plant.builder()
                                        .name("Lily")
                                        .type(9)
                                        .plantModel(plantModel9)
                                        .filelink("lily.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(kylian)
                                        .build();

                        Plant plant10 = Plant.builder()
                                        .name("Bonsai")
                                        .type(10)
                                        .plantModel(plantModel10)
                                        .filelink("bonsai.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(kylian)
                                        .build();

                        Plant plant11 = Plant.builder()
                                        .name("Violet")
                                        .type(11)
                                        .plantModel(plantModel11)
                                        .filelink("violet.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(joren)
                                        .build();

                        Plant plant12 = Plant.builder()
                                        .name("Sansevieria")
                                        .type(12) // Assuming type 11 for plant12
                                        .plantModel(plantModel12) // Assuming plantModel10 for plant12
                                        .filelink("sansevieria.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(joren)
                                        .build();

                        Plant plant13 = Plant.builder()
                                        .name("Bay Leaf")
                                        .type(13) // Assuming type 12 for plant13
                                        .plantModel(plantModel13) // Assuming plantModel11 for plant13
                                        .filelink("bayleaf.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(gleb)
                                        .build();

                        Plant plant14 = Plant.builder()
                                        .name("Basilicum 1")
                                        .type(14) // Assuming type 14 for plant14
                                        .plantModel(plantModel14) // Assuming plantModel14 for plant14
                                        .filelink("basil1.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(gleb)
                                        .build();

                        Plant plant15 = Plant.builder()
                                        .name("Mediterranean Plant")
                                        .type(15) // Assuming type 15 for plant15
                                        .plantModel(plantModel15) // Assuming plantModel15 for plant15
                                        .filelink("flower3.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(gleb)
                                        .build();

                        Plant plant16 = Plant.builder()
                                        .name("Variegatum")
                                        .type(16)
                                        .plantModel(plantModel16)
                                        .filelink("variegatum.jpeg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(davy)
                                        .build();

                        Plant plant17 = Plant.builder()
                                        .name("Madelief")
                                        .type(17)
                                        .plantModel(plantModel17)
                                        .filelink("madelief.webp")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(davy)
                                        .build();

                        Plant plant18 = Plant.builder()
                                        .name("Basilicum 2")
                                        .type(18)
                                        .plantModel(plantModel18)
                                        .filelink("basil2.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(davy)
                                        .build();

                        Plant plant19 = Plant.builder()
                                        .name("Alocasia")
                                        .type(19)
                                        .plantModel(plantModel19)
                                        .filelink("alocasia.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(wout)
                                        .build();

                        // Plant plant20 = Plant.builder()
                        // .name("Monstera")
                        // .type(20)
                        // .plantModel(plantModel20)
                        // .filelink("monstera.avif")
                        // .wateringInterval(48)
                        // .lastWatered(0)
                        // .waterNeed(70)
                        // .worstMoisture(50)
                        // .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                        // .idealMoisture(60)
                        // .owner(wout)
                        // .build();

                        Plant plant21 = Plant.builder()
                                        .name("Narcis")
                                        .type(21)
                                        .plantModel(plantModel21)
                                        .filelink("daffodil.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(wout)
                                        .build();

                        Plant plant22 = Plant.builder()
                                        .name("Cactus 2")
                                        .type(22)
                                        .plantModel(plantModel22)
                                        .filelink("cactus2.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(wout)
                                        .build();

                        Plant plant23 = Plant.builder()
                                        .name("Bananenplant")
                                        .type(23)
                                        .plantModel(plantModel23)
                                        .filelink("bananenplant.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(bram)
                                        .build();

                        Plant plant24 = Plant.builder()
                                        .name("Ridderspoor")
                                        .type(24)
                                        .plantModel(plantModel24)
                                        .filelink("ridderspoor.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(bram)
                                        .build();

                        Plant plant25 = Plant.builder()
                                        .name("Goudsbloem")
                                        .type(25)
                                        .plantModel(plantModel25)
                                        .filelink("goudsbloem.jpg")
                                        .wateringInterval(48)
                                        .lastWatered(0)
                                        .waterNeed(70)
                                        .worstMoisture(50)
                                        .deviceId("72641060-11e8-11ef-a3a3-a770882bbf4c")
                                        .idealMoisture(60)
                                        .owner(bram)
                                        .build();

                        plantService.addPlant(plant1, "hugo@ucll.be");
                        plantService.addPlant(plant2, "hugo@ucll.be");
                        plantService.addPlant(plant3, "hugo@ucll.be");
                        plantService.addPlant(plant4, "bram@ucll.be");
                        plantService.addPlant(plant5, "bram@ucll.be");
                        plantService.addPlant(plant6, "bart@ucll.be");
                        plantService.addPlant(plant7, "bart@ucll.be");
                        plantService.addPlant(plant8, "bart@ucll.be");
                        plantService.addPlant(plant9, "kylian@ucll.be");
                        plantService.addPlant(plant10, "kylian@ucll.be");
                        plantService.addPlant(plant11, "joren@ucll.be");
                        plantService.addPlant(plant12, "joren@ucll.be");
                        plantService.addPlant(plant13, "gleb@ucll.be");
                        plantService.addPlant(plant14, "gleb@ucll.be");
                        plantService.addPlant(plant15, "gleb@ucll.be");
                        plantService.addPlant(plant16, "davy@ucll.be");
                        plantService.addPlant(plant17, "davy@ucll.be");
                        plantService.addPlant(plant18, "davy@ucll.be");
                        plantService.addPlant(plant19, "wout@ucll.be");
                        // plantService.addPlant(plant20, "wout@ucll.be");
                        plantService.addPlant(plant21, "wout@ucll.be");
                        plantService.addPlant(plant22, "wout@ucll.be");
                        plantService.addPlant(plant23, "bram@ucll.be");
                        plantService.addPlant(plant24, "bram@ucll.be");
                        plantService.addPlant(plant25, "bram@ucll.be");

                        userService.updateUser(hugo);
                        userService.updateUser(gleb);
                        userService.updateUser(kylian);
                        userService.updateUser(davy);
                        userService.updateUser(bart);
                        userService.updateUser(wout);
                        userService.updateUser(kylian);
                        userService.updateUser(bram);
                        userService.updateUser(admin);

                        System.out.println("\nAll fills complete");

                        String tokenhugo = jwtService.generateToken(hugo);
                        String tokenAdmin = jwtService.generateToken(admin);

                        System.out.println("\n\n");
                        System.out.println(
                                        "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                        System.out.println("\n");
                        System.out.println("\nToken hugo:");
                        System.out.println(tokenhugo);
                        System.out.println("\nToken Admin:");
                        System.out.println(tokenAdmin);
                        System.out.println("\n");
                        System.out.println(
                                        "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                        System.out.println("\n\n");

                } else {
                        System.out.println("fill skipped");
                }
        }
}
