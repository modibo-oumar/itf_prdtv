package com.lapredictive.backend.equipement_types;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lapredictive.backend.equipement_types.dto.CreateEquipmentTypeDto;
import com.lapredictive.backend.equipement_types.dto.UpdateEquipmentTypeDto;

@RestController
public class TypeEquipementsController {
    private TypeEquipementsService typeEquipementsService;

    public TypeEquipementsController(TypeEquipementsService typeEquipementsService){
        this.typeEquipementsService = typeEquipementsService;
    }

    @GetMapping("/equipmenttypes")
    public List<TypeEquipements> getAllEquipmentTypes(){
        return typeEquipementsService.getAllEquipmentTypes();
    }

    @GetMapping("/equipmenttype/{typeId}")
    public TypeEquipements getEquipmentType(@PathVariable Long typeId){
        return typeEquipementsService.getEquipementById(typeId);
    }

    @PostMapping("/admin/equipmenttype")
    public TypeEquipements createEquipmentType(@RequestBody CreateEquipmentTypeDto createEquipmentTypeDto){
        return typeEquipementsService.createEquipmentType(createEquipmentTypeDto);
    }

    @PutMapping("/admin/equipmenttype/{typeId}")
    public TypeEquipements updateEquipmentType(@PathVariable Long typeId,@RequestBody UpdateEquipmentTypeDto updateEquipmentTypeDto){
        return typeEquipementsService.updateEquipmentType(typeId, updateEquipmentTypeDto);
    }

    @DeleteMapping("/admin/equipmenttype/{typeId}")
    public void deleteEquipmentType(@PathVariable Long typeId){
        typeEquipementsService.deleteEquipmentType(typeId);
    }
}
