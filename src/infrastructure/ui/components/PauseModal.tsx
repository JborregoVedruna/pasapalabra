import { useState } from 'react';

interface PauseModalProps {
  playerName: string;
  seconds: number;
  onResume: () => void;
  onRestart: () => void;
  onFinish: () => void;
  onExit: () => void;
}

type Pending = 'restart' | 'finish' | null;

/** Menú de pausa. Reiniciar y Terminar piden una segunda pulsación para evitar toques accidentales. */
export function PauseModal({ playerName, seconds, onResume, onRestart, onFinish, onExit }: PauseModalProps) {
  const [confirming, setConfirming] = useState<Pending>(null);

  const big =
    'w-full rounded-2xl py-4 text-xl font-black shadow-lg border-b-4 active:scale-[0.98] active:border-b-0 transition-transform';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pausa-titulo">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center text-slate-900 shadow-2xl">
        <div className="text-4xl leading-none">⏸</div>
        <h2 id="pausa-titulo" className="text-2xl font-black text-blue-900">
          Partida en pausa
        </h2>
        <p className="-mt-1 text-sm text-slate-500">
          Turno de <span className="font-bold text-slate-700">{playerName}</span> · {seconds} s restantes
        </p>

        {confirming === null && (
          <>
            <button type="button" onClick={onResume} className={`${big} mt-2 bg-emerald-600 border-emerald-800 text-white`}>
              ▶ Reanudar
            </button>
            <button
              type="button"
              onClick={() => setConfirming('restart')}
              className={`${big} bg-amber-400 border-amber-600 text-blue-950`}
            >
              ↺ Reiniciar partida
            </button>
            <button
              type="button"
              onClick={() => setConfirming('finish')}
              className={`${big} bg-red-600 border-red-800 text-white`}
            >
              ■ Terminar
            </button>
            <button type="button" onClick={onExit} className="mt-1 text-sm font-bold text-blue-700 underline">
              Salir al menú (la partida se guarda)
            </button>
          </>
        )}

        {confirming !== null && (
          <>
            <p className="mt-2 text-base font-bold text-slate-800">
              {confirming === 'restart'
                ? 'Se perderá la partida actual y se volverá al sorteo. ¿Seguro?'
                : 'La partida termina ahora con las puntuaciones actuales. ¿Seguro?'}
            </p>
            <div className="grid w-full grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                className="rounded-2xl bg-slate-200 py-4 text-lg font-bold text-slate-700 active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirming === 'restart' ? onRestart : onFinish}
                className={`rounded-2xl py-4 text-lg font-black text-white active:scale-95 ${
                  confirming === 'restart' ? 'bg-amber-500' : 'bg-red-600'
                }`}
              >
                {confirming === 'restart' ? 'Sí, reiniciar' : 'Sí, terminar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
