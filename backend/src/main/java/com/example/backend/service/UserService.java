package com.example.backend.service;

import com.example.backend.security.jwt.JwtProvider;
import com.example.backend.dto.user.TokenDTO;
import com.example.backend.dto.user.SigninRequest;
import com.example.backend.dto.user.SignupRequest;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RedisTemplate redisTemplate;

    // 1. 회원가입
    public String signUp(SignupRequest signupRequest) {

        // 아이디 중복 체크
        boolean userExists = userRepository.existsById(signupRequest.getUsername());
        if (userExists) {
            return "USER_DUP";
        }

        // 닉네임 중복 체크
        boolean nicknameExists = userRepository.existsByUserNickname(signupRequest.getNickname());
        if (nicknameExists) {
            return "NICKNAME_DUP";
        }

        // 계정 생성
        UserEntity userEntity = UserEntity.builder()
                .userId(signupRequest.getUsername())
                .userNickname(signupRequest.getNickname())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .build();

        userRepository.save(userEntity);

        return "SUCCESS";
    }

    // 2. 로그인
    @Transactional
    public TokenDTO signIn(SigninRequest signinRequest) {

        UserEntity user = userRepository.findById(signinRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저"));

        if (!passwordEncoder.matches(signinRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호 불일치");
        }

        String accessToken = jwtProvider.createAccessToken(user.getUserId());
        String refreshToken = jwtProvider.createRefreshToken(user.getUserId());

        // refreshToken 해싱
        String refreshTokenHash = DigestUtils.sha256Hex(refreshToken);

        redisTemplate.opsForValue().set(
                "RT:" + user.getUserId(),
                refreshTokenHash,
                Duration.ofDays(14)
        );

        return new TokenDTO(accessToken, refreshToken);
    }

    public String reissue(String refreshToken) {

        jwtProvider.validateToken(refreshToken);

        String userId = jwtProvider.getSubject(refreshToken);

        String savedHash = (String) redisTemplate.opsForValue()
                .get("RT:" + userId);

        if (savedHash == null ||
        !savedHash.equals(DigestUtils.sha256Hex(refreshToken))) {
            throw new SecurityException("RefreshToken 불일치");
        }

        String newAccessToken = jwtProvider.createAccessToken(userId);

        String newRefreshToken = jwtProvider.createRefreshToken(userId);

        redisTemplate.opsForValue().set(
                "RT:" + userId,
                DigestUtils.sha256Hex(newRefreshToken),
                Duration.ofDays(14)
        );

        return newAccessToken;
    }

}
