/** Letras del rosco: las 27 del abecedario español, incluidas K y W. */
export const ROSCO_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;

export type RoscoLetter = (typeof ROSCO_LETTERS)[number];

export type PlayerId = 'topo' | 'bego';

export const PLAYER_IDS: readonly PlayerId[] = ['topo', 'bego'];

export type LetterStatus = 'pending' | 'correct' | 'incorrect';

/** "starts" → "Empieza por", "contains" → "Contiene la" */
export type ConditionType = 'starts' | 'contains';

export type AnswerOutcome = 'correct' | 'incorrect' | 'pass';

export interface PlayerModel {
  id: PlayerId;
  name: string;
}

export interface QuestionModel {
  letter: RoscoLetter;
  type: ConditionType;
  question: string;
  answer: string;
}

export interface LetterStateModel {
  letter: RoscoLetter;
  status: LetterStatus;
  /** Modo jugadores: lo que escribió el jugador al responder esta letra. */
  given?: string;
  /**
   * Cuál de las preguntas posibles de esta letra se ha sorteado para la partida.
   * Se fija al crearla, así que tras un Pasapalabra vuelve a salir la misma.
   */
  questionIndex?: number;
}

export interface PlayerGameStateModel {
  id: PlayerId;
  name: string;
  letters: LetterStateModel[];
  /** Índice (0-24) de la letra que se le preguntará al jugador. */
  currentIndex: number;
  /** Milisegundos restantes (consolidados hasta `runningSince`). */
  remainingMs: number;
  /** El jugador ya no participa (sin letras pendientes o sin tiempo). */
  done: boolean;
}

export type GameStatus = 'playing' | 'finished';

/** paused → esperando "Comenzar turno"; running → el reloj corre. */
export type TurnPhase = 'paused' | 'running';

export interface GameStateModel {
  status: GameStatus;
  phase: TurnPhase;
  currentPlayer: PlayerId;
  starter: PlayerId;
  /** Modo con el que se juega esta partida (las partidas antiguas sin este dato son de presentador). */
  mode?: GameMode;
  /** Banco de preguntas de esta partida (las partidas antiguas sin este dato usan el de por defecto). */
  questionSet?: QuestionSet;
  players: Record<PlayerId, PlayerGameStateModel>;
  /** Marca de tiempo (Date.now) desde la que corre el reloj, o null si está parado. */
  runningSince: number | null;
}

/**
 * host    → modo presentador: el presentador ve la respuesta y valida con Correcto/Incorrecto.
 * players → modo jugadores: la respuesta no se muestra; el jugador la escribe y se corrige sola.
 */
export type GameMode = 'host' | 'players';

/** default → defaultGameData.json · custom → customGameData.json */
export type QuestionSet = 'default' | 'custom';

export interface SettingsModel {
  /** Tiempo inicial por jugador, en segundos. */
  timePerPlayer: number;
  /** Modo de juego: presentador o jugadores. */
  mode: GameMode;
  /** Banco de preguntas: por defecto o custom. */
  questionSet: QuestionSet;
  /** Foto del jugador de fondo en el centro del rosco. */
  showPhotos: boolean;
}

export const DEFAULT_SETTINGS: SettingsModel = {
  timePerPlayer: 170,
  mode: 'host',
  questionSet: 'default',
  showPhotos: true,
};

export interface GameResultModel {
  winner: PlayerId | null;
  reason: 'score' | 'time' | 'tie';
  scores: Record<PlayerId, number>;
  remainingSeconds: Record<PlayerId, number>;
}
