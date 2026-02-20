package com.example.backend.service;

import com.example.backend.dto.user.SignupDupCheckRequest;
import com.example.backend.security.jwt.JwtTokenProvider;
import com.example.backend.dto.user.TokenDTO;
import com.example.backend.dto.user.SigninRequest;
import com.example.backend.dto.user.SignupRequest;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate redisTemplate;

    // 1. 회원가입
    public boolean signUp(SignupRequest signupRequest) {

        log.info("UserService signUp ========================================");
        // 계정 생성
        UserEntity userEntity = UserEntity.builder()
                .username(signupRequest.getUsername())
                .userNickname(signupRequest.getNickname())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .build();

        userRepository.save(userEntity);

        return true;
    }

    // 2. 로그인
    @Transactional
    public TokenDTO signIn(SigninRequest signinRequest) {

        log.info("UserService refreshToken ===============================");

        UserEntity user = userRepository.findByUsername(signinRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저"));

        if (!passwordEncoder.matches(signinRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getUsername());
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

        jwtTokenProvider.validateToken(refreshToken);

        String userId = jwtTokenProvider.getSubject(refreshToken);

        String savedHash = (String) redisTemplate.opsForValue()
                .get("RT:" + userId);

        if (savedHash == null ||
        !savedHash.equals(DigestUtils.sha256Hex(refreshToken))) {
            throw new SecurityException("RefreshToken 불일치");
        }

        String newAccessToken = jwtTokenProvider.createAccessToken(userId);

        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        redisTemplate.opsForValue().set(
                "RT:" + userId,
                DigestUtils.sha256Hex(newRefreshToken),
                Duration.ofDays(14)
        );

        return newAccessToken;
    }

}
