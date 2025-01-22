package com.lapredictive.backend.societes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class createSocietyDto {

    private String name;
    private String email;
    private String contact;
}
