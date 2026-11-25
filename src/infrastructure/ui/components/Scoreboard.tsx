import type { GameStateModel, PlayerId } from '../../../domain/model/GameModel';
import { PLAYER_IDS } from '../../../domain/model/GameModel';
import { liveRemainingMs, msToSeconds, scoreOf } from '../../../domain/services/RoscoRules';

interface ScoreboardProps {
  game: GameStateModel;
  now: number;
  onPause: () => void;
}

export function Scoreboard({ game, now, onPause }: ScoreboardProps) {
  const active: PlayerId = game.currentPlayer;
  const seconds = msToSeconds(liveRemainingMs(game, active, now));
  const running = game.phase === 'running';
  const low = seconds <= 10;

  return (
    <header className="section-centered pt-3">
      <div className="grid w-full grid-cols-2 gap-2">
        {PLAYER_IDS.map((id) => {
          const p = game.players[id];
          const isActive = id === active;
          return (
            <div
              key={id}
              className={`flex flex-col items-center rounded-2xl border-2 px-2 py-2 text-center transition-all duration-300 ${
                isActive
                  ? 'bg-amber-400 text-blue-950 border-amber-200 shadow-lg shadow-amber-500/30'
                  : 'bg-blue-950/60 text-blue-100 border-blue-800 opacity-70'
              }`}
            >
              <div className="flex items-baseline justify-center gap-2">
                <span className="truncate text-base font-extrabold">{p.name}</span>
                <span className="text-2xl font-black tabular-nums">{scoreOf(p)}</span>
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wide">
                {p.done
                  ? 'Terminado'
                  : isActive
                    ? running
                      ? 'Jugando'
                      : 'Su turno'
                    : `En espera · ${msToSeconds(p.remainingMs)} s`}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1fr · auto · 1fr para que el reloj quede exactamente en el centro */}
      <div className="mt-2 grid w-full grid-cols-[1fr_auto_1fr] items-center">
        <button
          type="button"
          onClick={onPause}
          aria-label="Pausar la partida"
          className="justify-self-start flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-blue-950/70 px-4 py-2 text-sm font-black text-amber-300 active:scale-95"
        >
          <span className="text-base leading-none">⏸</span> Pausa
        </button>
        <div
          className={`flex items-baseline justify-center gap-1 px-4 font-black tabular-nums ${
            low ? 'text-red-400' : 'text-white'
          } ${running ? '' : 'opacity-60'}`}
        >
          <span className="text-5xl leading-none">{seconds}</span>
          <span className="text-base font-bold">s</span>
        </div>
        <div className="justify-self-end text-[11px] font-bold uppercase text-blue-200">
          {running ? '⏱ En marcha' : 'Reloj parado'}
        </div>
      </div>
    </header>
  );
}
