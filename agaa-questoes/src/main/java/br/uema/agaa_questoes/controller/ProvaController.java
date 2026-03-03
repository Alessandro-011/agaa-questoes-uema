package br.uema.agaa_questoes.controller;


import br.uema.agaa_questoes.model.Prova;
import br.uema.agaa_questoes.model.Questao;
import br.uema.agaa_questoes.repository.ProvaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provas")
public class ProvaController {

    private final ProvaRepository repository;

    public ProvaController(ProvaRepository repository) {
        this.repository = repository;

    }


    @GetMapping
    public List<Prova> findAll(){
        return repository.findAll();

    }

    @PostMapping
    public Prova save(@RequestBody Prova prova){
        return repository.save(prova);

    }


}
