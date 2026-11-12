package br.edu.uniceplac.menteuni.comum;

import org.springframework.security.core.context.SecurityContextHolder;

public final class UsuarioLogado {
    private UsuarioLogado() {}

    public static Long id() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
