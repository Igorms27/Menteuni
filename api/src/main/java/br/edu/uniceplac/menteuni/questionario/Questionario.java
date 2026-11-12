package br.edu.uniceplac.menteuni.questionario;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questionarios")
public class Questionario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String titulo;
    private String descricao;
    @Column(nullable = false)
    private boolean ativo = true;

    @OneToMany(mappedBy = "questionario")
    @OrderBy("ordem")
    private List<Pergunta> perguntas = new ArrayList<>();

    protected Questionario() {}

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public boolean isAtivo() { return ativo; }
    public List<Pergunta> getPerguntas() { return perguntas; }
}
