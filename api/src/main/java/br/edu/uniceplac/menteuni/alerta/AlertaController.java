package br.edu.uniceplac.menteuni.alerta;

import br.edu.uniceplac.menteuni.comum.RegraNegocioException;
import br.edu.uniceplac.menteuni.comum.UsuarioLogado;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {
    private final AlertaRepository alertas;

    public AlertaController(AlertaRepository alertas) { this.alertas = alertas; }

    public record AlertaResponse(Long id, String tipo, String mensagem, Instant criadoEm) {}

    @GetMapping
    public List<AlertaResponse> novos() {
        return alertas.findByUsuarioIdAndStatusOrderByCriadoEmDesc(UsuarioLogado.id(), "NOVO").stream()
                .map(a -> new AlertaResponse(a.getId(), a.getTipo(), a.getMensagem(), a.getCriadoEm()))
                .toList();
    }

    @PutMapping("/{id}/lido")
    @Transactional
    public void marcarLido(@PathVariable Long id) {
        alertas.findByIdAndUsuarioId(id, UsuarioLogado.id())
                .orElseThrow(() -> new RegraNegocioException(HttpStatus.NOT_FOUND, "Alerta não encontrado."))
                .marcarLido();
    }
}
