import type { GameStateModel, PlayerId, QuestionModel } from '../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../domain/ports/outbound/QuestionRepositoryPort';
import type { GetQuestionPort } from '../../domain/ports/inbound/GetQuestionPort';

/** Devuelve la pregunta sorteada para una letra de un jugador en esta partida. */
export class GetQuestionUseCase implements GetQuestionPort {
  private readonly questions: QuestionRepositoryPort;

  constructor(questions: QuestionRepositoryPort) {
    this.questions = questions;
  }

  execute(game: GameStateModel, player: PlayerId, letterIndex: number): QuestionModel {
    const letter = game.players[player].letters[letterIndex];
    return this.questions.getQuestion(
      game.questionSet ?? 'default',
      player,
      letter.letter,
      letter.questionIndex ?? 0,
    );
  }
}
