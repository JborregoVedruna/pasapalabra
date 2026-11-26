import type { GameResultModel, GameStateModel } from '../../model/GameModel';

/** Ganador y marcador final de la partida. */
export interface GetGameResultPort {
  execute(game: GameStateModel): GameResultModel;
}
