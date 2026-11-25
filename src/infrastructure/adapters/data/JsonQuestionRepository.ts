import type { PlayerId, PlayerModel, QuestionModel } from '../../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../../domain/ports/QuestionRepositoryPort';
import gameData from './gameData.json';

interface GameDataDTO {
  players: PlayerModel[];
  questions: Record<PlayerId, QuestionModel[]>;
}

const data = gameData as unknown as GameDataDTO;

export class JsonQuestionRepository implements QuestionRepositoryPort {
  getPlayers(): PlayerModel[] {
    return data.players;
  }

  getPlayer(id: PlayerId): PlayerModel {
    return data.players.find((p) => p.id === id) ?? { id, name: id };
  }

  getQuestions(id: PlayerId): QuestionModel[] {
    return data.questions[id];
  }

  getQuestion(id: PlayerId, index: number): QuestionModel {
    return data.questions[id][index];
  }
}
