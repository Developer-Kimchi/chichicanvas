package com.example.backend.security.jwt;

import com.example.backend.global.ErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        log.info("uri : {}", uri);

        if (uri.equals("/user/signin") ||
        uri.equals("/user/signup") ||
                uri.equals("/user/refresh")) {
            log.info("들어옴!!!!!!!!!!!!!!!!!!!!");
            filterChain.doFilter(request, response);
            return;
        }

        try {

            String accessToken = resolveToken(request);

            if (accessToken != null) {

                // 1. 토큰 유효성 검증
                if (!jwtTokenProvider.validateToken(accessToken)) {
                    sendError(response, HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다.");
                }

                // 2. userId 추출
                String userId = jwtTokenProvider.getSubject(accessToken);

                // 3. request에 저장
                request.setAttribute("userId", userId);

                filterChain.doFilter(request, response);
            }


        } catch (ExpiredJwtException e) {
            sendError(response, HttpStatus.UNAUTHORIZED, "TOKEN_EXPIRED", "토큰이 만료되었습니다.");
        } catch (Exception e) {
            sendError(response, HttpStatus.INTERNAL_SERVER_ERROR, "AUTH_ERROR", "인증 처리 중 오류 발생");
        }

    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if(bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    private void sendError(HttpServletResponse response,
                           HttpStatus status,
                           String code,
                           String message) throws IOException {

        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ErrorResponse errorResponse = new ErrorResponse(code, message);

        ObjectMapper objectMapper = new ObjectMapper();

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
