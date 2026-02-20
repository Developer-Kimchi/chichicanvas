package com.example.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupDupCheckRequest {

    private String username;
    private String nickname;

}
