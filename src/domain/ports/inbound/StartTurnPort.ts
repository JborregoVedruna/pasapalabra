import type { GameStateModel } from '../../model/GameModel';

/** Pone en marcha el reloj del jugador al que le toca. */
export interface StartTurnPort {
  execute(game: GameStateModel, now: number): GameStateModel;
}
