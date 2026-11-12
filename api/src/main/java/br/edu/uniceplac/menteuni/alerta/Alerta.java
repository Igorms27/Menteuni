package br.edu.uniceplac.menteuni.alerta;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "alertas")
public class Alerta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(nullable = false)
    private String tipo;
    @Column(nullable = false)
    private String mensagem;
    @Column(nullable = false)
    private String status = "NOVO";
    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    protected Alerta() {}

    public Alerta(Long usuarioId, String tipo, String mensagem) {
        this.usuarioId = usuarioId;
        this.tipo = tipo;
        this.mensagem = mensagem;
    }

    public void marcarLido() { this.status = "LIDO"; }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getTipo() { return tipo; }
    public String getMensagem() { return mensagem; }
    public String getStatus() { return status; }
    public Instant getCriadoEm() { return criadoEm; }
}
