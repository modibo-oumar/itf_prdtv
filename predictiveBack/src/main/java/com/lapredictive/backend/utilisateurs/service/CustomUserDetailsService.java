package com.lapredictive.backend.utilisateurs.service;

import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lapredictive.backend.utilisateurs.UserRepository;
import com.lapredictive.backend.utilisateurs.Users;

import org.springframework.security.core.userdetails.User;


@Service
public class CustomUserDetailsService implements UserDetailsService{

    private UserRepository repository;

    public CustomUserDetailsService (UserRepository repository){
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Users> user = repository.findByEmail(email);
        if (user.isPresent()) {
            var userObj = user.get();
            return User.builder()
                    .username(userObj.getEmail())
                    .password(userObj.getPassword())
                    .roles(getRole(userObj))
                    .build();
        } else {
            throw new UsernameNotFoundException(email);
        }
    }

    private String getRole(Users userObj) {
        Boolean isAdmin = userObj.getIsAdmin();
        if(isAdmin){
            return "ADMIN";
        }
        else{
            return "USER";
        }
    }
}