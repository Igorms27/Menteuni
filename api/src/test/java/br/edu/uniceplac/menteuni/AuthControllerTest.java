package br.edu.uniceplac.menteuni;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    @Autowired MockMvc mvc;

    @Test
    void cadastroLoginEPerfil() throws Exception {
        String cadastro = """
            {"nome":"Ana","email":"ana@uniceplac.edu.br","senha":"123456"}""";
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content(cadastro))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.token").isNotEmpty())
           .andExpect(jsonPath("$.usuario.nome").value("Ana"));

        // e-mail repetido
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content(cadastro))
           .andExpect(status().isConflict());

        // senha errada
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ana@uniceplac.edu.br\",\"senha\":\"errada\"}"))
           .andExpect(status().isUnauthorized())
           .andExpect(jsonPath("$.mensagem").value("E-mail ou senha incorretos."));

        String body = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ANA@uniceplac.edu.br\",\"senha\":\"123456\"}"))
           .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        String token = body.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.email").value("ana@uniceplac.edu.br"));

        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }
}
