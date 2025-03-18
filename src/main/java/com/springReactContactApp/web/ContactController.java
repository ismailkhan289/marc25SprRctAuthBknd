package com.springReactContactApp.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springReactContactApp.model.ContactRepository;
import com.springReactContactApp.model.User;
import com.springReactContactApp.model.UserRepository;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.springReactContactApp.model.Contact;
import java.util.List;
import java.net.URISyntaxException;
import java.net.URI;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@NoArgsConstructor
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/contacts")
    public List<Contact> getContacts(@AuthenticationPrincipal OAuth2User principal) {
        return contactRepository.findByUserId(principal.getAttribute("sub"));
    }

    @PostMapping("/contacts")
    public ResponseEntity<Contact> addContact(@RequestBody Contact contact,
            @AuthenticationPrincipal OAuth2User principal) {
        log.info("Request to Create Contact: {}", contact);
        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();
        log.debug("User ID: {}", userId);

        Optional<User> user = userRepository.findById(userId);

        User userEntity = user.orElseGet(() -> {
            User newUser = new User();
            newUser.setId(userId);
            newUser.setName(details.get("name").toString());
            newUser.setEmail(details.get("email").toString());
            return userRepository.save(newUser);
        });

        contact.setUser(userEntity);
        Contact newContact = contactRepository.save(contact);
        try {
            return ResponseEntity.created(new URI("/api/contact/" + newContact.getId())).body(newContact);
        } catch (URISyntaxException e) {
            log.error("Invalid URI syntax: /api/contact/{}", newContact.getId(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/contacts/{id}")
    public void deleteContact(@PathVariable UUID id) {
        contactRepository.deleteById(id);
    }

}
