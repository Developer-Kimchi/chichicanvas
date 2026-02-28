package com.example.backend.repository;

import com.example.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<UserEntity, Long> {
}
