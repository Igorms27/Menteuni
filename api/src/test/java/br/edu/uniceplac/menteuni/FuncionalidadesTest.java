package br.edu.uniceplac.menteuni;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FuncionalidadesTest {
    @Autowired MockMvc mvc;
    String token;

    @BeforeEach
    void login() throws Exception {
        String email = "aluno" + System.nanoTime() + "@uniceplac.edu.br";
        String body = mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"Aluno\",\"email\":\"" + email + "\",\"senha\":\"123456\"}"))
                .andReturn().getResponse().getContentAsString();
        token = "Bearer " + body.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    @Test
    void checkinGeraAlertaQuandoEstresseAlto() throws Exception {
        mvc.perform(post("/api/checkins").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"humor\":3,\"estresse\":5,\"ansiedade\":2,\"observacao\":\"semana de provas\"}"))
                .andExpect(status().isCreated());
        mvc.perform(get("/api/checkins").header("Authorization", token))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].estresse").value(5));
        mvc.perform(get("/api/alertas").header("Authorization", token))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].tipo").value("ESTRESSE"));

        mvc.perform(post("/api/checkins").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"humor\":9,\"estresse\":1,\"ansiedade\":1}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sonoCurtoGeraAlerta() throws Exception {
        mvc.perform(post("/api/sono").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"horasSono\":5.5,\"qualidade\":3}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.horasSono").value(5.5));
        mvc.perform(post("/api/sono").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"horasSono\":4,\"qualidade\":3}"))
                .andExpect(status().isCreated());
        // não duplica alerta não lido
        mvc.perform(get("/api/alertas").header("Authorization", token))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].tipo").value("SONO"));
    }

    @Test
    void questionarioCalculaResultado() throws Exception {
        mvc.perform(get("/api/questionarios").header("Authorization", token))
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].totalPerguntas").value(6));
        String det = mvc.perform(get("/api/questionarios/1").header("Authorization", token))
                .andExpect(jsonPath("$.perguntas", hasSize(6)))
                .andReturn().getResponse().getContentAsString();
        var ids = java.util.regex.Pattern.compile("\"id\":(\\d+),\"texto\"").matcher(det).results()
                .map(m -> m.group(1)).toList();
        String respostas = ids.stream().map(i -> "\"" + i + "\":3").collect(java.util.stream.Collectors.joining(","));
        mvc.perform(post("/api/questionarios/1/respostas").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"respostas\":{" + respostas + "}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.percentual").value(100))
                .andExpect(jsonPath("$.nivel").value("Elevado"));
    }

    @Test
    void conteudosEPerfil() throws Exception {
        mvc.perform(get("/api/conteudos").header("Authorization", token))
                .andExpect(jsonPath("$", hasSize(8)));
        mvc.perform(put("/api/auth/me").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"Novo Nome\"}"))
                .andExpect(jsonPath("$.nome").value("Novo Nome"));
    }
}
