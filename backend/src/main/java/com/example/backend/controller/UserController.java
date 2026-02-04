package com.example.backend.controller;

import com.example.backend.dto.user.SigninRequest;
import com.example.backend.dto.user.SignupRequest;
import com.example.backend.dto.user.TokenDTO;
import com.example.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<Void> signin(@RequestBody SigninRequest signinRequest,
                                       HttpServletResponse response) {

        TokenDTO tokenDTO = userService.signIn(signinRequest);

        addCookie(response, "accessToken", tokenDTO.getAccessToken(), 60 * 60);
        addCookie(response, "refreshToken", tokenDTO.getRefreshToken(), 60 * 60 * 24 * 14);

        return ResponseEntity.ok().build();
    }

    // 계정생성
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest signupRequest) {
        return userService.signUp(signupRequest);
    }

    public ResponseEntity<Void> reissue(@CookieValue("refreshToken") String refreshToken,
                                        HttpServletResponse response) {

        String newAccessToken = userService.reissue(refreshToken);

        addCookie(response, "accessToken", newAccessToken, 60 * 60);

        return ResponseEntity.ok().build();
    }


    private void addCookie(HttpServletResponse response,
                           String name, String value, int maxAge) {

        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);

        response.addCookie(cookie);

    }

}
