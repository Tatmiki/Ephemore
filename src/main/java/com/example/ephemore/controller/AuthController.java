package com.example.ephemore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.ephemore.dto.UserRegisterDTO;
import com.example.ephemore.model.User;
import com.example.ephemore.dto.UserLoginDTO;
import com.example.ephemore.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class AuthController {

    @Autowired
    UserService userService;

    @GetMapping("/auth")
    public String getAuth(Model model,
            @RequestParam(value = "success", required = false) String success) {

        model.addAttribute("userLoginDTO", new UserLoginDTO());
        model.addAttribute("userRegisterDTO", new UserRegisterDTO());

        if (success != null) {
            model.addAttribute("success", "Registro realizado com sucesso! Faça login.");
            model.addAttribute("showLoginForm", true);
        }

        return "auth_page";
    }

    @PostMapping("/auth/register")
    public String userPOST(@ModelAttribute("userRegisterDTO") @Valid UserRegisterDTO dto,
            BindingResult result, Model model) {

        model.addAttribute("userLoginDTO", new UserLoginDTO());

        if (result.hasErrors()) {
            model.addAttribute("registerErrors", result.getAllErrors());
            model.addAttribute("showRegisterForm", true);
            return "auth_page";
        }

        try {
            userService.registerUser(dto);
            return "redirect:/auth?success";
        } catch (RuntimeException e) {
            model.addAttribute("registerError", e.getMessage());
            model.addAttribute("showRegisterForm", true);
            return "auth_page";
        }
    }

    @PostMapping("auth/login")
    public String userLoginPost(@ModelAttribute("userLoginDTO") @Valid UserLoginDTO loginDTO,
            BindingResult result, HttpSession session, Model model) {

        model.addAttribute("userRegisterDTO", new UserRegisterDTO());

        if (result.hasErrors()) {
            return "auth_page";
        }

        try {
            User user = userService.postAuthUser(loginDTO);
            session.setAttribute("user", user);
            return "redirect:/home";
        } catch (RuntimeException e) {
            model.addAttribute("loginError", e.getMessage());
            return "auth_page";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth?logout";
    }

}
