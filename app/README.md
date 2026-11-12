# MenteUni - App

App feito em Ionic + Angular.

## Rodar em desenvolvimento

```bash
npm install
npm start
```

Abre em `http://localhost:4200`. A URL da API fica em `src/environments/environment.ts`.

## Estrutura

- `src/app/pages/`: telas do app
- `src/app/services/`: chamadas da API e login (JWT)
- `src/theme/variables.scss`: cores do app
- `android/`: projeto Android (Capacitor)

## Build Android

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```
