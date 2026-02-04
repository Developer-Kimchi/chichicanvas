package com.example.backend.dto.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
public class SignupRequest {

    private String username;
    private String nickname;
    private String password;

}
