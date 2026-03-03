package br.uema.agaa_questoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Alternativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1)
    private String letra;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;

    @ManyToOne
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;
}