package com.lapredictive.backend.utilisateurs.service;

import com.lapredictive.backend.societes.SocietyRepository;
import com.lapredictive.backend.utilisateurs.UserRepository;
import com.lapredictive.backend.utilisateurs.Users;
import com.lapredictive.backend.utilisateurs.dto.createUserDto;
import com.lapredictive.backend.utilisateurs.dto.updateUserDto;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;
    private SocietyRepository societyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(SocietyRepository societyRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    public Users createUser(createUserDto userDto) {
        Users user = new Users();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setSociety(societyRepository.findById(userDto.getSociety()).orElse(null));
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setIsAdmin(userDto.getIsAdmin());
        userRepository.save(user);
        return user;
    }

    public Users getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Utilisateur non existant avec l'email:  " + email));
    }

    public Users getUserById(Long userId){
        return userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("Utilisateur non existant avec l'id:  " + userId));
    }

    public void deleteUserById(Long id){
        userRepository.deleteById(id);
    }

    public List<Users> getAllUsers(){
        return userRepository.findAll();
    }

    public Users updateUser(Long id, updateUserDto newUserDetails) {
        Optional<Users> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isPresent()) {
            Users existingUser = optionalUser.get();
            existingUser.setFirstName(newUserDetails.getFirstName());
            existingUser.setLastName(newUserDetails.getLastName());
            existingUser.setSociety(societyRepository.findById(newUserDetails.getSociety()).orElse(null));
            existingUser.setEmail(newUserDetails.getEmail());
            existingUser.setPassword(newUserDetails.getPassword());
            existingUser.setIsAdmin(newUserDetails.getIsAdmin());
            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id " + id);
        }
    }
}
