package br.edu.uniceplac.menteuni.questionario;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "respostas")
public class Resposta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "pergunta_id", nullable = false)
    private Long perguntaId;
    @Column(nullable = false)
    private int valor;
    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    protected Resposta() {}

    public Resposta(Long usuarioId, Long perguntaId, int valor) {
        this.usuarioId = usuarioId;
        this.perguntaId = perguntaId;
        this.valor = valor;
    }
}
