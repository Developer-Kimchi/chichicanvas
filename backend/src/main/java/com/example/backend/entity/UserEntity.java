package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USERS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "USERNAME", length = 500, unique = true, nullable = false)
    private String username;

    @Column(name = "USER_PASSWORD", length = 500, nullable = false)
    private String password;

    @Column(name = "USER_NICKNAME", length = 100, unique = true, nullable = false)
    private String userNickname;

    @Column(name = "USER_PROFILE_PICTURE", length = 500)
    private String userProfilePicture;

    @Column(name = "USER_REGDATE")
    private LocalDateTime userRegdate;

    @ManyToOne
    @JoinColumn(name = "FI_SEQ")
    private FileInfoEntity fileInfo;

    @PrePersist
    public void prePersist() {
        if (userRegdate == null) {
            userRegdate = LocalDateTime.now();
        }
    }

}
