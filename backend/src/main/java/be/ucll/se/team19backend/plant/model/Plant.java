package be.ucll.se.team19backend.plant.model;

import java.util.Date;

import be.ucll.se.team19backend.plantmodel.model.PlantModel;
import be.ucll.se.team19backend.user.model.UserModel;
import be.ucll.se.team19backend.watering.model.WateringLog;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "Plant")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Plant {

    @Hidden
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;

    @NotBlank(message = "Name can not be empty!")
    private String name;

    private String species;

    private long type;

    @ManyToOne
    private PlantModel plantModel;

    @Builder.Default
    private int XP = 0; // experience points
    private long wateringInterval; // in milliseconds => automatically converted at creation => check PlantService

    private long lastWatered; // in hours
    private int waterNeed; // in ml

    private int idealMoisture;
    private int worstMoisture;

    @NotBlank(message = "Device ID can not be empty!")
    private String deviceId;

    private String filelink;
    @Builder.Default
    private int level = 1;

    @Builder.Default
    private boolean autoPilot = false;

    @ManyToOne
    @NotNull
    private UserModel owner;

    // @OneToMany(mappedBy = "plant")
    // private WateringLog log;

    public String toString() {
        return "Name: " + name;
    }

    public long getId() {
        return id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    // public String getName() {
    // return name;
    // }

    // public int getXP() {
    // return XP;
    // }

    // public long getWateringInterval() {
    // return wateringInterval;
    // }

    // public long getLastWatered() {
    // return lastWatered;
    // }

    // public int getWaterNeed() {
    // return waterNeed;
    // }

    // public void setName(String name) {
    // this.name = name;
    // }

    // public void setXP(int XP) {
    // this.XP = XP;
    // }

    // public void setWateringInterval(long wateringInterval) {
    // this.wateringInterval = wateringInterval;
    // }

    public void setWaterNeed(int waterNeed) {
        this.waterNeed = waterNeed;
    }

    public void setAutoPilot(boolean autoPilot) {
        this.autoPilot = autoPilot;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public boolean getAutoPilot() {
        return autoPilot;
    }

    public void updateXP(int xp) {
        if (xp < 0) {
            throw new IllegalArgumentException("XP can not be negative");
        } else if (xp > 100) {
            throw new IllegalArgumentException("XP can not be more than 100");
        } else {
            if (this.XP + xp > 100) {
                this.XP = (this.XP + xp) - 100;
                this.level += 1;
            } else {
                this.XP += xp;
            }
        }
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    public void water() {
        this.lastWatered = new Date().getTime();
        updateXP(10);
    }

}