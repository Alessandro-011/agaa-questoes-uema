package br.uema.agaa_questoes.controller;

import br.uema.agaa_questoes.model.Alternativa;
import br.uema.agaa_questoes.model.Gabarito;
import br.uema.agaa_questoes.model.Questao;
import br.uema.agaa_questoes.repository.QuestaoRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questoes")
public class QuestaoController {

    private final QuestaoRepository repository;

    public QuestaoController(QuestaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Questao> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Questao findById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Questao save(@Valid @RequestBody Questao questao) {
        questao.setId(null);

        if (questao.getAlternativas() != null) {
            for (Alternativa a : questao.getAlternativas()) {
                a.setQuestao(questao);
            }
        }

        if (questao.getGabarito() != null) {
            questao.getGabarito().setQuestao(questao);
        }

        try {
            return repository.save(questao);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Já existe uma questão com esse número nessa prova (numero_na_prova duplicado).");
        }
    }

    @PutMapping("/{id}")
    public Questao update(@PathVariable Long id, @Valid @RequestBody Questao questao) {
        Questao existente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão", id));

        existente.setNumero_na_prova(questao.getNumero_na_prova());
        existente.setArea_conhecimento(questao.getArea_conhecimento());
        existente.setDisciplina(questao.getDisciplina());
        existente.setAssunto(questao.getAssunto());
        existente.setEnunciado(questao.getEnunciado());
        existente.setImagem_url(questao.getImagem_url());
        existente.setDificuldade(questao.getDificuldade());
        existente.setTipo(questao.getTipo());
        existente.setProva(questao.getProva());

        existente.getAlternativas().clear();
        if (questao.getAlternativas() != null) {
            for (Alternativa a : questao.getAlternativas()) {
                existente.addAlternativa(a);
            }
        }

        Gabarito g = questao.getGabarito();
        existente.setGabarito(g);
        if (g != null) {
            g.setQuestao(existente);
        }

        try {
            return repository.save(existente);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Já existe uma questão com esse número nessa prova (numero_na_prova duplicado).");
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        try {
            repository.deleteById(id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("Questão", id);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Não é possível excluir a questão por causa de vínculos no banco.");
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return errors;
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