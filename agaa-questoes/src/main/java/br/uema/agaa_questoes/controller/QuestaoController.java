package br.uema.agaa_questoes.controller;

import br.uema.agaa_questoes.model.Questao;
import br.uema.agaa_questoes.repository.QuestaoRepository;
import jakarta.validation.Valid;
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

    @PostMapping
    public Questao save(@Valid @RequestBody Questao questao) {
        return repository.save(questao);
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
}
