package br.edu.uniceplac.menteuni.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record CadastroRequest(
            @NotBlank(message = "Informe seu nome.") @Size(max = 120) String nome,
            @NotBlank(message = "Informe seu e-mail.") @Email(message = "E-mail inválido.") String email,
            @NotBlank @Size(min = 6, message = "A senha precisa ter pelo menos 6 caracteres.") String senha) {}

    public record LoginRequest(
            @NotBlank(message = "Informe seu e-mail.") String email,
            @NotBlank(message = "Informe sua senha.") String senha) {}

    public record UsuarioResponse(Long id, String nome, String email) {}

    public record AuthResponse(String token, UsuarioResponse usuario) {}
}
