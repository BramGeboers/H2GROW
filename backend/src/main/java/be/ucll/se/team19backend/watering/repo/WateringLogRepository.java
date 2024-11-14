package be.ucll.se.team19backend.watering.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import be.ucll.se.team19backend.watering.model.WateringLog;
import org.springframework.data.domain.Pageable;

@Repository
public interface WateringLogRepository extends JpaRepository<WateringLog, Long> {
    List<WateringLog> findAll();

    List<WateringLog> findWateringLogsByPlantId(Long plantId);

    List<WateringLog> findWateringLogsByUserUserId(Long userId);

    @Query("SELECT wl FROM WateringLog wl ORDER BY wl.timestamp DESC")
    List<WateringLog> findLast10WateringLogs(Pageable pageable);

}
