package com.lapredictive.backend.equipements.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEquipementDto {

    @NotBlank(message = "Nom est obligatoire")
    private String nom;

    @NotBlank(message = "Type est obligatoire")
    private Long type;

    @NotNull(message = "SousZone est oligatoire")
    private Long sousZoneId;
}
