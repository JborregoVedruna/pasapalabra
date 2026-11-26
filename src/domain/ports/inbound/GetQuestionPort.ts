import type { GameStateModel, PlayerId, QuestionModel } from '../../model/GameModel';

/** Pregunta sorteada para una letra de un jugador en la partida. */
export interface GetQuestionPort {
  execute(game: GameStateModel, player: PlayerId, letterIndex: number): QuestionModel;
}
