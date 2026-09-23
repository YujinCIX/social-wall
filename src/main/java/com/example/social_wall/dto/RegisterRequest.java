package com.example.social_wall.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "{validation.username.required}")
    @Size(
            min = 3,
            max = 50,
            message = "{validation.username.length}"
    )
    private String username;

    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.format}")
    @Size(
            max = 255,
            message = "{validation.email.tooLong}"
    )
    private String email;

    @NotBlank(message = "{validation.password.required}")
    @Size(
            min = 8,
            max = 100,
            message = "{validation.password.length}"
    )
    private String password;

    public RegisterRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}