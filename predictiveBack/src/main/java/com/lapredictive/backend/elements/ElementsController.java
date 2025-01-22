package com.lapredictive.backend.elements;

import com.lapredictive.backend.elements.dto.CreateElementDto;
import com.lapredictive.backend.elements.dto.UpdateElementDto;
import com.lapredictive.backend.predictions.Prediction;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ElementsController {

    private final ElementsService elementsService;

    public ElementsController(ElementsService elementsService) {
        this.elementsService = elementsService;
    }

    @GetMapping("/elements")
    public ResponseEntity<List<Elements>> getAllElements() {
        List<Elements> elementsList = elementsService.getAllElements();
        return ResponseEntity.ok(elementsList);
    }

    @GetMapping("/element/{id}")
    public ResponseEntity<Elements> getElement(@PathVariable Long id) {
        Elements element = elementsService.getElement(id);
        return ResponseEntity.ok(element);
    }
    
    @GetMapping("/elements/utilisateur/{userId}")
    public ResponseEntity<List<Elements>> getUserElements(@PathVariable Long userId){
        return ResponseEntity.ok(elementsService.getUserElements(userId));
    }

    @GetMapping("/element/{id}/prediction")
    public ResponseEntity<Prediction> getLatestPredictionFromElementId(@PathVariable Long id){
        Prediction latestPrediction =  elementsService.getLatestPredictionByElementId(id);
        return ResponseEntity.ok(latestPrediction);
    }

    @PostMapping("/admin/element")
    public ResponseEntity<Elements> createElement(@RequestBody CreateElementDto createElementDto) {
        Elements createdElement = elementsService.createElement(createElementDto);
        return ResponseEntity.status(201).body(createdElement);
    }

    @PutMapping("/admin/element/{id}")
    public ResponseEntity<Elements> updateElement(@PathVariable Long id, @RequestBody UpdateElementDto updateElementDto) {
        Elements updatedElement = elementsService.updateElement(id,updateElementDto);
        return ResponseEntity.ok(updatedElement);
    }

    @DeleteMapping("/admin/element/{id}")
    public ResponseEntity<Void> deleteElement(@PathVariable("id") Long id) {
        elementsService.deleteElement(id);
        return ResponseEntity.noContent().build();
    }
}
