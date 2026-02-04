package com.example.backend.global;

import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 잘못된 요청 (비즈니스 로직 오류)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {

        log.error("[IllegalArgumentException] {}", e.getMessage());

        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.of("INVALID_REQUEST",
                        e.getMessage()));

    }

    /**
     * 인증 / 인가 관련 오류 (JWT, 권한 등)
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErrorResponse> handleSecurity(SecurityException e) {

        log.error("[SecurityException] {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(
                        "UNAUTHORIZED",
                        e.getMessage()
                ));
    }

    /**
     * JWT 관련 오류
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwt(JwtException e) {

        log.error("[JwtException] {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(
                        "UNAUTHORIZED",
                        e.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {

        log.error("[Exception]", e);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(
                        "INTERNAL_SERVER_ERROR",
                        "서버 오류가 발생했습니다"
                ));

    }

}
