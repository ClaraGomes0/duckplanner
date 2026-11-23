package com.duckplanner.repository;

import com.duckplanner.model.SessaoEstudo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessaoEstudoRepository extends JpaRepository<SessaoEstudo, Long> {

    List<SessaoEstudo> findAllByOrderByIdAsc();
}
