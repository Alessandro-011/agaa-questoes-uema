package br.uema.agaa_questoes.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Questao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numero_na_prova;
    private String area_conhecimento;
    private String disciplina;
    private String assunto;

    @Column(columnDefinition = "TEXT")
    private String enunciado;

    private String imagem_url;

    @Enumerated(EnumType.STRING)
    private Dificuldade dificuldade;

    @Enumerated(EnumType.STRING)
    private TipoQuestao tipo;

    @ManyToOne
    @JoinColumn(name = "prova_id")
    private Prova prova;

}
