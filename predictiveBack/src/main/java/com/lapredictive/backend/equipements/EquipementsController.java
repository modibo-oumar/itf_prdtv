package com.lapredictive.backend.equipements;

import com.lapredictive.backend.equipements.dto.CreateEquipementDto;
import com.lapredictive.backend.equipements.dto.UpdateEquipementDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EquipementsController {

    private final EquipementsService equipementsService;

    public EquipementsController(EquipementsService equipementsService) {
        this.equipementsService = equipementsService;
    }

    @GetMapping("/equipements")
    public ResponseEntity<List<Equipements>> getAllEquipements() {
        List<Equipements> equipementsList = equipementsService.getAllEquipements();
        return ResponseEntity.ok(equipementsList);
    }

    @GetMapping("/equipement/{id}")
    public ResponseEntity<Equipements> getEquipement(@PathVariable Long id) {
        Equipements equipement = equipementsService.getEquipement(id);
        return ResponseEntity.ok(equipement);
    }

    @GetMapping("/equipements/utilisateur/{userId}")
    public ResponseEntity<List<Equipements>> getUserEquipments(@PathVariable Long userId){
        List<Equipements> equipementsList = equipementsService.getUserEquipments(userId);
        return ResponseEntity.ok(equipementsList);

    }

    @PostMapping("/admin/equipement")
    public ResponseEntity<Equipements> createEquipement(@RequestBody CreateEquipementDto createEquipementDto) {
        Equipements createdEquipement = equipementsService.createEquipement(createEquipementDto);
        return ResponseEntity.status(201).body(createdEquipement);
    }

    @PutMapping("/admin/equipement/{id}")
    public ResponseEntity<Equipements> updateEquipement(@PathVariable Long id, @RequestBody UpdateEquipementDto updateEquipementDto) {
        Equipements updatedEquipement = equipementsService.updateEquipement(id, updateEquipementDto);
        return ResponseEntity.ok(updatedEquipement);
    }

    @DeleteMapping("/admin/equipement/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        equipementsService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }
}
