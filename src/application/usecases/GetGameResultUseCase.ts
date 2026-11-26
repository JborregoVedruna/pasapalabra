import type { GameResultModel, GameStateModel } from '../../domain/model/GameModel';
import { msToSeconds, scoreOf } from '../../domain/services/RoscoRules';
import type { GetGameResultPort } from '../../domain/ports/inbound/GetGameResultPort';

/** Gana quien más acierte; si empatan, quien conserve más segundos; si no, empate. */
export class GetGameResultUseCase implements GetGameResultPort {
  execute(game: GameStateModel): GameResultModel {
    const { topo, bego } = game.players;
    const scores = { topo: scoreOf(topo), bego: scoreOf(bego) };
    const remainingSeconds = {
      topo: msToSeconds(topo.remainingMs),
      bego: msToSeconds(bego.remainingMs),
    };

    if (scores.topo !== scores.bego) {
      return { winner: scores.topo > scores.bego ? 'topo' : 'bego', reason: 'score', scores, remainingSeconds };
    }
    if (remainingSeconds.topo !== remainingSeconds.bego) {
      return {
        winner: remainingSeconds.topo > remainingSeconds.bego ? 'topo' : 'bego',
        reason: 'time',
        scores,
        remainingSeconds,
      };
    }
    return { winner: null, reason: 'tie', scores, remainingSeconds };
  }
}
