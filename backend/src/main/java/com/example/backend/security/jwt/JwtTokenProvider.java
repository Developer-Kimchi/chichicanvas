package com.example.backend.security.jwt;

import com.example.backend.dto.user.UserDTO;
import com.example.backend.entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
    private final long accessTokenExp = 1000L * 60 * 60;
    private final long refreshTokenExp = 1000L * 60 * 60 * 24 * 7;

    public JwtTokenProvider() {
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // 엑세스 토큰 발급
    public String createAccessToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("nickname",user.getUserNickname())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExp))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 리프레시 토큰 발급
    public String createRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExp))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (ExpiredJwtException e) {

            log.error("JWT 만료", e);
            return false;

        } catch (JwtException e) {

            log.error("JWT 유효하지 않음", e);
            return false;

        }

    }

    public String getSubject(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public UserDTO getUserPayload(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        UserDTO userDTO = UserDTO.builder()
                .username(claims.getSubject())
                .userNickname(claims.get("nickname").toString())
                .build();

        return userDTO;
    }

}


