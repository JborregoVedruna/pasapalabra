import type { GameStateModel } from '../../model/GameModel';

/** Consolida el tiempo transcurrido y gestiona el fin de tiempo. */
export interface TickPort {
  execute(game: GameStateModel, now: number): GameStateModel;
}
