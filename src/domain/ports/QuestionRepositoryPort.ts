import type { PlayerId, PlayerModel, QuestionModel } from '../model/GameModel';

export interface QuestionRepositoryPort {
  getPlayers(): PlayerModel[];
  getPlayer(id: PlayerId): PlayerModel;
  getQuestions(id: PlayerId): QuestionModel[];
  getQuestion(id: PlayerId, index: number): QuestionModel;
}
