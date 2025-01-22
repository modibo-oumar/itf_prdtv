package com.lapredictive.backend.equipements;

import com.lapredictive.backend.droits.Droits;
import com.lapredictive.backend.droits.DroitsService;
import com.lapredictive.backend.equipement_types.TypeEquipementsService;
import com.lapredictive.backend.equipements.dto.CreateEquipementDto;
import com.lapredictive.backend.equipements.dto.UpdateEquipementDto;
import com.lapredictive.backend.sous_zones.SousZones;
import com.lapredictive.backend.sous_zones.SousZonesRepository;
import com.lapredictive.backend.sous_zones.SousZonesService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class EquipementsService {

    private EquipementsRepository equipementsRepository;
    private SousZonesService sousZonesService;
    private DroitsService droitsService;
    private SousZonesRepository sousZonesRepository;
    private TypeEquipementsService typeEquipementsService;

    public EquipementsService(EquipementsRepository equipementsRepository, SousZonesService sousZonesService,
            DroitsService droitsService, SousZonesRepository sousZonesRepository, TypeEquipementsService typeEquipementsService) {
        this.equipementsRepository = equipementsRepository;
        this.sousZonesService = sousZonesService;
        this.droitsService = droitsService;
        this.typeEquipementsService = typeEquipementsService;
        this.sousZonesRepository = sousZonesRepository;
    }

    public List<Equipements> getAllEquipements() {
        return equipementsRepository.findAll();
    }

    public Equipements getEquipement(Long id) {
        return equipementsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Equipement non existant avec l'id: " + id));
    }

    public List<Equipements> getUserEquipments(Long userId) {
        // Step 1: Get the IDs of the zones the user has access to
        List<Droits> userPrivileges = droitsService.getAllUserPrivileges(userId);
        List<Long> accessibleZoneIds = userPrivileges.stream()
                .map(droits -> droits.getIdZone().getId())
                .collect(Collectors.toList());

        // Step 2: Get the SousZones that belong to these zones
        List<SousZones> userSousZones = sousZonesRepository.findAll().stream()
                .filter(sousZone -> accessibleZoneIds.contains(sousZone.getZone().getId()))
                .collect(Collectors.toList());

        // Step 3: Retrieve all Equipements associated with these SousZones
        List<Equipements> userEquipments = userSousZones.stream()
                .flatMap(sousZone -> equipementsRepository.getEquipmentsBySousZone(sousZone).stream())
                .collect(Collectors.toList());

        return userEquipments;
    }

    public Equipements createEquipement(CreateEquipementDto createEquipementDto) {
        SousZones sousZone = sousZonesService.getSousZone(createEquipementDto.getSousZoneId());

        Equipements equipement = new Equipements();
        equipement.setNom(createEquipementDto.getNom());
        equipement.setType(typeEquipementsService.getEquipementById(createEquipementDto.getType()));
        equipement.setSousZone(sousZone);

        return equipementsRepository.save(equipement);
    }

    public Equipements updateEquipement(Long id, UpdateEquipementDto updateEquipementDto) {
        Equipements existingEquipement = equipementsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Equipement non existant avec l'id: " + id));

        existingEquipement.setNom(updateEquipementDto.getNom());
        existingEquipement.setType(typeEquipementsService.getEquipementById(updateEquipementDto.getType()));;

        SousZones sousZone = sousZonesService.getSousZone(updateEquipementDto.getSousZoneId());

        existingEquipement.setSousZone(sousZone);

        return equipementsRepository.save(existingEquipement);
    }

    public void deleteEquipement(Long id) {
        equipementsRepository.deleteById(id);
    }
}
