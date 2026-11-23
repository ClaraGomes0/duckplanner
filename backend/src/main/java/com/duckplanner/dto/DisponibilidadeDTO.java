package com.duckplanner.dto;

import jakarta.validation.constraints.NotBlank;

public record DisponibilidadeDTO(
        Long id,
        @NotBlank(message = "Informe o dia") String dia,
        @NotBlank(message = "Informe o horário de início") String inicio,
        @NotBlank(message = "Informe o horário de fim") String fim) {
}
