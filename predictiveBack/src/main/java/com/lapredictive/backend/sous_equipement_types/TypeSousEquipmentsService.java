package com.lapredictive.backend.sous_equipement_types;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lapredictive.backend.sous_equipement_types.dto.CreateTypeSousEquipementDto;
import com.lapredictive.backend.sous_equipement_types.dto.UpdateTypeSousEquipementDto;

@Service
public class TypeSousEquipmentsService {
    private TypeSousEquipmentsRepository typeSousEquipmentsRepository;

    public TypeSousEquipmentsService(TypeSousEquipmentsRepository typeSousEquipmentsRepository) {
        this.typeSousEquipmentsRepository = typeSousEquipmentsRepository;
    }

    public List<TypeSousEquipments> getAllSousEquipmentTypes() {
        return typeSousEquipmentsRepository.findAll();
    }

    public TypeSousEquipments getSousEquipmentType(Long id) {
        return typeSousEquipmentsRepository.findById(id).orElse(null);
    }

    public TypeSousEquipments createSousEquipmentType(CreateTypeSousEquipementDto createTypeSousEquipement) {
        TypeSousEquipments type = new TypeSousEquipments();
        type.setNom(createTypeSousEquipement.getNom());
        return typeSousEquipmentsRepository.save(type);
    }

    public TypeSousEquipments updateSousEquipmentType(Long id, UpdateTypeSousEquipementDto updateTypeSousEquipement) {

        TypeSousEquipments type = typeSousEquipmentsRepository.findById(id).orElse(null);
        type.setNom(updateTypeSousEquipement.getNom());
        return typeSousEquipmentsRepository.save(type);
    }

    public void deleteSousEquipmentType(Long id) {
        typeSousEquipmentsRepository.deleteById(id);
    }
}
