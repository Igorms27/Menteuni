package br.edu.uniceplac.menteuni.conteudo;

import jakarta.persistence.*;

@Entity
@Table(name = "conteudos")
public class Conteudo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String titulo;
    @Column(nullable = false)
    private String tipo;
    private String descricao;
    private String url;

    protected Conteudo() {}

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getTipo() { return tipo; }
    public String getDescricao() { return descricao; }
    public String getUrl() { return url; }
}
