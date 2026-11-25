import type { AnswerOutcome, GameStateModel } from '../../domain/model/GameModel';
import {
  cloneGame,
  commitElapsed,
  endTurn,
  nextPendingIndex,
} from '../../domain/services/RoscoRules';

/**
 * Aplica la decisión del presentador sobre la letra actual:
 * - correct: verde, +1 y sigue a la siguiente pendiente SIN parar el reloj.
 * - incorrect: rojo, se para el reloj y pasa el turno.
 * - pass: sigue pendiente, se para el reloj y pasa el turno.
 */
export class AnswerUseCase {
  execute(game: GameStateModel, outcome: AnswerOutcome, now: number): GameStateModel {
    if (game.status !== 'playing' || game.phase !== 'running') return game;

    const next = cloneGame(game);
    commitElapsed(next, now);
    const p = next.players[next.currentPlayer];

    // Si el tiempo se agotó justo antes de pulsar, no se registra la respuesta.
    if (p.remainingMs <= 0) {
      p.remainingMs = 0;
      p.done = true;
      endTurn(next);
      return next;
    }

    const idx = p.currentIndex;
    if (outcome === 'correct') p.letters[idx].status = 'correct';
    if (outcome === 'incorrect') p.letters[idx].status = 'incorrect';

    const following = nextPendingIndex(p.letters, idx);
    if (following === -1) {
      // Rosco completado: el reloj se detiene.
      p.done = true;
      endTurn(next);
      return next;
    }
    p.currentIndex = following;

    if (outcome === 'correct') {
      next.runningSince = now; // el reloj sigue corriendo
      return next;
    }

    endTurn(next);
    return next;
  }
}
