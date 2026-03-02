package br.uema.agaa_questoes.controller;


import br.uema.agaa_questoes.model.Prova;
import br.uema.agaa_questoes.repository.ProvaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
