package com.lapredictive.backend.zones;

import com.lapredictive.backend.zones.dto.CreateZoneDto;
import com.lapredictive.backend.zones.dto.UpdateZoneDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping("/zones")
    public ResponseEntity<List<Zones>> getAllZones() {
        List<Zones> zones = zoneService.getAllZones();
        return ResponseEntity.ok(zones);
    }

    @GetMapping("/zone/{id}")
    public ResponseEntity<Zones> getZoneById(@PathVariable Long id) {
        try {
            Zones zone = zoneService.getZone(id);
            return ResponseEntity.ok(zone);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/zones/utilisateur/{userId}")
    public ResponseEntity<List<Zones>> getZonesByUserId(@PathVariable Long userId){
        List<Zones> userZones =  zoneService.getZonesByUserId(userId);
        return ResponseEntity.ok(userZones);
    }

    @GetMapping("/zones/societe/{societyId}")
    public ResponseEntity<List<Zones>> getZonesBySocietyID(@PathVariable Long societyId){
        List<Zones> userZones =  zoneService.allZonesBySociety(societyId);
        return ResponseEntity.ok(userZones);
    }

    @PostMapping("/admin/zone")
    public ResponseEntity<Zones> createZone(@RequestBody CreateZoneDto createZoneDto) {
        Zones createdZone = zoneService.createZone(createZoneDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdZone);
    }

    @PutMapping("/admin/zone/{id}")
    public ResponseEntity<Zones> updateZone(@PathVariable Long id, @RequestBody UpdateZoneDto updateZoneDto) {
        try {
            Zones updatedZone = zoneService.updateZone(id, updateZoneDto);
            return ResponseEntity.ok(updatedZone);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/admin/zone/{id}")
    public void deleteZone(@PathVariable Long id) {
        zoneService.deleteZone(id);
    }
}