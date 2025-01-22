package com.lapredictive.backend.societes;

import com.lapredictive.backend.societes.dto.UpdateSocietyDto;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SocietyController {

    public SocietyController(SocietyRepository societyRepository) {
        this.societyRepository = societyRepository;
    }

    private SocietyRepository societyRepository;

    @GetMapping("/societies")
    public List<Society> getAllSocieties() {
        return societyRepository.findAll();
    }

    @GetMapping("/societie/{id}")
    public Society getSocietyById(@PathVariable Long id) {
        return societyRepository.findById(id).orElseThrow(() -> new RuntimeException("Society not found"));
    }

    @GetMapping("/societie/{name}")
    public Society getSocietyByName(@PathVariable String name) {
        return societyRepository.findByName(name).orElseThrow(() -> new RuntimeException("Society not found"));
    }

    @PostMapping("/admin/societie")
    public Society createSociety(@RequestBody Society society) {
        return societyRepository.save(society);
    }

    @PutMapping("/admin/societe/{societyId}")
    public ResponseEntity<Society> updateSociety(@PathVariable Long societyId,
            @RequestBody UpdateSocietyDto updateSocietyDto) {
        Society societeExistante = societyRepository.findById(societyId).orElse(null);
        societeExistante.setContact(updateSocietyDto.getContact());
        societeExistante.setEmail(updateSocietyDto.getEmail());
        societeExistante.setName(updateSocietyDto.getName());

        return ResponseEntity.ok(societyRepository.save(societeExistante));
    }

    @DeleteMapping("/admin/societie/{id}")
    public void deleteSociety(@PathVariable Long id) {
        societyRepository.deleteById(id);
    }
}
