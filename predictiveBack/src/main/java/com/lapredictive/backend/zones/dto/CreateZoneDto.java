package com.lapredictive.backend.zones.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateZoneDto {

    @NotBlank(message = "Nom is mandatory")
    private String nom;

    @NotNull(message = "Societe ID is mandatory")
    private Long societeId;
}
