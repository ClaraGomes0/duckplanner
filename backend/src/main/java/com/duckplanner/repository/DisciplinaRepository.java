package com.duckplanner.repository;

import com.duckplanner.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    boolean existsByNameIgnoreCase(String name);
}
