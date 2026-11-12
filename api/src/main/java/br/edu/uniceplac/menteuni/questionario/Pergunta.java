package br.edu.uniceplac.menteuni.questionario;

import jakarta.persistence.*;

@Entity
@Table(name = "perguntas")
public class Pergunta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "questionario_id")
    private Questionario questionario;
    @Column(nullable = false)
    private String texto;
    @Column(nullable = false)
    private int ordem;

    protected Pergunta() {}

    public Long getId() { return id; }
    public Questionario getQuestionario() { return questionario; }
    public String getTexto() { return texto; }
    public int getOrdem() { return ordem; }
}
