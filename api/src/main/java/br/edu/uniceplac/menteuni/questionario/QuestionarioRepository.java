package br.edu.uniceplac.menteuni.questionario;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionarioRepository extends JpaRepository<Questionario, Long> {
    List<Questionario> findByAtivoTrueOrderById();
}
