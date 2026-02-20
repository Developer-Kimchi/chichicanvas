package com.example.backend.controller;

import com.example.backend.dto.user.*;
import com.example.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")  // 프론트 주소 허용
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/check")
    public ResponseEntity<Void> check() {
        return ResponseEntity.ok().build();
    }


    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<Void> signin(@RequestBody SigninRequest signinRequest,
                                       HttpServletResponse response) {
        log.info("UserController signin ===============================");

        TokenDTO tokenDTO = userService.signIn(signinRequest);

        addCookie(response, "accessToken", tokenDTO.getAccessToken(), 60 * 60);
        addCookie(response, "refreshToken", tokenDTO.getRefreshToken(), 60 * 60 * 24 * 14);

        return ResponseEntity.ok().build();
    }

    // 계정생성
    @PostMapping("/signup")
    public boolean signup(@RequestBody SignupRequest signupRequest) {
        log.info("UserController signup ===============================");
        return userService.signUp(signupRequest);
    }

    // 아이디 중복여부 체크
    @PostMapping("/checkUserId")
    public boolean checkUserId(@RequestBody SignupDupCheckRequest signupDupCheckRequest) {
        log.info("UserController checkUserId ===============================");
        return userService.checkUserId(signupDupCheckRequest);
    }

    // 닉네임 중복여부 체크
    @PostMapping("/checkNickname")
    public boolean checkNickname(@RequestBody SignupDupCheckRequest signupDupCheckRequest) {
        log.info("UserController checkNickname ===============================");
        return userService.checkNickname(signupDupCheckRequest);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(HttpServletRequest request,
                                             HttpServletResponse response) {
        log.info("UserController refreshToken ===============================");
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return reissue(refreshToken, response);
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
