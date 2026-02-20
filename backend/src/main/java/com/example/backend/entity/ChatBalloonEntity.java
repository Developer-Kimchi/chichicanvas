package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CHAT_BALLOON")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatBalloonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cbSeq;

    @Column(name = "CB_CONTNENT", nullable = true, length = 4000)
    private String cbContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHATROOM_SEQ")
    private ChatRoomEntity chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FI_SEQ")
    private FileInfoEntity fileInfo;

}
