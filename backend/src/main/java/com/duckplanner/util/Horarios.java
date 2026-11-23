package com.duckplanner.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public final class Horarios {

    private static final DateTimeFormatter FORMATO = DateTimeFormatter.ofPattern("HH:mm");

    private Horarios() {
    }

    // Converte "08:00" em LocalTime
    public static LocalTime ler(String texto) {
        try {
            return LocalTime.parse(texto.trim());
        } catch (DateTimeParseException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Horário inválido: " + texto + " (use HH:mm)");
        }
    }

    // Converte LocalTime em "08:00"
    public static String escrever(LocalTime hora) {
        return hora.format(FORMATO);
    }
}
