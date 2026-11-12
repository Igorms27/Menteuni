package br.edu.uniceplac.menteuni.conteudo;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conteudos")
public class ConteudoController {
    private final ConteudoRepository conteudos;

    public ConteudoController(ConteudoRepository conteudos) { this.conteudos = conteudos; }

    @GetMapping
    public List<Conteudo> listar() {
        return conteudos.findAll(Sort.by("id"));
    }
}
