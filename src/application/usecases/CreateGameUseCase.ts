import {
  ROSCO_LETTERS,
  type GameStateModel,
  type PlayerGameStateModel,
  type PlayerId,
} from '../../domain/model/GameModel';
import type { QuestionRepositoryPort } from '../../domain/ports/QuestionRepositoryPort';

/** Crea una partida nueva. El jugador elegido en el sorteo empieza con el reloj en marcha. */
export class CreateGameUseCase {
  private readonly questions: QuestionRepositoryPort;

  constructor(questions: QuestionRepositoryPort) {
    this.questions = questions;
  }

  execute(starter: PlayerId, timePerPlayerSeconds: number, now: number): GameStateModel {
    const build = (id: PlayerId): PlayerGameStateModel => ({
      id,
      name: this.questions.getPlayer(id).name,
      letters: ROSCO_LETTERS.map((letter) => ({ letter, status: 'pending' as const })),
      currentIndex: 0,
      remainingMs: timePerPlayerSeconds * 1000,
      done: false,
    });

    return {
      status: 'playing',
      phase: 'running',
      currentPlayer: starter,
      starter,
      players: { topo: build('topo'), bego: build('bego') },
      runningSince: now,
    };
  }
}
