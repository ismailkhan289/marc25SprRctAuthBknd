package com.springReactContactApp.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {

    Contact findByName(String name);

    List<Contact> findByUserId(String id);
}
// Compare this snippet from
// src/main/java/com/springReactContactApp/model/ContactRepository.java: