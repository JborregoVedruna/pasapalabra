import type {
  GameStateModel,
  LetterStateModel,
  PlayerGameStateModel,
  PlayerId,
} from '../model/GameModel';

export const otherPlayer = (id: PlayerId): PlayerId => (id === 'topo' ? 'bego' : 'topo');

export const hasPending = (letters: LetterStateModel[]): boolean =>
  letters.some((l) => l.status === 'pending');

/**
 * Siguiente letra pendiente después de `from`, recorriendo el rosco en orden
 * alfabético y volviendo al principio (vueltas sucesivas). Incluye `from` como
 * último candidato, para el caso de que sea la única pendiente.
 * Devuelve -1 si no queda ninguna.
 */
export function nextPendingIndex(letters: LetterStateModel[], from: number): number {
  const n = letters.length;
  for (let step = 1; step <= n; step++) {
    const i = (from + step) % n;
    if (letters[i].status === 'pending') return i;
  }
  return -1;
}

export function firstPendingIndex(letters: LetterStateModel[]): number {
  return letters.findIndex((l) => l.status === 'pending');
}

export const canPlay = (p: PlayerGameStateModel): boolean =>
  !p.done && p.remainingMs > 0 && hasPending(p.letters);

export const scoreOf = (p: PlayerGameStateModel): number =>
  p.letters.filter((l) => l.status === 'correct').length;

/** Tiempo restante en vivo del jugador indicado. */
export function liveRemainingMs(game: GameStateModel, id: PlayerId, now: number): number {
  const p = game.players[id];
  if (game.phase === 'running' && game.currentPlayer === id && game.runningSince !== null) {
    return Math.max(0, p.remainingMs - (now - game.runningSince));
  }
  return p.remainingMs;
}

export const msToSeconds = (ms: number): number => Math.ceil(ms / 1000);

export function cloneGame(game: GameStateModel): GameStateModel {
  return {
    ...game,
    players: {
      topo: { ...game.players.topo, letters: game.players.topo.letters.map((l) => ({ ...l })) },
      bego: { ...game.players.bego, letters: game.players.bego.letters.map((l) => ({ ...l })) },
    },
  };
}

/** Consolida en remainingMs el tiempo transcurrido desde runningSince (muta la copia). */
export function commitElapsed(game: GameStateModel, now: number): void {
  if (game.phase !== 'running' || game.runningSince === null) return;
  const p = game.players[game.currentPlayer];
  p.remainingMs = Math.max(0, p.remainingMs - Math.max(0, now - game.runningSince));
  game.runningSince = now;
}

/**
 * Detiene el reloj y decide quién juega después (muta la copia):
 * - Si el rival puede jugar, el turno pasa al rival.
 * - Si no, y el jugador actual aún puede, sigue él en solitario.
 * - Si ninguno puede, la partida termina.
 * El siguiente turno siempre arranca en pausa.
 */
export function endTurn(game: GameStateModel): void {
  game.phase = 'paused';
  game.runningSince = null;

  for (const p of Object.values(game.players)) {
    if (!p.done && !canPlay(p)) p.done = true;
  }

  const current = game.currentPlayer;
  const rival = otherPlayer(current);
  if (canPlay(game.players[rival])) {
    game.currentPlayer = rival;
  } else if (canPlay(game.players[current])) {
    game.currentPlayer = current;
  } else {
    game.status = 'finished';
  }
}
