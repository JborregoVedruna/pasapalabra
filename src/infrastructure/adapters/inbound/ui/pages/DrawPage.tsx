import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PLAYER_IDS, type PlayerId } from '../../../../../domain/model/GameModel';

const NAMES: Record<PlayerId, string> = { topo: 'Topo', bego: 'Bego' };

/** Número de saltos de la animación; la paridad determina dónde se detiene. */
function pickSteps(winner: PlayerId): number {
  const base = 14 + Math.floor(Math.random() * 4) * 2; // par: 14..20
  return winner === 'topo' ? base : base + 1;
}

export function DrawPage() {
  const navigate = useNavigate();
  const { createGame } = useGame();
  const [winner] = useState<PlayerId>(() => (Math.random() < 0.5 ? 'topo' : 'bego'));
  const [totalSteps] = useState(() => pickSteps(winner));
  const [step, setStep] = useState(0);
  const done = step >= totalSteps;
  const highlighted: PlayerId = step % 2 === 0 ? 'topo' : 'bego';

  useEffect(() => {
    if (done) return;
    // Se va frenando poco a poco, como una ruleta.
    const delay = 70 + step * step * 1.6;
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    return () => window.clearTimeout(id);
  }, [step, done]);

  const begin = () => {
    createGame(winner);
    navigate('/juego', { replace: true });
  };

  return (
    <main className="screen screen--centered">
      <h1 className="text-center text-3xl font-black uppercase tracking-wide text-white">Sorteo inicial</h1>

      <div className="section-centered gap-4">
        {PLAYER_IDS.map((id, i) => {
          const on = highlighted === id;
          const isWinner = done && id === winner;
          return (
            <div key={id} className="w-full flex flex-col items-center">
              {i === 1 && <div className="mb-4 text-3xl font-black text-amber-300">VS</div>}
              <div
                className={`w-full rounded-3xl py-7 text-center text-4xl font-black transition-all duration-150 border-4 ${
                  on
                    ? 'bg-amber-400 text-blue-950 border-amber-200 scale-105 shadow-2xl shadow-amber-400/40'
                    : 'bg-blue-950/60 text-blue-200 border-blue-800 scale-95 opacity-60'
                } ${isWinner ? 'draw-winner' : ''}`}
              >
                {NAMES[id]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-centered min-h-[150px] justify-end gap-4">
        {done ? (
          <>
            <p className="text-center text-3xl font-black text-white">¡Empieza {NAMES[winner]}!</p>
            <button
              type="button"
              onClick={begin}
              className="w-full rounded-3xl bg-linear-to-b from-emerald-400 to-emerald-600 py-5 text-2xl font-black text-white shadow-xl border-b-4 border-emerald-800 active:scale-[0.98]"
            >
              Comenzar
            </button>
          </>
        ) : (
          <p className="text-center text-xl font-bold text-blue-200 animate-pulse">Sorteando quién empieza…</p>
        )}
      </div>
    </main>
  );
}
