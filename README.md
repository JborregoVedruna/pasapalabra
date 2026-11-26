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

## Arquitectura (hexagonal)

```
src/
├── domain/
│   ├── model/GameModel.ts              Tipos del juego y constantes (letras, ajustes por defecto)
│   ├── ports/
│   │   ├── inbound/                    Puertos de entrada: un contrato por caso de uso
│   │   │                               (CreateGame, StartTurn, Answer, SubmitAnswer, Tick,
│   │   │                                PauseGame, FinishGame, GetQuestion, GetGameResult)
│   │   └── outbound/                   Puertos de salida: GameRepositoryPort, QuestionRepositoryPort
│   └── services/                       Reglas puras: RoscoRules (turnos, tiempo), AnswerMatcher
├── application/usecases/               Casos de uso; cada uno implementa su puerto de entrada
└── infrastructure/
    ├── adapters/
    │   ├── inbound/ui/                 Adaptador de entrada: la interfaz en React
    │   │   ├── context/GameContext.tsx Estado global, reloj y persistencia en tiempo real
    │   │   ├── components/             Rosco, Scoreboard, HostCard, ActionBar, SettingsModal, PauseModal
    │   │   ├── hooks/useWakeLock.ts    Mantiene la pantalla encendida durante la partida
    │   │   ├── pages/                  MenuPage, DrawPage, GamePage, SummaryPage
    │   │   └── routes/AppRouter.tsx    /, /sorteo, /juego, /resumen
    │   └── outbound/                   Adaptadores de salida
    │       ├── data/                   JsonQuestionRepository + defaultGameData.json y customGameData.json
    │       └── storage/                LocalStorageGameRepository + StorageAdapter (localStorage)
    └── config/dependencies.ts          Punto de montaje: conecta adaptadores y casos de uso
```

La interfaz solo usa los puertos de entrada que exporta `dependencies.ts`; nunca importa casos de uso ni adaptadores de salida directamente. Los casos de uso solo conocen los puertos de salida, no `localStorage` ni los JSON.

## Persistencia

- `pasapalabra_settings`: tiempo por jugador (por defecto 170 s), banco de preguntas (por defecto o custom) y el modo de juego: presentador (ve la respuesta y valida) o jugadores (escriben la respuesta y se corrige sola, sin distinguir mayúsculas ni tildes). Por defecto, presentador.
- `pasapalabra_game`: estado completo de la partida (letras, tiempos, turno y letra actual), guardado en cada acción y cada 100 ms mientras corre el reloj.

Si se recarga la página con el reloj en marcha, la partida se recupera **en pausa** con el tiempo que quedaba, y el presentador la reanuda con "Comenzar turno".

## Despliegue en GitHub Pages

Cada push a `master` ejecuta `.github/workflows/deploy.yml`, que compila con `npm run build` y publica la carpeta `dist` en GitHub Pages (https://jborregovedruna.github.io/pasapalabra/).

Requisito, una sola vez: en el repositorio, **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Preguntas

Hay dos bancos, a elegir en **Ajustes → Preguntas**: `defaultGameData.json` y `customGameData.json`. Los dos usan la misma estructura: para cada jugador, cada letra tiene una **lista** de preguntas posibles.

```json
"questions": {
  "topo": {
    "A": [
      { "type": "starts", "question": "Insecto volador que vive en colmenas...", "answer": "Abeja" },
      { "type": "starts", "question": "Vehículo con alas y motores...", "answer": "Avión" }
    ],
    "Ñ": [
      { "type": "contains", "question": "Estación del año entre el verano y el invierno...", "answer": "Otoño" }
    ]
  }
}
```

`type` puede ser `starts` ("Empieza por") o `contains` ("Contiene la"). Al empezar cada partida se sortea una pregunta por letra y queda fijada: si el jugador dice Pasapalabra, en la siguiente vuelta le sale la misma. Si en el banco custom falta alguna letra, se usa la del banco por defecto.
