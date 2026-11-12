package br.edu.uniceplac.menteuni.comum;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StatusController {

    @GetMapping("/")
    public Map<String, String> status() {
        return Map.of(
                "aplicacao", "MenteUni API",
                "status", "online",
                "documentacao", "/swagger-ui.html");
    }
}
