package com.lapredictive.backend.sous_zones;

import com.lapredictive.backend.droits.Droits;
import com.lapredictive.backend.droits.DroitsService;
import com.lapredictive.backend.sous_zones.dto.CreateSousZoneDto;
import com.lapredictive.backend.sous_zones.dto.UpdateSousZoneDto;
import com.lapredictive.backend.zones.ZoneService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class SousZonesService {

    private SousZonesRepository sousZonesRepository;
    private ZoneService zoneService;
    private DroitsService droitsService;

    public SousZonesService(SousZonesRepository sousZonesRepository,
            ZoneService zoneService,
            DroitsService droitsService) {
        this.sousZonesRepository = sousZonesRepository;
        this.zoneService = zoneService;
        this.droitsService = droitsService;
    }

    public List<SousZones> getAllSousZones() {
        return sousZonesRepository.findAll();
    }

    public SousZones getSousZone(Long id) {
        return sousZonesRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sous-Zone non existante avec l'id:  " + id));
    }

    public List<SousZones> getUserSousZones(Long userId) {

        // Step 1: Get the IDs of the zones the user has access to
        List<Droits> userPrivileges = droitsService.getAllUserPrivileges(userId);
        List<Long> accessibleZoneIds = userPrivileges.stream()
                .map(droits -> droits.getIdZone().getId())
                .collect(Collectors.toList());

        // Step 2: Fetch all SousZones for the zones the user can access
        List<SousZones> allSousZones = sousZonesRepository.findAll(); // Assuming this method returns all SousZones

        // Step 3: Filter SousZones to include only those that belong to accessible
        // zones
        List<SousZones> userSousZones = allSousZones.stream()
                .filter(sousZone -> accessibleZoneIds.contains(sousZone.getZone().getId()))
                .collect(Collectors.toList());

        return userSousZones;
    }

    public SousZones createSousZone(CreateSousZoneDto createSousZoneDto) {
        SousZones sousZone = new SousZones();

        sousZone.setNom(createSousZoneDto.getNom());
        sousZone.setZone(zoneService.getZone(createSousZoneDto.getZoneId()));
        return sousZonesRepository.save(sousZone);
    }

    public SousZones updateSousZone(Long id, UpdateSousZoneDto updateSousZoneDto) {
        SousZones updatedSousZone = sousZonesRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Equipement non existant avec l'id: " + id));
        updatedSousZone.setNom(updateSousZoneDto.getNom());
        updatedSousZone.setZone(zoneService.getZone(updateSousZoneDto.getZoneId()));

        return sousZonesRepository.save(updatedSousZone);
    }

    public void deleteSousZone(Long id) {
        sousZonesRepository.deleteById(id);
    }
}
