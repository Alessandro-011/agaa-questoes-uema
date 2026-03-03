package br.uema.agaa_questoes.controller;

import br.uema.agaa_questoes.model.Questao;
import br.uema.agaa_questoes.repository.QuestaoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questoes")
public class QuestaoController {

    private final QuestaoRepository repository;

    public QuestaoController(QuestaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Questao> findAll(){
        return repository.findAll();
    }

    @PostMapping
    public Questao save(@RequestBody Questao questao){
        return repository.save(questao);
    }

}
