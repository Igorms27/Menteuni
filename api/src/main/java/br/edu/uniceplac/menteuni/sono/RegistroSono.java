package br.edu.uniceplac.menteuni.sono;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "registros_sono")
public class RegistroSono {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "horas_sono", nullable = false, precision = 4, scale = 1)
    private BigDecimal horasSono;
    @Column(nullable = false)
    private int qualidade;
    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;
    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    protected RegistroSono() {}

    public RegistroSono(Long usuarioId, BigDecimal horasSono, int qualidade, LocalDate dataRegistro) {
        this.usuarioId = usuarioId;
        this.horasSono = horasSono;
        this.qualidade = qualidade;
        this.dataRegistro = dataRegistro;
    }

    public Long getId() { return id; }
    public BigDecimal getHorasSono() { return horasSono; }
    public int getQualidade() { return qualidade; }
    public LocalDate getDataRegistro() { return dataRegistro; }
}
