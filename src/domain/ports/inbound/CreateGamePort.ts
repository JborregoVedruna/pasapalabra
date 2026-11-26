import type {
  GameMode,
  GameStateModel,
  PlayerId,
  QuestionSet,
} from '../../model/GameModel';

export interface CreateGameOptions {
  starter: PlayerId;
  timePerPlayerSeconds: number;
  mode: GameMode;
  questionSet: QuestionSet;
  now: number;
  /** Generador aleatorio en [0, 1); se puede inyectar para las pruebas. */
  random?: () => number;
}

/** Crea una partida nueva y sortea la pregunta de cada letra. */
export interface CreateGamePort {
  execute(options: CreateGameOptions): GameStateModel;
}
