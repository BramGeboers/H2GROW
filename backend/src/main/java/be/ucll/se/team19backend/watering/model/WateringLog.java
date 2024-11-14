package be.ucll.se.team19backend.watering.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import be.ucll.se.team19backend.plant.model.Plant;
import be.ucll.se.team19backend.user.model.UserModel;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "watering_logs")
public class WateringLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    // @JoinColumn(name = "plant_id")
    private Plant plant;

    @ManyToOne
    // @JoinColumn(name = "user_id")
    private UserModel user;

    @Enumerated(EnumType.STRING)
    private WateringType type;

    // private Long plantId;

    // private Long userId;

    private Date timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = new Date();
    }
}