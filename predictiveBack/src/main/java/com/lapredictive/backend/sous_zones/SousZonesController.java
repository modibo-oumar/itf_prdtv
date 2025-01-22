package com.lapredictive.backend.sous_zones;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lapredictive.backend.sous_zones.dto.CreateSousZoneDto;
import com.lapredictive.backend.sous_zones.dto.UpdateSousZoneDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.util.StringUtils;

@RestController
public class SousZonesController {

    private SousZonesService sousZonesService;

    public SousZonesController(SousZonesService sousZonesService) {
        this.sousZonesService = sousZonesService;
    }

    @GetMapping("/sousZones")
    public ResponseEntity<List<SousZones>> getAllSousZones() {
        List<SousZones> sousZonesList = sousZonesService.getAllSousZones();
        return ResponseEntity.ok(sousZonesList);
    }

    @GetMapping("/sousZone/{id}")
    public ResponseEntity<SousZones> getSousZone(@PathVariable Long id) {
        SousZones sousZone = sousZonesService.getSousZone(id);
        return ResponseEntity.ok(sousZone);
    }

    @GetMapping("/sousZones/utilisateur/{userId}")
    public ResponseEntity<List<SousZones>> getUserSousZones(@PathVariable Long userId){
        List<SousZones> userSousZones = sousZonesService.getUserSousZones(userId);
        return ResponseEntity.ok(userSousZones);
    }

    @DeleteMapping("/admin/sousZone/{id}")
    public ResponseEntity<Void> deleteSousZone(@PathVariable Long id) {
        sousZonesService.deleteSousZone(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/souszone")
    public ResponseEntity<String> createSousZone(
            @RequestPart("sousZoneDto") String sousZoneDtoString,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // Convert the JSON string back to CreateSousZoneDto object
        ObjectMapper objectMapper = new ObjectMapper();
        CreateSousZoneDto createSousZoneDto;

        try {
            createSousZoneDto = objectMapper.readValue(sousZoneDtoString, CreateSousZoneDto.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid SousZone data");
        }

        // Use the existing service to create a new SousZone
        SousZones createdSousZone = sousZonesService.createSousZone(createSousZoneDto);

        // Save the file if it exists
        if (file != null && !file.isEmpty()) {
            String response = saveFile(file, createdSousZone);
            if (!response.equals("File uploaded successfully")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        return ResponseEntity.ok("SousZone created successfully");
    }

    @PutMapping("/admin/souszone/{sousZoneId}")
    public ResponseEntity<String> updateSousZone(
            @PathVariable Long sousZoneId,
            @RequestPart("sousZoneDto") String sousZoneDtoString,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // Convert the JSON string back to UpdateSousZoneDto object
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateSousZoneDto updateSousZoneDto;

        try {
            updateSousZoneDto = objectMapper.readValue(sousZoneDtoString, UpdateSousZoneDto.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid SousZone data");
        }

        // Use the existing service to update the SousZone
        SousZones updatedSousZone = sousZonesService.updateSousZone(sousZoneId, updateSousZoneDto);

        // Save the file if it exists
        if (file != null && !file.isEmpty()) {
            String response = saveFile(file, updatedSousZone);
            if (!response.equals("File uploaded successfully")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        return ResponseEntity.ok("SousZone updated successfully");
    }


    private String saveFile(MultipartFile file, SousZones sousZone) {
        String societeName = sousZone.getZone().getSociete().getName();
        String zoneName = sousZone.getZone().getNom();
        String sousZoneName = sousZone.getNom();

        // Define the directory path
        String directoryPath = Paths.get("src", "main", "resources", "Synoptiques", societeName, zoneName, sousZoneName)
                .toString();
        File directory = new File(directoryPath);

        // Create directories if they don't exist
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            // Define the file path for the image
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = Paths.get(directoryPath, originalFilename);

            // Save the file to the defined path
            Files.write(filePath, file.getBytes());

            // Return success response
            return "File uploaded successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file";
        }
    }
}




    // // @PostMapping("/admin/sousZone")
    // public ResponseEntity<SousZones> createSousZone(@RequestBody CreateSousZoneDto createSousZoneDto) {
    //     SousZones createdSousZone = sousZonesService.createSousZone(createSousZoneDto);
    //     return ResponseEntity.status(201).body(createdSousZone);
    // }

    // // @PutMapping("/admin/sousZone/{id}")
    // public ResponseEntity<SousZones> updateSousZone(@PathVariable Long id, @RequestBody UpdateSousZoneDto updateSousZoneDto) {
    //     updateSousZoneDto.setId(id);
    //     SousZones updatedSousZone = sousZonesService.updateSousZone(id,updateSousZoneDto);
    //     return ResponseEntity.ok(updatedSousZone);
    // }