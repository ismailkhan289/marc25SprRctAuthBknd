package com.springReactContactApp.web;

import org.springframework.util.StringUtils;
import com.springReactContactApp.model.Contact;
import com.springReactContactApp.model.ContactRepository;
import com.springReactContactApp.model.ContactService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.io.File;
import java.io.IOException;
import java.util.Optional;
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

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "uploads/";

    @GetMapping("/contacts")
    public ResponseEntity<?> getContactForCurrentUser(
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String userId = principal.getAttribute("sub");
            List<Contact> contacts = contactRepository.findByUserId(userId);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error fetching contacts for user");
        }
    }

    @GetMapping("/contact/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable UUID id) {
        UUID uuid = UUID.fromString(id.toString());
        return contactRepository.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/contact", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

    public ResponseEntity<?> createContact(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestPart("contact") @Valid Contact contact,
            @RequestPart(value = "photo", required = false) MultipartFile multipartFile) throws URISyntaxException {

        log.info("Received request: contact={}, photo={}", contact,
                multipartFile != null ? multipartFile.getOriginalFilename() : "No file");

        // System.out.println("Hello World");
        // return ResponseEntity.status(HttpStatus.CREATED).body("Contact created");
        if (principal != null) { // Check if the user is authenticated
            Map<String, Object> attributes = principal.getAttributes(); // Get user attributes
            String userID = attributes.get("sub").toString(); // Get user ID from attributes

            if (multipartFile != null && !multipartFile.isEmpty()) { // Check if a file is uploaded Handle file upload

                try {
                    String originalFilename = multipartFile.getOriginalFilename();
                    if (originalFilename == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Uploaded file must have a valid name");
                    }
                    String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(originalFilename); // Generate a
                                                                                                         // unique file
                                                                                                         // name
                    // unique file name
                    Path filePath = Paths.get(UPLOAD_DIR + File.separator + fileName); // Define the file path
                    Files.createDirectories(filePath.getParent()); // Create directories if they don't exist
                    Files.write(filePath, multipartFile.getBytes()); // Write the file to the server
                    contact.setPhotoUrl("/uploads/" + fileName); // Assuming you have a field for the photo path in your
                                                                 // Contact model
                } catch (IOException e) {
                    log.error("Error creating directories or writing file", e);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error saving contact photo");
                }
            }
            Contact newContact = contactService.saveContact(contact, userID);
            return ResponseEntity.ok(newContact);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated"); // User not authenticated
    }

    @PutMapping("/contact/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable UUID id, @Valid @RequestBody Contact contactDetails) {
        Contact updatedContact = contactRepository.save(contactDetails);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/contact/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable UUID id) {
        contactRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}