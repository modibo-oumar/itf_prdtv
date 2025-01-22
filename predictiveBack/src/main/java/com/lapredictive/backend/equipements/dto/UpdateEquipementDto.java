package com.lapredictive.backend.equipements.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEquipementDto {

    private String nom;
    private Long type;

    @NotNull(message = "SousZone est obligatoire")
    private Long sousZoneId;
}
