package br.edu.uniceplac.menteuni.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey chave;
    private final Duration validade;

    public JwtService(@Value("${menteuni.jwt.secret}") String secret,
                      @Value("${menteuni.jwt.expiracao-horas}") long horas) {
        this.chave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validade = Duration.ofHours(horas);
    }

    public String gerar(Long usuarioId) {
        Instant agora = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(usuarioId))
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(validade)))
                .signWith(chave)
                .compact();
    }

    public Long validar(String token) {
        String sub = Jwts.parser().verifyWith(chave).build()
                .parseSignedClaims(token).getPayload().getSubject();
        return Long.valueOf(sub);
    }
}
