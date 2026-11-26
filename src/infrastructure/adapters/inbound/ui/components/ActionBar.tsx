import type { AnswerOutcome, GameMode } from '../../../../../domain/model/GameModel';

interface ActionBarProps {
  enabled: boolean;
  /** En modo jugadores solo queda Pasapalabra: Correcto/Incorrecto los decide la corrección automática. */
  mode: GameMode;
  onAnswer: (outcome: AnswerOutcome) => void;
}

/** Pasapalabra va en el centro para separar físicamente Correcto e Incorrecto. */
export function ActionBar({ enabled, mode, onAnswer }: ActionBarProps) {
  const base =
    'flex flex-col items-center justify-center gap-1 rounded-2xl py-4 text-center font-black text-white text-[15px] leading-tight shadow-lg border-b-4 transition-transform active:scale-95 active:border-b-0 disabled:opacity-35 disabled:active:scale-100';

  if (mode === 'players') {
    return (
      <nav className="section-centered action-bar">
        <button
          type="button"
          disabled={!enabled}
          onClick={() => onAnswer('pass')}
          className={`${base} w-full flex-row gap-3 bg-sky-600 border-sky-800 text-xl`}
        >
          <span className="text-3xl leading-none">⟳</span>
          Pasapalabra
        </button>
      </nav>
    );
  }

  return (
    <nav className="section-centered action-bar">
      <div className="grid w-full grid-cols-3 gap-2">
        <button
          type="button"
          disabled={!enabled}
          onClick={() => onAnswer('correct')}
          className={`${base} bg-emerald-600 border-emerald-800`}
        >
          <span className="text-3xl leading-none">✓</span>
          Correcto
        </button>
        <button
          type="button"
          disabled={!enabled}
          onClick={() => onAnswer('pass')}
          className={`${base} bg-sky-600 border-sky-800`}
        >
          <span className="text-3xl leading-none">⟳</span>
          Pasapalabra
        </button>
        <button
          type="button"
          disabled={!enabled}
          onClick={() => onAnswer('incorrect')}
          className={`${base} bg-red-600 border-red-800`}
        >
          <span className="text-3xl leading-none">✕</span>
          Incorrecto
        </button>
      </div>
    </nav>
  );
}
