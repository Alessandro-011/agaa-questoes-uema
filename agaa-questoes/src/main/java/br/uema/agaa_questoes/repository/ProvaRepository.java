package br.uema.agaa_questoes.repository;


import br.uema.agaa_questoes.model.Prova;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvaRepository extends JpaRepository <Prova,Long> {
}
