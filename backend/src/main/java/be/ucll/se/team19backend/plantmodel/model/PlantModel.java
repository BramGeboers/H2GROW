package be.ucll.se.team19backend.plantmodel.model;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "PlantModel")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlantModel {

    @Hidden
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long id;

    private String modelLink;

    private Float scale;

    private Float rotation;

    private Float x;
    private Float y;
    private Float z;
}