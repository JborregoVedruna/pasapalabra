import type { AnswerOutcome, GameStateModel } from '../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../domain/ports/QuestionRepositoryPort';
import { isCorrectAnswer } from '../../domain/services/AnswerMatcher';
import { AnswerUseCase } from './AnswerUseCase';

export interface SubmitAnswerResult {
  game: GameStateModel;
  outcome: AnswerOutcome;
  expected: string;
}

/**
 * Modo jugadores: compara lo que ha escrito el jugador con la respuesta de la
 * letra actual y aplica Correcto o Incorrecto con las reglas de siempre.
 */
export class SubmitAnswerUseCase {
  private readonly questions: QuestionRepositoryPort;
  private readonly answerUseCase: AnswerUseCase;

  constructor(questions: QuestionRepositoryPort, answerUseCase: AnswerUseCase) {
    this.questions = questions;
    this.answerUseCase = answerUseCase;
  }

  execute(game: GameStateModel, input: string, now: number): SubmitAnswerResult | null {
    if (game.status !== 'playing' || game.phase !== 'running') return null;
    const player = game.players[game.currentPlayer];
    const expected = this.questions.getQuestion(player.id, player.currentIndex).answer;
    const outcome: AnswerOutcome = isCorrectAnswer(input, expected) ? 'correct' : 'incorrect';
    const index = player.currentIndex;
    const next = this.answerUseCase.execute(game, outcome, now);
    // Se guarda lo escrito para mostrarlo en el resumen final.
    // (next es una copia nueva, así que se puede modificar sin tocar el estado anterior.)
    if (next !== game) next.players[player.id].letters[index].given = input.trim();
    return { game: next, outcome, expected };
  }
}
