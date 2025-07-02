package com.example.ephemore.service;

import com.example.ephemore.dto.UserRegisterDTO;
import com.example.ephemore.dto.UserUpdateDTO;
import com.example.ephemore.dto.UserLoginDTO;
import com.example.ephemore.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.ephemore.repository.UserRepository;

import java.util.NoSuchElementException;

@Service
public class UserService {

    @Autowired
    UserRepository repository;

    @Autowired
    PasswordEncoder encoder;

    @Value("${jwt.secret}")
    private String secretKey;

    // CADASTRO
    public void registerUser(UserRegisterDTO userDTO) throws RuntimeException {
        User user = new User();
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com esse e-mail.");
        }

        String encodedPassword = encoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        repository.save(user);
    }

    // LOGIN
    public User postAuthUser(UserLoginDTO loginDTO) {
        User user = repository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!encoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Senha incorreta!");
        }

        return user;
    }

    public User getUser(Long id) {
        if (repository.findById(id).isPresent()) {
            return repository.findById(id).get();
        }

        throw new NoSuchElementException("Usuário nao encontrado");
    }

    public void deleteUser(Long id) throws RuntimeException {
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);
        }
        else throw new RuntimeException();
    }

    public User putUpdateUser(Long id, UserUpdateDTO userDTO) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }

        return repository.save(user);
    }
}
