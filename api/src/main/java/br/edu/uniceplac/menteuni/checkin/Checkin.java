package br.edu.uniceplac.menteuni.checkin;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "checkins")
public class Checkin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(nullable = false)
    private int humor;
    @Column(nullable = false)
    private int estresse;
    @Column(nullable = false)
    private int ansiedade;
    private String observacao;
    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    protected Checkin() {}

    public Checkin(Long usuarioId, int humor, int estresse, int ansiedade, String observacao) {
        this.usuarioId = usuarioId;
        this.humor = humor;
        this.estresse = estresse;
        this.ansiedade = ansiedade;
        this.observacao = observacao;
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public int getHumor() { return humor; }
    public int getEstresse() { return estresse; }
    public int getAnsiedade() { return ansiedade; }
    public String getObservacao() { return observacao; }
    public Instant getCriadoEm() { return criadoEm; }
}
