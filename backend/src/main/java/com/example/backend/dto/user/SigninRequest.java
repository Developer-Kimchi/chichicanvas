package com.example.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SigninRequest {

    private String userId;
    private String password;

}
