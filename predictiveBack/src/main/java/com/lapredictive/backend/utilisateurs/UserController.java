package com.lapredictive.backend.utilisateurs;

import org.springframework.web.bind.annotation.RestController;

import com.lapredictive.backend.utilisateurs.dto.createUserDto;
import com.lapredictive.backend.utilisateurs.dto.updateUserDto;
import com.lapredictive.backend.utilisateurs.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
public class UserController {

    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/utilisateurs")
    public List<Users> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/utilisateur/{email}")
    public Users getMethodName(@PathVariable String email) {
        return userService.getUser(email);
    }

    @PostMapping("/admin/utilisateur/creer")
    public Users createUser(@RequestBody createUserDto userDto) {
        return userService.createUser(userDto);
    }

    @PutMapping("/admin/utilisateur/{id}")
    public Users putMethodName(@PathVariable Long id, @RequestBody updateUserDto newUser) {
        
        return userService.updateUser(id,newUser);
    }

    @DeleteMapping("/admin/utilisateur/{id}")
    public void deleteUserById(@PathVariable Long id){
        userService.deleteUserById(id);
    }
}
