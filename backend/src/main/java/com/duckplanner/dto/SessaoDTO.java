package com.duckplanner.dto;

public record SessaoDTO(
        Long id,
        String dia,
        String materia,
        Integer dificuldade,
        String inicio,
        String fim,
        Boolean concluida) {
}
