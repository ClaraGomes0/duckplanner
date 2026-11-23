package com.duckplanner.controller;

import com.duckplanner.dto.DisciplinaDTO;
import com.duckplanner.model.Disciplina;
import com.duckplanner.repository.DisciplinaRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository repository;

    public DisciplinaController(DisciplinaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DisciplinaDTO> listar() {
        return repository.findAll(Sort.by("id")).stream().map(this::paraDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DisciplinaDTO criar(@Valid @RequestBody DisciplinaDTO dto) {
        String nome = dto.nome().trim();

        if (repository.existsByNameIgnoreCase(nome)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Essa matéria já foi cadastrada");
        }

        Disciplina disciplina = new Disciplina();
        disciplina.setName(nome);
        disciplina.setDifficulty(dto.dificuldade());
        if (dto.area() != null && !dto.area().isBlank()) {
            disciplina.setArea(dto.area().trim());
        }

        return paraDto(repository.save(disciplina));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Matéria não encontrada");
        }
        repository.deleteById(id);
    }

    private DisciplinaDTO paraDto(Disciplina d) {
        return new DisciplinaDTO(d.getId(), d.getName(), d.getDifficulty(), d.getArea());
    }
}
