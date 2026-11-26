import type { AnswerOutcome, GameStateModel } from '../../model/GameModel';

export interface SubmitAnswerResult {
  game: GameStateModel;
  outcome: AnswerOutcome;
  expected: string;
}

/** Modo jugadores: corrige la respuesta escrita y la aplica como Correcto o Incorrecto. */
export interface SubmitAnswerPort {
  execute(game: GameStateModel, input: string, now: number): SubmitAnswerResult | null;
}
