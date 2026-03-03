package br.uema.agaa_questoes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @Size(max = 2048, message = "A URL da imagem deve ter no máximo 2048 caracteres")
    @Pattern(
            regexp = "^(https?://).+",
            message = "A URL da imagem deve começar com http:// ou https://"
    )
    @Column(length = 2048)
    private String imagem_url;

    @Enumerated(EnumType.STRING)
    private Dificuldade dificuldade;

    @Enumerated(EnumType.STRING)
    private TipoQuestao tipo;

    @ManyToOne
    @JoinColumn(name = "prova_id")
    private Prova prova;

    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Alternativa> alternativas = new java.util.ArrayList<>();

    public void addAlternativa(Alternativa alternativa) {
        alternativas.add(alternativa);
        alternativa.setQuestao(this);
    }

   
    @OneToOne(mappedBy = "questao", cascade = CascadeType.ALL)
    private Gabarito gabarito;
}