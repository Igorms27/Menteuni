package br.edu.uniceplac.menteuni.checkin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    List<Checkin> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId, Pageable pageable);
}
