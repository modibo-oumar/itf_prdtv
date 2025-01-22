package com.lapredictive.backend.equipement_types;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lapredictive.backend.equipement_types.dto.CreateEquipmentTypeDto;
import com.lapredictive.backend.equipement_types.dto.UpdateEquipmentTypeDto;

@Service
public class TypeEquipementsService {
    
    private TypeEquipementsRepository typeEquipementsRepository;

    public TypeEquipementsService(TypeEquipementsRepository typeEquipementsRepository){
        this.typeEquipementsRepository = typeEquipementsRepository;
    }

    public List<TypeEquipements> getAllEquipmentTypes(){
        return typeEquipementsRepository.findAll();
    }

    public TypeEquipements getEquipementById(Long id){
        return typeEquipementsRepository.findById(id).orElse(null);
    }

    public TypeEquipements createEquipmentType (CreateEquipmentTypeDto createEquipmentTypeDto){
        TypeEquipements type = new TypeEquipements();

        type.setNom(createEquipmentTypeDto.getNom());

        return typeEquipementsRepository.save(type);
    }

    public TypeEquipements updateEquipmentType (Long typeId,UpdateEquipmentTypeDto updateEquipmentTypeDto){
        TypeEquipements type = typeEquipementsRepository.findById(typeId).orElse(null);
        type.setNom(updateEquipmentTypeDto.getNom());

        return typeEquipementsRepository.save(type);
    }

    public void deleteEquipmentType(Long id){
        typeEquipementsRepository.deleteById(id);
    }
}
