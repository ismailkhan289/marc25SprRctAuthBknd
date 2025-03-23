package com.springReactContactApp.web;

import com.springReactContactApp.model.Contact;
import com.springReactContactApp.model.ContactRepository;
import com.springReactContactApp.model.ContactService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final Logger log = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactService contactService;

    @GetMapping("/contacts")
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @GetMapping("contact/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        UUID uuid = UUID.fromString(id.toString());
        return contactRepository.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/contact")
    public ResponseEntity<?> createContact(@AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody Contact contact) throws URISyntaxException {

        // System.out.println("Hello World");
        // return ResponseEntity.status(HttpStatus.CREATED).body("Contact created");
        if (principal != null) {

            Map<String, Object> attributes = principal.getAttributes();
            String userID = attributes.get("sub").toString();
            Contact newContact = contactService.saveContact(contact, userID);
            return ResponseEntity.ok(newContact);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    // @PutMapping("/{id}")
    // @PreAuthorize("hasAuthority('update:contacts')")
    // public ResponseEntity<Contact> updateContact(@PathVariable UUID id,
    // @RequestBody Contact contactDetails) {
    // Contact updatedContact = ContactRepository.save(id, contactDetails);
    // return ResponseEntity.ok(updatedContact);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable UUID id) {
        contactRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}