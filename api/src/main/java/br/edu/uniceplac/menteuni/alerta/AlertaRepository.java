package br.edu.uniceplac.menteuni.alerta;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByUsuarioIdAndStatusOrderByCriadoEmDesc(Long usuarioId, String status);
    boolean existsByUsuarioIdAndTipoAndStatus(Long usuarioId, String tipo, String status);
    Optional<Alerta> findByIdAndUsuarioId(Long id, Long usuarioId);
}
