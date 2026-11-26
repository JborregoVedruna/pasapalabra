import type { GameStateModel } from '../../domain/model/GameModel';
import { cloneGame, commitElapsed } from '../../domain/services/RoscoRules';
import type { FinishGamePort } from '../../domain/ports/inbound/FinishGamePort';

/**
 * Termina la partida en este preciso instante con las puntuaciones actuales.
 * Las letras pendientes quedan sin responder (gris en el resumen).
 */
export class FinishGameUseCase implements FinishGamePort {
  execute(game: GameStateModel, now: number): GameStateModel {
    if (game.status !== 'playing') return game;
    const next = cloneGame(game);
    commitElapsed(next, now);
    next.phase = 'paused';
    next.runningSince = null;
    next.status = 'finished';
    return next;
  }
}
