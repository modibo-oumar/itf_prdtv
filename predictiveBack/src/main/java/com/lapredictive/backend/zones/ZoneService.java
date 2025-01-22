package com.lapredictive.backend.zones;

import java.util.List;

import com.lapredictive.backend.droits.Droits;
import com.lapredictive.backend.droits.DroitsService;
import com.lapredictive.backend.societes.SocietyRepository;
import com.lapredictive.backend.utilisateurs.service.UserService;
import com.lapredictive.backend.zones.dto.CreateZoneDto;
import com.lapredictive.backend.zones.dto.UpdateZoneDto;

import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ZoneService {

    private ZoneRepository zoneRepository;
    private SocietyRepository societyRepository;
    private UserService userService;
    private DroitsService droitsService;

    public ZoneService(ZoneRepository zoneRepository, SocietyRepository societyRepository, UserService userService,
            DroitsService droitsService) {
        this.zoneRepository = zoneRepository;
        this.societyRepository = societyRepository;
        this.userService = userService;
        this.droitsService = droitsService;
    }

    public List<Zones> getAllZones() {
        return zoneRepository.findAll();
    }

    public Zones getZone(Long id) {
        return zoneRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Zone non existante avec l'id:  " + id));
    }

    public Zones createZone(CreateZoneDto createZoneDto) {
        Zones zone = new Zones();
        zone.setNom(createZoneDto.getNom());
        zone.setSociete(societyRepository.findById(createZoneDto.getSocieteId()).orElse(null));

        return zoneRepository.save(zone);
    }

    public Zones updateZone(Long id, UpdateZoneDto zoneDto) {
        Zones updatedZone = zoneRepository.findById(id).orElse(null);
        updatedZone.setNom(zoneDto.getNom());
        updatedZone.setSociete(societyRepository.findById(zoneDto.getSocieteId()).orElse(null));

        return zoneRepository.save(updatedZone);
    }

    public void deleteZone(Long id) {
        zoneRepository.deleteById(id);
    }

    public List<Zones> getZonesByUserId(Long userId) {

        Long userSocietyId = userService.getUserById(userId).getSociety().getId();

        List<Droits> userPrivileges = droitsService.getAllUserPrivileges(userId);

        List<Zones> allZonesBySociety = zoneRepository
                .findBySociete(societyRepository.findById(userSocietyId).orElse(null));

        Set<Long> accessibleZoneIds = userPrivileges.stream()
                .map(droits -> droits.getIdZone().getId())
                .collect(Collectors.toSet());

        List<Zones> userZones = allZonesBySociety.stream()
                .filter(zone -> accessibleZoneIds.contains(zone.getId()))
                .collect(Collectors.toList());

        return userZones;
    }

    public List<Zones> allZonesBySociety(Long societyId){
        return zoneRepository.findBySociete(societyRepository.findById(societyId).orElse(null));
    }
}
