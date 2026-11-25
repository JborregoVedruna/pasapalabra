import type { GameStateModel } from '../../domain/model/GameModel';
import { cloneGame, commitElapsed } from '../../domain/services/RoscoRules';

/**
 * Pausa del presentador: detiene el reloj en el instante exacto sin cambiar
 * de turno ni de letra. Se reanuda con StartTurnUseCase.
 */
export class PauseGameUseCase {
  execute(game: GameStateModel, now: number): GameStateModel {
    if (game.status !== 'playing' || game.phase !== 'running') return game;
    const next = cloneGame(game);
    commitElapsed(next, now);
    next.phase = 'paused';
    next.runningSince = null;
    return next;
  }
}
