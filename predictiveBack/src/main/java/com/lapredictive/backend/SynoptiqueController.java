package com.lapredictive.backend;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/synoptiques")
public class SynoptiqueController {

    private static final List<String> IMAGE_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png");

    @GetMapping("/{societe}/{zone}/{sousZone}")
    public ResponseEntity<Resource> getSynoptique(
            @PathVariable String societe,
            @PathVariable String zone,
            @PathVariable String sousZone) {

        try {
            Path directoryPath = Paths.get("src/main/resources/Synoptiques", societe, zone, sousZone)
                    .toAbsolutePath()
                    .normalize();

            File directory = directoryPath.toFile();
            if (directory.exists() && directory.isDirectory()) {
                File[] files = directory.listFiles((dir, name) -> 
                    IMAGE_EXTENSIONS.stream().anyMatch(ext -> name.toLowerCase().endsWith("." + ext))
                );

                if (files != null && files.length > 0) {
                    // Return the first image file found
                    File imageFile = files[0];
                    Path filePath = imageFile.toPath();
                    Resource resource = new UrlResource(filePath.toUri());
                    
                    if (resource.exists()) {
                        return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                        "inline; filename=\"" + imageFile.getName() + "\"")
                                .body(resource);
                    }
                }
            }

            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
