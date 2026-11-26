import type { GameStateModel } from '../../model/GameModel';

/** Termina la partida en este instante con las puntuaciones actuales. */
export interface FinishGamePort {
  execute(game: GameStateModel, now: number): GameStateModel;
}
