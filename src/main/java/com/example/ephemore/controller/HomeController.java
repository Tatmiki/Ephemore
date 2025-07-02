package com.example.ephemore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.ephemore.dto.UserUpdateDTO;
import com.example.ephemore.model.User;
import com.example.ephemore.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class HomeController {

    private final UserService userService;

    HomeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/home")
    public String homePage(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null)
            return "redirect:/auth";

        model.addAttribute("user", user);

        if (!model.containsAttribute("userUpdateDTO")) {
            UserUpdateDTO dto = new UserUpdateDTO();
            dto.setName(user.getName());
            model.addAttribute("userUpdateDTO", dto);
        }

        return "match_page";
    }

    @PostMapping("/user/update")
    public String updateUserName(
            @ModelAttribute("userUpdateDTO") @Valid UserUpdateDTO dto,
            BindingResult result,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/auth";
        }

        // Validação do DTO
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.userUpdateDTO", result);
            redirectAttributes.addFlashAttribute("userUpdateDTO", dto);
            return "redirect:/home"; // Volta para a página com os erros
        }

        try {
            // Atualiza apenas o nome
            user.setName(dto.getName());
            userService.putUpdateUser(user.getId(), dto);

            // Atualiza a sessão
            session.setAttribute("user", user);
            redirectAttributes.addFlashAttribute("success", "Nome atualizado com sucesso!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao atualizar nome: " + e.getMessage());
        }

        return "redirect:/home";
    }

    // Método DELETE da conta
    @DeleteMapping("/user/delete")
    public String deleteUserAccount(
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/auth";
        }

        try {
            userService.deleteUser(user.getId());
            session.invalidate();
            redirectAttributes.addFlashAttribute("success", "Conta excluída com sucesso!");
            return "redirect:/auth";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao excluir conta: " + e.getMessage());
            return "redirect:/home";
        }
    }

}
