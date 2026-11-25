import type {
  ConditionType,
  PlayerId,
  PlayerModel,
  QuestionModel,
  QuestionSet,
  RoscoLetter,
} from '../../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../../domain/ports/QuestionRepositoryPort';
import defaultGameData from './defaultGameData.json';
import customGameData from './customGameData.json';

/** Una de las preguntas posibles de una letra (la letra es la clave del objeto). */
interface QuestionOptionDTO {
  type: ConditionType;
  question: string;
  answer: string;
}

/**
 * Estructura de los JSON de preguntas:
 * {
 *   "players": [{ "id": "topo", "name": "Topo" }, ...],
 *   "questions": {
 *     "topo": { "A": [ {type, question, answer}, ... ], "B": [...], ... },
 *     "bego": { ... }
 *   }
 * }
 * Cada letra puede tener una o varias preguntas; en cada partida se sortea una.
 */
interface GameDataDTO {
  players: PlayerModel[];
  questions: Record<PlayerId, Record<RoscoLetter, QuestionOptionDTO[]>>;
}

const DATA: Record<QuestionSet, GameDataDTO> = {
  default: defaultGameData as unknown as GameDataDTO,
  custom: customGameData as unknown as GameDataDTO,
};

export class JsonQuestionRepository implements QuestionRepositoryPort {
  getPlayers(): PlayerModel[] {
    return DATA.default.players;
  }

  getPlayer(id: PlayerId): PlayerModel {
    return DATA.default.players.find((p) => p.id === id) ?? { id, name: id };
  }

  private options(set: QuestionSet, player: PlayerId, letter: RoscoLetter): QuestionOptionDTO[] {
    const options = DATA[set]?.questions[player]?.[letter];
    if (options && options.length > 0) return options;
    // Si el banco custom no tiene preguntas para esa letra, se usa el de por defecto.
    return DATA.default.questions[player][letter];
  }

  countOptions(set: QuestionSet, player: PlayerId, letter: RoscoLetter): number {
    return this.options(set, player, letter).length;
  }

  getQuestion(set: QuestionSet, player: PlayerId, letter: RoscoLetter, optionIndex: number): QuestionModel {
    const options = this.options(set, player, letter);
    const option = options[Math.min(Math.max(0, optionIndex), options.length - 1)];
    return { letter, ...option };
  }
}
