package com.duckplanner.controller;

import com.duckplanner.dto.SessaoDTO;
import com.duckplanner.model.Disciplina;
import com.duckplanner.model.SessaoEstudo;
import com.duckplanner.repository.DisciplinaRepository;
import com.duckplanner.repository.SessaoEstudoRepository;
import com.duckplanner.util.Horarios;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessoes")
public class SessaoEstudoController {

    private final SessaoEstudoRepository sessaoRepository;
    private final DisciplinaRepository disciplinaRepository;

    public SessaoEstudoController(SessaoEstudoRepository sessaoRepository,
                                  DisciplinaRepository disciplinaRepository) {
        this.sessaoRepository = sessaoRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    // Lista o cronograma salvo
    @GetMapping
    public List<SessaoDTO> listar() {
        return sessaoRepository.findAllByOrderByIdAsc().stream().map(this::paraDto).toList();
    }

    // Substitui o cronograma inteiro (usado quando o aluno clica em "Gerar cronograma")
    @PutMapping
    @Transactional
    public List<SessaoDTO> substituir(@RequestBody List<SessaoDTO> blocos) {
        Map<String, Disciplina> disciplinas = new HashMap<>();
        for (Disciplina d : disciplinaRepository.findAll()) {
            disciplinas.put(d.getName().toLowerCase(), d);
        }

        List<SessaoEstudo> novas = new ArrayList<>();
        for (SessaoDTO bloco : blocos) {
            if (bloco.materia() == null || bloco.dia() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada bloco precisa de dia e matéria");
            }

            Disciplina disciplina = disciplinas.get(bloco.materia().trim().toLowerCase());
            if (disciplina == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Matéria não cadastrada: " + bloco.materia());
            }

            SessaoEstudo sessao = new SessaoEstudo();
            sessao.setDiaSemana(bloco.dia().trim());
            sessao.setHoraInicio(Horarios.ler(bloco.inicio()));
            sessao.setHoraFim(Horarios.ler(bloco.fim()));
            sessao.setConcluida(Boolean.TRUE.equals(bloco.concluida()));
            sessao.setDisciplina(disciplina);
            novas.add(sessao);
        }

        sessaoRepository.deleteAllInBatch();
        return sessaoRepository.saveAll(novas).stream().map(this::paraDto).toList();
    }

    // Marca ou desmarca uma sessão como concluída
    @PatchMapping("/{id}/concluida")
    public SessaoDTO alternarConcluida(@PathVariable Long id) {
        SessaoEstudo sessao = sessaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sessão não encontrada"));
        sessao.setConcluida(!sessao.isConcluida());
        return paraDto(sessaoRepository.save(sessao));
    }

    // Apaga o cronograma
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void limpar() {
        sessaoRepository.deleteAllInBatch();
    }

    private SessaoDTO paraDto(SessaoEstudo s) {
        return new SessaoDTO(
                s.getId(),
                s.getDiaSemana(),
                s.getDisciplina().getName(),
                s.getDisciplina().getDifficulty(),
                Horarios.escrever(s.getHoraInicio()),
                Horarios.escrever(s.getHoraFim()),
                s.isConcluida());
    }
}
