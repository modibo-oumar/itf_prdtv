package com.lapredictive.backend.mesures;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;

@Repository
public interface MesuresRepository extends JpaRepository<Mesure, Long> {

    @Query(value = "SELECT m FROM Mesure m WHERE m.element.id = :elementId ORDER BY m.date DESC")
    List<Mesure> findTop20ByElementIdOrderByDateDesc(Integer elementId);

    @Query("SELECT m FROM Mesure m WHERE m.element.id = :elementId AND m.date BETWEEN :startDate AND :endDate ORDER BY m.date DESC")
    List<Mesure> findByElementIdAndDateBetween(Integer elementId, OffsetDateTime startDate, OffsetDateTime endDate);

    @Query("SELECT m FROM Mesure m WHERE m.element.id = :elementId AND m.date BETWEEN " +
            "(SELECT MIN(m2.date) FROM Mesure m2 WHERE m2.element.id = :elementId AND m2.date <= :date) AND " +
            "(SELECT MAX(m2.date) FROM Mesure m2 WHERE m2.element.id = :elementId AND m2.date >= :date) " +
            "ORDER BY m.date")
    List<Mesure> findSurroundingMesures(
            @Param("elementId") Integer elementId,
            @Param("date") OffsetDateTime date);
}
