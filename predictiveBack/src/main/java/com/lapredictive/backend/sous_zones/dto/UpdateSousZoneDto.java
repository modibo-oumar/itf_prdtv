package com.lapredictive.backend.sous_zones.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSousZoneDto {

    @NotNull(message = "ID is mandatory")
    private Long id;

    @Size(max = 255, message = "Nom must be at most 255 characters")
    private String nom;

    @NotNull(message = "Zone ID is mandatory")
    private Long zoneId;
}
