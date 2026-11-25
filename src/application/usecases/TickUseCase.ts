import type { GameStateModel } from '../../domain/model/GameModel';
import { cloneGame, commitElapsed, endTurn } from '../../domain/services/RoscoRules';

/** Consolida el tiempo transcurrido y gestiona el fin de tiempo del jugador activo. */
export class TickUseCase {
  execute(game: GameStateModel, now: number): GameStateModel {
    if (game.status !== 'playing' || game.phase !== 'running') return game;
    const next = cloneGame(game);
    commitElapsed(next, now);
    const p = next.players[next.currentPlayer];
    if (p.remainingMs <= 0) {
      p.remainingMs = 0;
      p.done = true;
      endTurn(next);
    }
    return next;
  }
}
