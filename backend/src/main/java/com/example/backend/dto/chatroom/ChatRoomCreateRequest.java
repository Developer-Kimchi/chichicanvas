package com.example.backend.dto.chatroom;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomCreateRequest {

    private String name;
    private String category;

}
