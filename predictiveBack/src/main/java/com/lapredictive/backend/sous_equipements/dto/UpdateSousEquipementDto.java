package com.lapredictive.backend.sous_equipements.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSousEquipementDto {

    private Long id;

    @NotBlank
    private String nom;

    private Long type;

    private Long equipementId;
}
