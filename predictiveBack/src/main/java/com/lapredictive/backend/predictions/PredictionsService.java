package com.lapredictive.backend.predictions;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class PredictionsService{

    private PredictionsRepository predictionsRepository;

    public PredictionsService(PredictionsRepository predictionsRepository){
        this.predictionsRepository = predictionsRepository;
    }

    public List<Prediction> getAllPredictions(){
        return predictionsRepository.findAll();
    }

    public List<Prediction> getAllElementPredictions(Long elementId){
        return predictionsRepository.findByElementId(elementId);
    }

    public Prediction getMesurePrediction(Long mesureId) {
        return predictionsRepository.findByIdMesure_Id(mesureId);
    }

    public Prediction getLatestPredictionByElementId(Long elementId){
        return predictionsRepository.findLatestPredictionByElementId(elementId).orElse(null);
    }
}