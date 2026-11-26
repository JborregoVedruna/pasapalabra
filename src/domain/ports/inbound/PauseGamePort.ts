import type { GameStateModel } from '../../model/GameModel';

/** Pausa del presentador: para el reloj sin cambiar de turno ni de letra. */
export interface PauseGamePort {
  execute(game: GameStateModel, now: number): GameStateModel;
}
