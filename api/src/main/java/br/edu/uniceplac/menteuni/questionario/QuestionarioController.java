package br.edu.uniceplac.menteuni.questionario;

import br.edu.uniceplac.menteuni.alerta.AlertaService;
import br.edu.uniceplac.menteuni.comum.RegraNegocioException;
import br.edu.uniceplac.menteuni.comum.UsuarioLogado;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questionarios")
public class QuestionarioController {
    // escala: 0 nunca ate 3 quase sempre
    static final int VALOR_MAX = 3;

    private final QuestionarioRepository questionarios;
    private final RespostaRepository respostas;
    private final AlertaService alertas;

    public QuestionarioController(QuestionarioRepository questionarios, RespostaRepository respostas, AlertaService alertas) {
        this.questionarios = questionarios;
        this.respostas = respostas;
        this.alertas = alertas;
    }

    public record ResumoResponse(Long id, String titulo, String descricao, int totalPerguntas) {}
    public record PerguntaResponse(Long id, String texto, int ordem) {}
    public record DetalheResponse(Long id, String titulo, String descricao, List<PerguntaResponse> perguntas) {}
    public record RespostasRequest(@NotEmpty Map<Long, Integer> respostas) {}
    public record ResultadoResponse(int pontos, int maximo, int percentual, String nivel, String mensagem) {}

    @GetMapping
    @Transactional(readOnly = true)
    public List<ResumoResponse> listar() {
        return questionarios.findByAtivoTrueOrderById().stream()
                .map(q -> new ResumoResponse(q.getId(), q.getTitulo(), q.getDescricao(), q.getPerguntas().size()))
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public DetalheResponse detalhe(@PathVariable Long id) {
        Questionario q = buscar(id);
        return new DetalheResponse(q.getId(), q.getTitulo(), q.getDescricao(),
                q.getPerguntas().stream().map(p -> new PerguntaResponse(p.getId(), p.getTexto(), p.getOrdem())).toList());
    }

    @PostMapping("/{id}/respostas")
    @Transactional
    public ResultadoResponse responder(@PathVariable Long id, @Valid @RequestBody RespostasRequest req) {
        Questionario q = buscar(id);
        Set<Long> ids = q.getPerguntas().stream().map(Pergunta::getId).collect(Collectors.toSet());
        if (!req.respostas().keySet().equals(ids)) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Responda todas as perguntas.");
        }
        if (req.respostas().values().stream().anyMatch(v -> v == null || v < 0 || v > VALOR_MAX)) {
            throw new RegraNegocioException(HttpStatus.BAD_REQUEST, "Resposta inválida.");
        }

        Long uid = UsuarioLogado.id();
        req.respostas().forEach((perguntaId, valor) -> respostas.save(new Resposta(uid, perguntaId, valor)));

        int pontos = req.respostas().values().stream().mapToInt(Integer::intValue).sum();
        int maximo = ids.size() * VALOR_MAX;
        int percentual = Math.round(pontos * 100f / maximo);
        alertas.avaliarQuestionario(uid, q.getTitulo(), percentual);
        return resultado(pontos, maximo, percentual);
    }

    private static ResultadoResponse resultado(int pontos, int maximo, int percentual) {
        if (percentual < 34) {
            return new ResultadoResponse(pontos, maximo, percentual, "Leve",
                    "Você parece estar lidando bem com as coisas. Continue cuidando de você!");
        }
        if (percentual < 67) {
            return new ResultadoResponse(pontos, maximo, percentual, "Moderado",
                    "Alguns sinais merecem atenção. Pequenas pausas e as dicas do app podem ajudar no dia a dia.");
        }
        return new ResultadoResponse(pontos, maximo, percentual, "Elevado",
                "Seu resultado pede atenção. Conversar com alguém de confiança ou com um profissional pode fazer diferença. O CVV atende 24h pelo 188.");
    }

    private Questionario buscar(Long id) {
        return questionarios.findById(id).filter(Questionario::isAtivo)
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Questionário não encontrado."));
    }
}
