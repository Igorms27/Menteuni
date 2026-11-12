-- Esquema do MenteUni (conforme o Documento de Arquitetura)

CREATE TABLE usuarios (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL UNIQUE,
  senha_hash  VARCHAR(100) NOT NULL,
  tipo        VARCHAR(20)  NOT NULL DEFAULT 'ESTUDANTE',
  criado_em   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checkins (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  BIGINT   NOT NULL,
  humor       INT      NOT NULL,
  estresse    INT      NOT NULL,
  ansiedade   INT      NOT NULL,
  observacao  VARCHAR(500),
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_checkins_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE questionarios (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(150) NOT NULL,
  descricao   VARCHAR(500),
  ativo       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE perguntas (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  questionario_id  BIGINT       NOT NULL,
  texto            VARCHAR(300) NOT NULL,
  ordem            INT          NOT NULL,
  CONSTRAINT fk_perguntas_questionario FOREIGN KEY (questionario_id) REFERENCES questionarios(id)
);

CREATE TABLE respostas (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   BIGINT NOT NULL,
  pergunta_id  BIGINT NOT NULL,
  valor        INT    NOT NULL,
  criado_em    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_respostas_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
  CONSTRAINT fk_respostas_pergunta FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
);

CREATE TABLE registros_sono (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   BIGINT       NOT NULL,
  horas_sono   DECIMAL(4,1) NOT NULL,
  qualidade    INT          NOT NULL,
  data_registro DATE        NOT NULL,
  criado_em    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sono_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE conteudos (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo     VARCHAR(150) NOT NULL,
  tipo       VARCHAR(20)  NOT NULL,
  descricao  VARCHAR(1000),
  url        VARCHAR(300)
);

CREATE TABLE alertas (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  BIGINT       NOT NULL,
  tipo        VARCHAR(30)  NOT NULL,
  mensagem    VARCHAR(500) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'NOVO',
  criado_em   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alertas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
