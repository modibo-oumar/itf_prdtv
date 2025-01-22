package com.lapredictive.backend.droits;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lapredictive.backend.droits.dto.CreateDroitDto;
import com.lapredictive.backend.droits.dto.UpdateDroitDto;

@RestController
public class DroitsController {

    private DroitsService droitsService;

    public DroitsController(DroitsService droitsService){
        this.droitsService = droitsService;
    }

    @GetMapping("/droits/{userId}")
    public List<Droits> getAllUserPrivileges(@PathVariable Long userId){
        return droitsService.getAllUserPrivileges(userId);
    }

    @PostMapping("/admin/droit")
    public Droits createDroit(@RequestBody CreateDroitDto createDroitDto){
        return droitsService.createDroit(createDroitDto);
    }

    @PutMapping("/admin/droit/{idDroit}")
    public Droits updatePrivilege(@PathVariable Long idDroit, @RequestBody UpdateDroitDto updateDroitDto){
        return droitsService.updatePrivilege(idDroit, updateDroitDto);
    }

    @DeleteMapping("/admin/droit/{id}")
    public void DeleteDroit(@PathVariable Long id){
        droitsService.deletePrivilege(id);
    }
}
