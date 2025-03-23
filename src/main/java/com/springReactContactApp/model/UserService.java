package com.springReactContactApp.model;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveOrUpdatUser(String id, String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) { // check if the user already exists
            User user = existingUser.get();// get the existing user
            user.setName(name);
            return userRepository.save(user); // update the existing user
        } else {
            User newUser = new User(); // create a new user
            newUser.setId(id);
            newUser.setEmail(email);
            newUser.setName(name);
            return userRepository.save(newUser);// save the new user
        }
    }

}
