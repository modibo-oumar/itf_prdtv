package com.lapredictive.backend.mesures;

import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.OffsetDateTime;

@RestController
public class MesureController {

    private final MesuresService mesuresService;

    public MesureController(MesuresService mesuresService) {
        this.mesuresService = mesuresService;
    }

    @GetMapping("/mesures")
    public List<Mesure> getAllMesures() {
        return mesuresService.getAllMesures();
    }

    @GetMapping("/mesures/{elementId}/latest")
    public ResponseEntity<List<Mesure>> getLatestMesures(
            @PathVariable Integer elementId) {
        List<Mesure> mesures = mesuresService.getLatestMesuresByElementId(elementId);
        return ResponseEntity.ok(mesures);
    }

    @GetMapping("/mesures/range/{elementId}")
    public ResponseEntity<List<Mesure>> getMesuresByRange(
            @PathVariable Integer elementId,
            @RequestParam OffsetDateTime startDate,
            @RequestParam OffsetDateTime endDate) {
        List<Mesure> mesures = mesuresService.getMesuresByDateRange(elementId, startDate, endDate);
        return ResponseEntity.ok(mesures);
    }

    @GetMapping("/mesures/details/{elementId}")
    public ResponseEntity<List<Mesure>> getDetailedMesures(
            @PathVariable Integer elementId,
            @RequestParam OffsetDateTime date) {
        List<Mesure> mesures = mesuresService.getDetailedMesures(elementId, date);
        return ResponseEntity.ok(mesures);
    }
}
