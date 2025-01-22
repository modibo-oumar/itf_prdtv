package com.lapredictive.backend.utilisateurs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class createUserDto {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Society field is required")
    private Long society;

    @NotBlank(message = "An email is required")
    private String email;

    @NotNull(message = "A password is required")
    private String password;

    @NotNull(message = "Please specify the role of the user")
    private Boolean isAdmin;
}
