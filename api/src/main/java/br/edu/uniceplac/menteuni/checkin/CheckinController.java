package br.edu.uniceplac.menteuni.checkin;

import br.edu.uniceplac.menteuni.alerta.AlertaService;
import br.edu.uniceplac.menteuni.comum.UsuarioLogado;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckinController {
    private final CheckinRepository checkins;
    private final AlertaService alertas;

    public CheckinController(CheckinRepository checkins, AlertaService alertas) {
        this.checkins = checkins;
        this.alertas = alertas;
    }

    public record CheckinRequest(
            @Min(1) @Max(5) int humor,
            @Min(1) @Max(5) int estresse,
            @Min(1) @Max(5) int ansiedade,
            @Size(max = 500) String observacao) {}

    public record CheckinResponse(Long id, int humor, int estresse, int ansiedade, String observacao, Instant criadoEm) {
        static CheckinResponse de(Checkin c) {
            return new CheckinResponse(c.getId(), c.getHumor(), c.getEstresse(), c.getAnsiedade(), c.getObservacao(), c.getCriadoEm());
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public CheckinResponse registrar(@Valid @RequestBody CheckinRequest req) {
        Long uid = UsuarioLogado.id();
        String obs = req.observacao() == null || req.observacao().isBlank() ? null : req.observacao().trim();
        Checkin c = checkins.save(new Checkin(uid, req.humor(), req.estresse(), req.ansiedade(), obs));
        alertas.avaliarCheckin(uid, req.humor(), req.estresse(), req.ansiedade());
        return CheckinResponse.de(c);
    }

    @GetMapping
    public List<CheckinResponse> listar(@RequestParam(defaultValue = "30") int limite) {
        return checkins.findByUsuarioIdOrderByCriadoEmDesc(UsuarioLogado.id(), PageRequest.of(0, Math.min(limite, 100)))
                .stream().map(CheckinResponse::de).toList();
    }
}
