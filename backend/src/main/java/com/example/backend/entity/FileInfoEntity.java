package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "FILE_INFO")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FileInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fiSeq;

    @Column(name = "FI_ORIGINAL_NAME", length = 500)
    private String fiOriginalName;

    @Column(name = "FI_SERVER_NAME", length = 500)
    private String fiServerName;

    @Column(name = "FI_PATH", length = 500)
    private String fiPath;

    @Column(name = "FI_SIZE")
    private Long fiSize;

    @Column(name = "FI_CONTENT_TYPE", length = 100)
    private String fiContentType;

    @Column(name = "FI_REGDATE")
    private LocalDateTime fiRegdate;
}
