package com.duckplanner.controller;

import com.duckplanner.dto.DisponibilidadeDTO;
import com.duckplanner.model.Disponibilidade;
import com.duckplanner.repository.DisponibilidadeRepository;
import com.duckplanner.util.Horarios;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades")
public class DisponibilidadeController {

    private final DisponibilidadeRepository repository;

    public DisponibilidadeController(DisponibilidadeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DisponibilidadeDTO> listar() {
        return repository.findAll(Sort.by("id")).stream().map(this::paraDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DisponibilidadeDTO criar(@Valid @RequestBody DisponibilidadeDTO dto) {
        LocalTime inicio = Horarios.ler(dto.inicio());
        LocalTime fim = Horarios.ler(dto.fim());

        if (!fim.isAfter(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O horário de fim deve ser depois do início");
        }

        Disponibilidade disponibilidade = new Disponibilidade();
        disponibilidade.setDia(dto.dia().trim());
        disponibilidade.setHoraInicio(inicio);
        disponibilidade.setHoraFim(fim);

        return paraDto(repository.save(disponibilidade));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado");
        }
        repository.deleteById(id);
    }

    private DisponibilidadeDTO paraDto(Disponibilidade d) {
        return new DisponibilidadeDTO(d.getId(), d.getDia(),
                Horarios.escrever(d.getHoraInicio()), Horarios.escrever(d.getHoraFim()));
    }
}
