/** Letras del rosco (abecedario español sin K ni W). */
export const ROSCO_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N',
  'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z',
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
  players: Record<PlayerId, PlayerGameStateModel>;
  /** Marca de tiempo (Date.now) desde la que corre el reloj, o null si está parado. */
  runningSince: number | null;
}

export interface SettingsModel {
  /** Tiempo inicial por jugador, en segundos. */
  timePerPlayer: number;
  /** Mostrar la respuesta correcta al presentador junto a la pregunta. */
  showAnswer: boolean;
}

export const DEFAULT_SETTINGS: SettingsModel = { timePerPlayer: 170, showAnswer: true };

export interface GameResultModel {
  winner: PlayerId | null;
  reason: 'score' | 'time' | 'tie';
  scores: Record<PlayerId, number>;
  remainingSeconds: Record<PlayerId, number>;
}
