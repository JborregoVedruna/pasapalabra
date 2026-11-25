import type { GameStateModel } from '../../domain/model/GameModel';
import { canPlay, cloneGame, firstPendingIndex } from '../../domain/services/RoscoRules';

/** Reanuda el reloj del jugador al que le toca ("Comenzar turno de …"). */
export class StartTurnUseCase {
  execute(game: GameStateModel, now: number): GameStateModel {
    if (game.status !== 'playing' || game.phase !== 'paused') return game;
    const next = cloneGame(game);
    const p = next.players[next.currentPlayer];
    if (!canPlay(p)) return game;
    if (p.letters[p.currentIndex]?.status !== 'pending') {
      p.currentIndex = firstPendingIndex(p.letters);
    }
    next.phase = 'running';
    next.runningSince = now;
    return next;
  }
}
