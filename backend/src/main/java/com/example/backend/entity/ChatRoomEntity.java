package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHATROOM")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ChatRoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatroomSeq;

    @Column(name = "CHATROOM_NAME", length = 500)
    private String chatroomName;

    @Column(name = "CHATROOM_CATEGORY", length = 100)
    private String chatroomCategory;

    @Column(name = "CHATROOM_HOST_ID", length = 100)
    private String chatroom_host_id;

    @Column(name = "CHATROOM_REGDATE")
    private LocalDateTime chatroomRegdate;

}
