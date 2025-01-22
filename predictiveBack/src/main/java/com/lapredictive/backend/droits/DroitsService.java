package com.lapredictive.backend.droits;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.lapredictive.backend.droits.dto.CreateDroitDto;
import com.lapredictive.backend.droits.dto.UpdateDroitDto;
import com.lapredictive.backend.utilisateurs.service.UserService;
import com.lapredictive.backend.zones.ZoneRepository;

@Service
public class DroitsService {

    private DroitsRepository droitsRepository;
    private UserService userService;
    private ZoneRepository zoneRepository;

    public DroitsService(DroitsRepository droitsRepository, UserService userService, ZoneRepository zoneRepository) {
        this.droitsRepository = droitsRepository;
        this.userService = userService;
        this.zoneRepository = zoneRepository;
    }

    public List<Droits> getAllUserPrivileges(Long userId) {
        return droitsRepository.findByIdUtilisateur(userService.getUserById(userId));
    }

    public Droits createDroit(CreateDroitDto createDroitDto) {
        Droits droit = new Droits();
        droit.setIdUtilisateur(userService.getUserById(createDroitDto.getUserId()));
        droit.setIdZone(zoneRepository.findById(createDroitDto.getZoneId()).orElse(null));

        return droitsRepository.save(droit);
    }

    public Droits updatePrivilege(Long id, UpdateDroitDto updateDroitDto) {
        Droits droit = droitsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Droit non existant avec l'id: " + id));
        droit.setIdUtilisateur(userService.getUserById(updateDroitDto.getUserId()));
        droit.setIdZone(zoneRepository.findById(updateDroitDto.getZoneId()).orElse(null));

        return droitsRepository.save(droit);
    }

    public void deletePrivilege(Long id) {
        droitsRepository.deleteById(id);
    }
}
