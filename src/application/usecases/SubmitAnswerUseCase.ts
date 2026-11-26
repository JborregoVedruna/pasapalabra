import type { AnswerOutcome, GameStateModel } from '../../domain/model/GameModel';
import { isCorrectAnswer } from '../../domain/services/AnswerMatcher';
import type { AnswerPort } from '../../domain/ports/inbound/AnswerPort';
import type { GetQuestionPort } from '../../domain/ports/inbound/GetQuestionPort';
import type { SubmitAnswerPort, SubmitAnswerResult } from '../../domain/ports/inbound/SubmitAnswerPort';

/**
 * Modo jugadores: compara lo que ha escrito el jugador con la respuesta de la
 * letra actual y aplica Correcto o Incorrecto con las reglas de siempre.
 */
export class SubmitAnswerUseCase implements SubmitAnswerPort {
  private readonly getQuestion: GetQuestionPort;
  private readonly answerUseCase: AnswerPort;

  constructor(getQuestion: GetQuestionPort, answerUseCase: AnswerPort) {
    this.getQuestion = getQuestion;
    this.answerUseCase = answerUseCase;
  }

  execute(game: GameStateModel, input: string, now: number): SubmitAnswerResult | null {
    if (game.status !== 'playing' || game.phase !== 'running') return null;
    const player = game.players[game.currentPlayer];
    const expected = this.getQuestion.execute(game, player.id, player.currentIndex).answer;
    const outcome: AnswerOutcome = isCorrectAnswer(input, expected) ? 'correct' : 'incorrect';
    const index = player.currentIndex;
    const next = this.answerUseCase.execute(game, outcome, now);
    // Se guarda lo escrito para mostrarlo en el resumen final.
    // (next es una copia nueva, así que se puede modificar sin tocar el estado anterior.)
    if (next !== game) next.players[player.id].letters[index].given = input.trim();
    return { game: next, outcome, expected };
  }
}
