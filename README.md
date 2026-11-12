# MenteUni

Aplicativo de saúde mental para estudantes da UNICEPLAC, feito para a disciplina de Projeto Mobile.

## Equipe

- Igor Moreira de Sousa
- João Marques de Araújo Neto
- Wenderson da Silva Souza
- Victor Garcia Peres de Melo

## Sobre o projeto

O MenteUni é um aplicativo mobile voltado à saúde mental de estudantes universitários. A proposta é oferecer recursos que auxiliem os estudantes a acompanhar seu bem-estar emocional, reconhecer situações de estresse e ansiedade relacionadas à rotina acadêmica e desenvolver hábitos de autocuidado.

O projeto busca incentivar a conscientização sobre saúde mental no ambiente universitário e facilitar o acesso a informações e recursos de apoio.

## Objetivos

- Incentivar o cuidado com a saúde mental durante a vida acadêmica.
- Permitir o registro e o acompanhamento do bem-estar emocional.
- Disponibilizar informações e recursos relacionados ao autocuidado.
- Contribuir para a conscientização sobre estresse e ansiedade no contexto universitário.

## Arquitetura

O projeto é dividido em três partes: app, API e banco de dados.

| Camada | Pasta | Tecnologias |
|---|---|---|
| Aplicativo mobile | [`app/`](app) | Ionic 8 + Angular 20 + TypeScript + Capacitor 7 (Android) |
| Back-end (API REST) | [`api/`](api) | Java 21 + Spring Boot 3.5 + Spring Security (JWT) + Spring Data JPA + Flyway + Swagger |
| Banco de dados | | MySQL 8 |

Também usamos Chart.js nos gráficos, Docker para rodar a API e Git/GitHub para versionamento.

## Como rodar localmente

### API
Requisitos: Java 21, Maven e um MySQL 8 rodando.

```bash
cd api
mvn spring-boot:run
```

A API sobe em `http://localhost:8080` e a documentação Swagger fica em `http://localhost:8080/swagger-ui.html`.

Variáveis de ambiente (todas opcionais em desenvolvimento):

| Variável | Descrição |
|---|---|
| `DB_URL` | URL JDBC do MySQL |
| `DB_USER` / `DB_PASSWORD` | Usuário e senha do banco |
| `JWT_SECRET` | Chave de assinatura do JWT (mín. 32 caracteres) |
| `CORS_ORIGINS` | Origens permitidas, separadas por vírgula |
| `PORT` | Porta HTTP (padrão 8080) |

### App
Requisitos: Node 20+.

```bash
cd app
npm install
npm start
```

Abre em `http://localhost:4200`.

## Build de produção (Android)

1. A URL da API de produção fica em `app/src/environments/environment.prod.ts`.
2. Coloque o `menteuni-release.jks` e o `keystore.properties` na pasta `app/android/` (esses arquivos não vão para o Git).
3. Gere o build:

```bash
cd app
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
./gradlew bundleRelease
```

O APK fica em `app/android/app/build/outputs/apk/release/` e o AAB em `app/android/app/build/outputs/bundle/release/`. O build de release usa R8 (`minifyEnabled` e `shrinkResources`). Os ícones e a splash screen foram gerados com o `@capacitor/assets`.

## Estrutura do projeto

```text
Menteuni/
├── .github/      # template de Pull Request
├── api/          # back-end (Spring Boot), com os testes da API em api/src/test
├── app/          # aplicativo (Ionic/Angular) e projeto Android
├── assets/       # imagens e recursos do projeto
├── docs/         # documentação e relatório de deploy
├── tests/        # testes de integração e de interface
├── render.yaml   # deploy da API no Render
└── README.md
```

## Fluxo de desenvolvimento

Usamos o Git Flow simplificado:

- `main`: versão de produção, só recebe código testado e aprovado.
- `develop`: branch de integração, criada a partir da `main`.
- `feature/...` e `docs/...`: branches de trabalho, criadas a partir da `develop`.

Toda mudança entra por Pull Request e precisa da aprovação de pelo menos 1 outro membro do grupo.

## Distribuição

O app é distribuído para os testadores pelo Firebase App Distribution.
