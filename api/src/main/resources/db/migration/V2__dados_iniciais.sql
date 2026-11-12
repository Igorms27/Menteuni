-- Questionários de bem-estar (escala: 0 Nunca, 1 Às vezes, 2 Frequentemente, 3 Quase sempre)
-- Instrumentos de autopercepção: NÃO substituem avaliação profissional.

INSERT INTO questionarios (id, titulo, descricao, ativo) VALUES
 (1, 'Estresse acadêmico', 'Como a rotina da faculdade tem afetado você nas últimas duas semanas.', TRUE),
 (2, 'Ansiedade no dia a dia', 'Perceba com que frequência alguns sinais de ansiedade aparecem para você.', TRUE),
 (3, 'Energia e motivação', 'Um olhar sobre seu ânimo e disposição recentes.', TRUE);

INSERT INTO perguntas (questionario_id, texto, ordem) VALUES
 (1, 'Me sinto sobrecarregado(a) com provas, trabalhos e prazos.', 1),
 (1, 'Tenho dificuldade de me concentrar nos estudos.', 2),
 (1, 'Sinto que não vou dar conta de tudo o que preciso fazer.', 3),
 (1, 'Fico irritado(a) com mais facilidade do que o normal.', 4),
 (1, 'Deixo de fazer coisas de que gosto por causa da faculdade.', 5),
 (1, 'Sinto tensão no corpo (ombros, mandíbula, dor de cabeça).', 6),

 (2, 'Me sinto nervoso(a) ou com os nervos à flor da pele.', 1),
 (2, 'Não consigo parar de me preocupar.', 2),
 (2, 'Tenho dificuldade para relaxar.', 3),
 (2, 'Fico tão agitado(a) que é difícil ficar parado(a).', 4),
 (2, 'Sinto medo de que algo ruim vá acontecer.', 5),
 (2, 'Minha preocupação atrapalha meu sono.', 6),

 (3, 'Sinto pouco interesse ou prazer em fazer as coisas.', 1),
 (3, 'Me sinto cansado(a) mesmo depois de descansar.', 2),
 (3, 'Tenho dificuldade de começar as tarefas do dia.', 3),
 (3, 'Me sinto desanimado(a) com o futuro.', 4),
 (3, 'Tenho evitado conversar com amigos ou família.', 5);

INSERT INTO conteudos (titulo, tipo, descricao, url) VALUES
 ('Respiração 4-7-8', 'DICA', 'Inspire pelo nariz contando até 4, segure o ar por 7 e solte pela boca devagar contando até 8. Repita 4 vezes. Ajuda a acalmar o corpo em momentos de tensão.', NULL),
 ('Técnica 5-4-3-2-1', 'DICA', 'Quando a ansiedade apertar, identifique 5 coisas que você vê, 4 que pode tocar, 3 que ouve, 2 que cheira e 1 que sente o gosto. Isso traz sua atenção de volta ao presente.', NULL),
 ('Pausas Pomodoro', 'DICA', 'Estude por 25 minutos e descanse 5. A cada 4 ciclos, faça uma pausa maior de 15 a 30 minutos. Seu cérebro rende mais com intervalos.', NULL),
 ('Higiene do sono', 'DICA', 'Tente dormir e acordar no mesmo horário, evite cafeína à noite e deixe o celular de lado 30 minutos antes de deitar.', NULL),
 ('Movimente-se', 'DICA', 'Uma caminhada de 20 minutos já ajuda a reduzir o estresse e melhora o humor. Não precisa ser academia: dançar no quarto também conta!', NULL),
 ('Escreva o que sente', 'DICA', 'Colocar os pensamentos no papel ajuda a organizar a mente. Tente anotar três coisas boas que aconteceram no seu dia.', NULL),
 ('Você não está sozinho(a)', 'ARTIGO', 'Pedir ajuda é um sinal de força. Converse com amigos, familiares ou procure o apoio psicológico da sua instituição.', NULL),
 ('CVV — Centro de Valorização da Vida', 'APOIO', 'Apoio emocional gratuito e sigiloso, 24 horas por dia, pelo telefone 188 ou pelo chat no site.', 'https://cvv.org.br');
