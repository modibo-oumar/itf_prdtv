package com.lapredictive.backend.mesures.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMesureDto {

    @NotNull(message = "Mesure Acoustique obligatoire")
    private Double acoustic;

    @NotNull(message = "Element est nécessaire")
    private Long element;
    
    @NotNull(message = "Mesure Vibratoire obligatoire")
    private Double vibratoire;

    @NotNull(message = "Temperature Maximale obligatoire")
    private Double temperatureMax;

    @NotNull(message = "Temperature de référence obligatoire")
    private Double temperatureRef;

    @NotNull(message = "Temperature Moyenne obligatoire")
    private Double temperatureMoy;
}
