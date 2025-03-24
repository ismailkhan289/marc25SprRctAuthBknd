package com.springReactContactApp.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    // public Contact getContactByUserId(String userId) {
    // return contactRepository.findByUserId(userId);

    // }

    public Contact saveContact(Contact contact, String userId) {

        if (!userRepository.existsById(userId)) {
            User newUser = new User();
            newUser.setId(userId);
            userRepository.save(newUser);
            contact.setUser(newUser);
            return contactRepository.save(contact);
        }

        User user = userRepository.findById(userId).get();
        contact.setUser(user);
        return contactRepository.save(contact);
    }
}
