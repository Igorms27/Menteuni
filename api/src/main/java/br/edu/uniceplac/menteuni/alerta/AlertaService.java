package br.edu.uniceplac.menteuni.alerta;

import org.springframework.stereotype.Service;

@Service
public class AlertaService {
    static final String APOIO = " Se precisar conversar, o CVV atende 24h pelo telefone 188, de graça.";

    private final AlertaRepository alertas;

    public AlertaService(AlertaRepository alertas) { this.alertas = alertas; }

    public void avaliarCheckin(Long usuarioId, int humor, int estresse, int ansiedade) {
        if (humor <= 2 && (estresse >= 4 || ansiedade >= 4)) {
            criar(usuarioId, "BEM_ESTAR",
                    "Hoje parece um dia difícil. Respire fundo e lembre-se: você não precisa passar por isso sozinho(a)." + APOIO);
        } else if (estresse >= 4) {
            criar(usuarioId, "ESTRESSE",
                    "Seu nível de estresse está alto. Que tal fazer uma pausa de 5 minutos e experimentar a respiração 4-7-8?");
        } else if (ansiedade >= 4) {
            criar(usuarioId, "ANSIEDADE",
                    "A ansiedade apareceu forte hoje. Tente a técnica 5-4-3-2-1 nas Dicas para voltar ao momento presente.");
        }
    }

    public void avaliarSono(Long usuarioId, double horas, int qualidade) {
        if (horas < 6) {
            criar(usuarioId, "SONO",
                    "Você dormiu menos de 6 horas. Tente desligar as telas 30 minutos antes de deitar hoje.");
        } else if (qualidade <= 2) {
            criar(usuarioId, "SONO",
                    "Sua noite não foi das melhores. Um ambiente escuro e silencioso ajuda a descansar melhor.");
        }
    }

    public void avaliarQuestionario(Long usuarioId, String titulo, int percentual) {
        if (percentual >= 67) {
            criar(usuarioId, "QUESTIONARIO",
                    "Seu resultado em \"" + titulo + "\" pede atenção. Conversar com alguém de confiança ou com um profissional pode ajudar." + APOIO);
        }
    }

    private void criar(Long usuarioId, String tipo, String mensagem) {
        // nao repete alerta se ainda tiver um nao lido
        if (alertas.existsByUsuarioIdAndTipoAndStatus(usuarioId, tipo, "NOVO")) return;
        alertas.save(new Alerta(usuarioId, tipo, mensagem));
    }
}
