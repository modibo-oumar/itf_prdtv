package com.lapredictive.backend.predictions;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PredictionsController{

    private PredictionsService predictionsService;

    public PredictionsController(PredictionsService predictionsService){
        this.predictionsService= predictionsService;
    }
    
    @GetMapping("/predictions")
    public List<Prediction> getAllPredictions(){
        return predictionsService.getAllPredictions();
    }

    @GetMapping("/predictions/element/{elementId}")
    public List<Prediction> getAllElementPredictions(@PathVariable Long elementId){
        return predictionsService.getAllElementPredictions(elementId);
    }

    @GetMapping("/predictions/mesure/{mesureId}")
    public Prediction getMesurePrediction(@PathVariable Long mesureId){
        return predictionsService.getMesurePrediction(mesureId);
    }
    
}