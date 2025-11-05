package com.discordclone.lingo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.discordclone.lingo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
