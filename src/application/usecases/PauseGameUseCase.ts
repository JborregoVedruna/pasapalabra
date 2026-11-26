import type { GameStateModel } from '../../domain/model/GameModel';
import { cloneGame, commitElapsed } from '../../domain/services/RoscoRules';
import type { PauseGamePort } from '../../domain/ports/inbound/PauseGamePort';

/**
 * Pausa del presentador: detiene el reloj en el instante exacto sin cambiar
 * de turno ni de letra. Se reanuda con StartTurnUseCase.
 */
export class PauseGameUseCase implements PauseGamePort {
  execute(game: GameStateModel, now: number): GameStateModel {
    if (game.status !== 'playing' || game.phase !== 'running') return game;
    const next = cloneGame(game);
    commitElapsed(next, now);
    next.phase = 'paused';
    next.runningSince = null;
    return next;
  }
}
