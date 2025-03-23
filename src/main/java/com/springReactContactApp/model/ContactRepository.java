package com.springReactContactApp.model;

import com.springReactContactApp.model.Contact;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    Optional<Contact> findById(UUID id);
}
