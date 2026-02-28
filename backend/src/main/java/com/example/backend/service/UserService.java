package com.example.backend.service;

import com.example.backend.dto.user.*;
import com.example.backend.security.jwt.JwtTokenProvider;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate redisTemplate;

    public UserDTO me(String accessToken) {
        return jwtTokenProvider.getUserPayload(accessToken);
    }

    // 회원가입
    public boolean signup(SignupRequest signupRequest) {

        log.info("UserService signup ========================================");

        // 계정 생성
        UserEntity userEntity = UserEntity.builder()
                .username(signupRequest.getUsername())
                .userNickname(signupRequest.getNickname())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .build();

        userRepository.save(userEntity);

        return true;
    }
    // 로그인
    @Transactional
    public TokenDTO signin(SigninRequest signinRequest) {

        log.info("UserService refreshToken ===============================");

        UserEntity user = userRepository.findByUsername(signinRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저"));

        if (!passwordEncoder.matches(signinRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUsername());

        // refreshToken 해싱
        String refreshTokenHash = DigestUtils.sha256Hex(refreshToken);

        redisTemplate.opsForValue().set(
                "RT:" + user.getUserId(),
                refreshTokenHash,
                Duration.ofDays(14)
        );

        return new TokenDTO(accessToken, refreshToken);
    }

    // 아이디 중복 체크
    public boolean checkUserId(SignupDupCheckRequest signupDupCheckRequest) {
        log.info("UserService checkUserId ===============================");
        return userRepository.existsByUsername(signupDupCheckRequest.getUsername());
    }

    // 닉네임 중복 체크
    public boolean checkNickname(SignupDupCheckRequest signupDupCheckRequest) {
        log.info("UserService checkNickname ===============================");
        return userRepository.existsByUserNickname(signupDupCheckRequest.getNickname());
    }

    public String reissue(String refreshToken) {

        log.info("UserService reissue ===============================");

        // 리프레시 토큰 유효성 여부 검증
        jwtTokenProvider.validateToken(refreshToken);

        // 리프레시 토큰에서 유저 아이디 추출
        String userId = jwtTokenProvider.getSubject(refreshToken);

        // 레디스에서 리프레시 토큰 빼오기
        String savedHash = (String) redisTemplate.opsForValue()
                .get("RT:" + userId);

        // 프론트에서 받아온 리프레시 토큰과 레디스에 저장된 리프레시 토큰 일치 여부 확인
        if (savedHash == null ||
        !savedHash.equals(DigestUtils.sha256Hex(refreshToken))) {
            throw new SecurityException("RefreshToken 불일치");
        }

        UserEntity user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저"));

        // 엑세스 토큰 재발행
        String newAccessToken = jwtTokenProvider.createAccessToken(user);

        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        redisTemplate.opsForValue().set(
                "RT:" + userId,
                DigestUtils.sha256Hex(newRefreshToken),
                Duration.ofDays(14)
        );

        return newAccessToken;
    }

    public void signout(String refreshToken, HttpServletResponse response) {

        String username = jwtTokenProvider.getSubject(refreshToken);

        redisTemplate.delete("RT:" + username);

        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setMaxAge(0);
        accessTokenCookie.setPath("/");
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setMaxAge(0);
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);

    }

}
