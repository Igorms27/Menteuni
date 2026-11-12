package br.edu.uniceplac.menteuni.sono;

import br.edu.uniceplac.menteuni.alerta.AlertaService;
import br.edu.uniceplac.menteuni.comum.UsuarioLogado;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sono")
public class SonoController {
    private final RegistroSonoRepository registros;
    private final AlertaService alertas;

    public SonoController(RegistroSonoRepository registros, AlertaService alertas) {
        this.registros = registros;
        this.alertas = alertas;
    }

    public record SonoRequest(
            @DecimalMin("0.0") @DecimalMax("24.0") double horasSono,
            @Min(1) @Max(5) int qualidade,
            @PastOrPresent LocalDate data) {}

    public record SonoResponse(Long id, double horasSono, int qualidade, LocalDate data) {
        static SonoResponse de(RegistroSono r) {
            return new SonoResponse(r.getId(), r.getHorasSono().doubleValue(), r.getQualidade(), r.getDataRegistro());
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public SonoResponse registrar(@Valid @RequestBody SonoRequest req) {
        Long uid = UsuarioLogado.id();
        BigDecimal horas = BigDecimal.valueOf(req.horasSono()).setScale(1, RoundingMode.HALF_UP);
        LocalDate data = req.data() != null ? req.data() : LocalDate.now();
        RegistroSono r = registros.save(new RegistroSono(uid, horas, req.qualidade(), data));
        alertas.avaliarSono(uid, req.horasSono(), req.qualidade());
        return SonoResponse.de(r);
    }

    @GetMapping
    public List<SonoResponse> listar(@RequestParam(defaultValue = "30") int limite) {
        return registros.findByUsuarioIdOrderByDataRegistroDescIdDesc(UsuarioLogado.id(), PageRequest.of(0, Math.min(limite, 100)))
                .stream().map(SonoResponse::de).toList();
    }
}
