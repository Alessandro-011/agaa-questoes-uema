package br.uema.agaa_questoes.controller;

import br.uema.agaa_questoes.model.Prova;
import br.uema.agaa_questoes.repository.ProvaRepository;
import org.springframework.http.HttpStatus;
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
    public List<Prova> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Prova findById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prova", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Prova save(@RequestBody Prova prova) {
        prova.setId(null); // garante criacao
        return repository.save(prova);
    }

    @PutMapping("/{id}")
    public Prova update(@PathVariable Long id, @RequestBody Prova prova) {
        Prova existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prova", id));

        existente.setCodigo_prova(prova.getCodigo_prova());
        existente.setFase(prova.getFase());
        existente.setTipo(prova.getTipo());
        existente.setAno(prova.getAno());
        existente.setDia(prova.getDia());
        existente.setData_aplicacao(prova.getData_aplicacao());

        return repository.save(existente);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        try {
            repository.deleteById(id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Prova", id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new ConflictException("Não é possível excluir a prova porque existem questões vinculadas a ela.");
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    private static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String entity, Long id) {
            super(entity + " com id=" + id + " não encontrado.");
        }
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    private static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }

}