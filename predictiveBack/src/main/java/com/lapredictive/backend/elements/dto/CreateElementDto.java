package com.lapredictive.backend.elements.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateElementDto {

    @NotBlank
    private String nom;

    private Long type;

    @NotNull
    private Long sousEquipementId;
}
