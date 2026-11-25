# Pasapalabra · El Rosco

Aplicación web *mobile-first* de la prueba final de Pasapalabra para dos jugadores locales (**Topo** y **Bego**), pensada para que el presentador la maneje con una mano desde el móvil.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite desde el móvil (o con `npm run dev -- --host` para acceder desde otro dispositivo de la misma red).

## Stack

React 19 + TypeScript + Vite, **Tailwind CSS v4** (vía PostCSS) y **react-router-dom**, siguiendo la estructura del proyecto de referencia.

## Arquitectura (hexagonal, igual que el proyecto de referencia)

```
src/
├── domain/
│   ├── model/GameModel.ts           Tipos del juego y constantes (letras, ajustes por defecto)
│   ├── ports/                        StoragePort, GameRepositoryPort, QuestionRepositoryPort
│   └── services/RoscoRules.ts        Reglas puras: siguiente letra pendiente, cambio de turno, tiempo
├── application/usecases/             CreateGame, StartTurn, Answer, Tick, GetGameResult
└── infrastructure/
    ├── adapters/
    │   ├── data/gameData.json        Jugadores y 50 preguntas (25 + 25)
    │   ├── data/JsonQuestionRepository.ts
    │   └── storage/                  StorageAdapter (localStorage) + LocalStorageGameRepository
    └── ui/
        ├── context/GameContext.tsx   Estado global, reloj y persistencia en tiempo real
        ├── hooks/useWakeLock.ts      Mantiene la pantalla encendida durante la partida
        ├── components/               Rosco, Scoreboard, HostCard, ActionBar, SettingsModal
        ├── pages/                    MenuPage, DrawPage, GamePage, SummaryPage
        └── routes/AppRouter.tsx      /, /sorteo, /juego, /resumen
```

## Persistencia

- `pasapalabra_settings`: tiempo por jugador (por defecto 170 s) y el modo de juego: presentador (ve la respuesta y valida) o jugadores (escriben la respuesta y se corrige sola, sin distinguir mayúsculas ni tildes). Por defecto, presentador.
- `pasapalabra_game`: estado completo de la partida (letras, tiempos, turno y letra actual), guardado en cada acción y cada 100 ms mientras corre el reloj.

Si se recarga la página con el reloj en marcha, la partida se recupera **en pausa** con el tiempo que quedaba, y el presentador la reanuda con "Comenzar turno".

## Despliegue en GitHub Pages

Cada push a `master` ejecuta `.github/workflows/deploy.yml`, que compila con `npm run build` y publica la carpeta `dist` en GitHub Pages (https://jborregovedruna.github.io/pasapalabra/).

Requisito, una sola vez: en el repositorio, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
