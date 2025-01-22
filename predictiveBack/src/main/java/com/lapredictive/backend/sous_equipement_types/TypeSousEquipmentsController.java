package com.lapredictive.backend.sous_equipement_types;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lapredictive.backend.sous_equipement_types.dto.CreateTypeSousEquipementDto;
import com.lapredictive.backend.sous_equipement_types.dto.UpdateTypeSousEquipementDto;

@RestController
public class TypeSousEquipmentsController {
    private TypeSousEquipmentsService typeSousEquipmentsService;

    public TypeSousEquipmentsController(TypeSousEquipmentsService typeSousEquipmentsService){
        this.typeSousEquipmentsService = typeSousEquipmentsService;
    }

    @GetMapping("/sousequipementtypes")
    public List<TypeSousEquipments> getAllSousEquipmentTypes(){
        return typeSousEquipmentsService.getAllSousEquipmentTypes();
    }

    @GetMapping("/sousequipementtype/{typeId}")
    public TypeSousEquipments getTypeSousEquipment(@PathVariable Long typeId){
        return typeSousEquipmentsService.getSousEquipmentType(typeId);
    }

    @PostMapping("/admin/sousequipementstype")
    public TypeSousEquipments createTypeSousEquipments(@RequestBody CreateTypeSousEquipementDto createTypeSousEquipementDto){
        return typeSousEquipmentsService.createSousEquipmentType(createTypeSousEquipementDto);
    }

    @PutMapping("/admin/sousequipementstype/{typeId}")
    public TypeSousEquipments updateTypeSousEquipments(@PathVariable Long id, @RequestBody UpdateTypeSousEquipementDto updateTypeSousEquipmentsDto){
        return typeSousEquipmentsService.updateSousEquipmentType(id, updateTypeSousEquipmentsDto);
    }

    @DeleteMapping("/admin/sousequipementstype/{typeId}")
    public void deleteTypeSousEquipments(@PathVariable Long typeId){
        typeSousEquipmentsService.deleteSousEquipmentType(typeId);
    }
}
