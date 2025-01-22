package com.lapredictive.backend.sous_zones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSousZoneDto {

    @NotBlank(message = "Nom is mandatory")
    private String nom;

    @NotNull(message = "Zone ID is mandatory")
    private Long zoneId;
}
