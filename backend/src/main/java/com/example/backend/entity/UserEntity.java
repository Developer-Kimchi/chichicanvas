package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
public class UserEntity {

    @Id
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "USER_PASSWORD", length = 500)
    private String password;

    @Column(name = "USER_NICKNAME", length = 100, unique = true)
    private String userNickname;

    @Column(name = "USER_PROFILE_PICTURE", length = 500)
    private String userProfilePicture;

    @Column(name = "USER_REGDATE")
    private LocalDateTime userRegdate;

    @ManyToOne
    @JoinColumn(name = "FI_SEQ")
    private FileInfoEntity fileInfo;

}
