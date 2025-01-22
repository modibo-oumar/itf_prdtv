package com.lapredictive.backend.predictions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionsRepository extends JpaRepository<Prediction, Integer> {

    @Query("SELECT p FROM Prediction p JOIN p.idMesure m JOIN m.element e WHERE e.id = :elementId")
    List<Prediction> findByElementId(@Param("elementId") Long elementId);

    Prediction findByIdMesure_Id(Long mesureId);

    @Query("SELECT p FROM Prediction p WHERE p.idMesure.element.id = :elementId ORDER BY p.idMesure.date DESC LIMIT 1")
    Optional<Prediction> findLatestPredictionByElementId(Long elementId);

}
