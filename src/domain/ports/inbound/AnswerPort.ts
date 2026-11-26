import type { AnswerOutcome, GameStateModel } from '../../model/GameModel';

/** Aplica Correcto, Incorrecto o Pasapalabra a la letra actual. */
export interface AnswerPort {
  execute(game: GameStateModel, outcome: AnswerOutcome, now: number): GameStateModel;
}
