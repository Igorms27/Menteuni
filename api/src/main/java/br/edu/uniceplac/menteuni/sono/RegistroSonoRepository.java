package br.edu.uniceplac.menteuni.sono;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistroSonoRepository extends JpaRepository<RegistroSono, Long> {
    List<RegistroSono> findByUsuarioIdOrderByDataRegistroDescIdDesc(Long usuarioId, Pageable pageable);
}
