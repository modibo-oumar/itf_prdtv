package com.lapredictive.backend.sous_equipements;

import com.lapredictive.backend.sous_equipements.dto.CreateSousEquipementDto;
import com.lapredictive.backend.sous_equipements.dto.UpdateSousEquipementDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SousEquipementsController {

    private final SousEquipementsService sousEquipementsService;

    public SousEquipementsController(SousEquipementsService sousEquipementsService) {
        this.sousEquipementsService = sousEquipementsService;
    }

    @GetMapping("/sousequipements")
    public ResponseEntity<List<SousEquipements>> getAllSousEquipements() {
        List<SousEquipements> sousEquipementsList = sousEquipementsService.getAllSousEquipements();
        return ResponseEntity.ok(sousEquipementsList);
    }

    @GetMapping("/sousequipement/{id}")
    public ResponseEntity<SousEquipements> getSousEquipement(@PathVariable Long id) {
        SousEquipements sousEquipement = sousEquipementsService.getSousEquipement(id);
        return ResponseEntity.ok(sousEquipement);
    }

    @GetMapping("/sousequipements/utilisateur/{userId}")
    public ResponseEntity<List<SousEquipements>> getUserSousEquipements(@PathVariable Long userId){
        List<SousEquipements> userSousEquipements = sousEquipementsService.getUserSousEquipements(userId);
        return ResponseEntity.ok(userSousEquipements);
    }

    @PostMapping("/admin/sousequipement")
    public ResponseEntity<SousEquipements> createSousEquipement(@RequestBody CreateSousEquipementDto createSousEquipementDto) {
        SousEquipements createdSousEquipement = sousEquipementsService.createSousEquipement(createSousEquipementDto);
        return ResponseEntity.status(201).body(createdSousEquipement);
    }

    @PutMapping("/admin/sousequipement/{id}")
    public ResponseEntity<SousEquipements> updateSousEquipement(@PathVariable Long id, @RequestBody UpdateSousEquipementDto updateSousEquipementDto) {
        updateSousEquipementDto.setId(id);
        SousEquipements updatedSousEquipement = sousEquipementsService.updateSousEquipement(id,updateSousEquipementDto);
        return ResponseEntity.ok(updatedSousEquipement);
    }

    @DeleteMapping("/admin/sousequipement/{id}")
    public ResponseEntity<Void> deleteSousEquipement(@PathVariable Long id) {
        sousEquipementsService.deleteSousEquipement(id);
        return ResponseEntity.noContent().build();
    }
}
