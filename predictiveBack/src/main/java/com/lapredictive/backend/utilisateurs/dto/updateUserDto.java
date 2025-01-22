package com.lapredictive.backend.utilisateurs.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class updateUserDto {

    private String firstName;
    private String lastName;
    private Long society;
    private String email;
    private String password;
    private Boolean isAdmin;
}
