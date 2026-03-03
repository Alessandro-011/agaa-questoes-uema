package br.uema.agaa_questoes.repository;

import br.uema.agaa_questoes.model.Questao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;

@Repository
public interface QuestaoRepository extends JpaRepository<Questao, Long> {
}

