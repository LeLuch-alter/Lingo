package com.discordclone.lingo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.discordclone.lingo.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
