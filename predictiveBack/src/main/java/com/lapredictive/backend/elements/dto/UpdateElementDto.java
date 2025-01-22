package com.lapredictive.backend.elements.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateElementDto {

    @NotBlank
    private String nom;

    private Long type;

    private Long sousEquipementId;
}
