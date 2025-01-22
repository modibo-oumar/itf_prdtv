package com.lapredictive.backend.sous_equipements;

import com.lapredictive.backend.equipements.Equipements;
import com.lapredictive.backend.equipements.EquipementsService;
import com.lapredictive.backend.sous_equipement_types.TypeSousEquipmentsService;
import com.lapredictive.backend.sous_equipements.dto.CreateSousEquipementDto;
import com.lapredictive.backend.sous_equipements.dto.UpdateSousEquipementDto;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class SousEquipementsService {

    private SousEquipementsRepository sousEquipementsRepository;
    private EquipementsService equipementsService;
    private TypeSousEquipmentsService typeSousEquipmentsService;

    public SousEquipementsService(SousEquipementsRepository sousEquipementsRepository, TypeSousEquipmentsService typeSousEquipmentsService,
            EquipementsService equipementsService) {
        this.sousEquipementsRepository = sousEquipementsRepository;
        this.equipementsService = equipementsService;
        this.typeSousEquipmentsService = typeSousEquipmentsService;
    }

    public List<SousEquipements> getAllSousEquipements() {
        return sousEquipementsRepository.findAll();
    }

    public List<SousEquipements> getUserSousEquipements(Long userId) {

        List<Equipements> userEquipements = equipementsService.getUserEquipments(userId);

        List<SousEquipements> userSousEquipements = userEquipements.stream()
                .flatMap(
                        equipement -> sousEquipementsRepository.getUserSousEquipementsByEquipement(equipement).stream())
                .collect(Collectors.toList());

        return userSousEquipements;
    }

    public SousEquipements getSousEquipement(Long id) {
        return sousEquipementsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sous-Equipement non existant avec l'id: " + id));
    }

    public SousEquipements createSousEquipement(CreateSousEquipementDto createSousEquipementDto) {
        SousEquipements sousEquipement = new SousEquipements();

        sousEquipement.setNom(createSousEquipementDto.getNom());
        sousEquipement.setType(typeSousEquipmentsService.getSousEquipmentType(createSousEquipementDto.getType()));
        sousEquipement.setEquipement(equipementsService.getEquipement(createSousEquipementDto.getEquipementId()));

        return sousEquipementsRepository.save(sousEquipement);
    }

    public SousEquipements updateSousEquipement(Long id, UpdateSousEquipementDto updateSousEquipementDto) {
        SousEquipements existingSousEquipement = sousEquipementsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        "Sous-Equipement non existant avec l'id: " + id));

        existingSousEquipement.setNom(updateSousEquipementDto.getNom());
        existingSousEquipement.setType(typeSousEquipmentsService.getSousEquipmentType(updateSousEquipementDto.getType()));

        existingSousEquipement
                .setEquipement(equipementsService.getEquipement(updateSousEquipementDto.getEquipementId()));

        return sousEquipementsRepository.save(existingSousEquipement);
    }

    public void deleteSousEquipement(Long id) {
        sousEquipementsRepository.deleteById(id);
    }
}
