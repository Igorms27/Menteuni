package br.edu.uniceplac.menteuni.auth;

import br.edu.uniceplac.menteuni.auth.AuthDtos.*;
import br.edu.uniceplac.menteuni.comum.RegraNegocioException;
import br.edu.uniceplac.menteuni.usuario.Usuario;
import br.edu.uniceplac.menteuni.usuario.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UsuarioRepository usuarios, PasswordEncoder encoder, JwtService jwt) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse cadastrar(@Valid @RequestBody CadastroRequest req) {
        String email = req.email().trim().toLowerCase();
        if (usuarios.existsByEmailIgnoreCase(email)) {
            throw new RegraNegocioException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");
        }
        Usuario u = usuarios.save(new Usuario(req.nome().trim(), email, encoder.encode(req.senha())));
        return resposta(u);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        Usuario u = usuarios.findByEmailIgnoreCase(req.email().trim())
                .filter(x -> encoder.matches(req.senha(), x.getSenhaHash()))
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos."));
        return resposta(u);
    }

    @GetMapping("/me")
    public UsuarioResponse eu(@AuthenticationPrincipal Long usuarioId) {
        Usuario u = usuarios.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail());
    }

    public record AtualizarPerfilRequest(@jakarta.validation.constraints.NotBlank(message = "Informe seu nome.")
                                         @jakarta.validation.constraints.Size(max = 120) String nome) {}

    @PutMapping("/me")
    @org.springframework.transaction.annotation.Transactional
    public UsuarioResponse atualizar(@AuthenticationPrincipal Long usuarioId, @Valid @RequestBody AtualizarPerfilRequest req) {
        Usuario u = usuarios.findById(usuarioId)
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        u.setNome(req.nome().trim());
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail());
    }

    private AuthResponse resposta(Usuario u) {
        return new AuthResponse(jwt.gerar(u.getId()), new UsuarioResponse(u.getId(), u.getNome(), u.getEmail()));
    }
}
