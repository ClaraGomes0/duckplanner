package com.duckplanner.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DisciplinaDTO(
        Long id,
        @NotBlank(message = "Informe o nome da matéria") String nome,
        @NotNull(message = "Informe a dificuldade")
        @Min(value = 1, message = "Dificuldade mínima é 1")
        @Max(value = 5, message = "Dificuldade máxima é 5") Integer dificuldade,
        String area) {
}
