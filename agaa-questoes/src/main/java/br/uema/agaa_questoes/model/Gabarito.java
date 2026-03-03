package br.uema.agaa_questoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Gabarito {

    @Id
    private Long id;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "questao_id")
    private Questao questao;


    @OneToOne
    @JoinColumn(name = "alternativa_id")
    private Alternativa alternativaCorreta;

    @Column(columnDefinition = "TEXT")
    private String res_esperada;

    private String fonte_oficial;
}