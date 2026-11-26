import {
  ROSCO_LETTERS,
  type GameStateModel,
  type PlayerGameStateModel,
  type PlayerId,
} from '../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../domain/ports/outbound/QuestionRepositoryPort';
import type { CreateGameOptions, CreateGamePort } from '../../domain/ports/inbound/CreateGamePort';

/**
 * Crea una partida nueva. El jugador elegido en el sorteo empieza con el reloj en marcha.
 * Para cada letra de cada jugador se sortea una de sus preguntas posibles y queda fijada
 * para toda la partida.
 */
export class CreateGameUseCase implements CreateGamePort {
  private readonly questions: QuestionRepositoryPort;

  constructor(questions: QuestionRepositoryPort) {
    this.questions = questions;
  }

  execute({ starter, timePerPlayerSeconds, mode, questionSet, now, random = Math.random }: CreateGameOptions): GameStateModel {
    const build = (id: PlayerId): PlayerGameStateModel => ({
      id,
      name: this.questions.getPlayer(id).name,
      letters: ROSCO_LETTERS.map((letter) => {
        const count = this.questions.countOptions(questionSet, id, letter);
        return {
          letter,
          status: 'pending' as const,
          questionIndex: Math.min(count - 1, Math.floor(random() * count)),
        };
      }),
      currentIndex: 0,
      remainingMs: timePerPlayerSeconds * 1000,
      done: false,
    });

    return {
      status: 'playing',
      phase: 'running',
      currentPlayer: starter,
      starter,
      mode,
      questionSet,
      players: { topo: build('topo'), bego: build('bego') },
      runningSince: now,
    };
  }
}
