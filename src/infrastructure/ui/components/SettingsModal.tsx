import { useState } from 'react';
import type { SettingsModel } from '../../../domain/model/GameModel';

interface SettingsModalProps {
  initial: SettingsModel;
  onSave: (settings: SettingsModel) => void;
  onClose: () => void;
}

const MIN = 10;
const MAX = 900;

export function SettingsModal({ initial, onSave, onClose }: SettingsModalProps) {
  const [value, setValue] = useState<string>(String(initial.timePerPlayer));
  const [showAnswer, setShowAnswer] = useState<boolean>(initial.showAnswer);
  const parsed = Number(value);
  const valid = Number.isInteger(parsed) && parsed >= MIN && parsed <= MAX;

  const bump = (delta: number) => {
    const base = Number.isFinite(parsed) ? parsed : initial.timePerPlayer;
    setValue(String(Math.min(MAX, Math.max(MIN, base + delta))));
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ajustes-titulo"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ajustes-titulo" className="text-center text-2xl font-black text-blue-900">
          Ajustes
        </h2>

        {/* Tiempo por jugador */}
        <label htmlFor="tiempo" className="mt-5 block text-center text-sm font-bold text-slate-600">
          Tiempo inicial por jugador (segundos)
        </label>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => bump(-10)}
            className="h-14 w-14 shrink-0 rounded-2xl bg-blue-100 text-2xl font-black text-blue-900 active:scale-95"
            aria-label="Restar 10 segundos"
          >
            −
          </button>
          <input
            id="tiempo"
            type="number"
            inputMode="numeric"
            min={MIN}
            max={MAX}
            step={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-14 w-full min-w-0 rounded-2xl border-2 border-blue-200 text-center text-3xl font-black tabular-nums focus:border-blue-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => bump(10)}
            className="h-14 w-14 shrink-0 rounded-2xl bg-blue-100 text-2xl font-black text-blue-900 active:scale-95"
            aria-label="Sumar 10 segundos"
          >
            +
          </button>
        </div>
        <p className={`mt-2 text-center text-xs ${valid ? 'text-slate-500' : 'text-red-600 font-bold'}`}>
          {valid ? 'Por defecto: 170 segundos.' : `Introduce un número entero entre ${MIN} y ${MAX}.`}
        </p>

        {/* Mostrar respuesta */}
        <button
          type="button"
          role="switch"
          aria-checked={showAnswer}
          onClick={() => setShowAnswer((v) => !v)}
          className="mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-blue-100 bg-blue-50 px-4 py-3 text-left active:scale-[0.99]"
        >
          <span>
            <span className="block text-base font-black text-blue-900">Mostrar la respuesta</span>
            <span className="block text-xs text-slate-500">
              {showAnswer
                ? 'La respuesta aparece debajo de la pregunta.'
                : 'Solo se verá la pregunta durante el juego.'}
            </span>
          </span>
          <span
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              showAnswer ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                showAnswer ? 'left-7' : 'left-1'
              }`}
            />
          </span>
        </button>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-200 py-4 text-lg font-bold text-slate-700 active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => {
              onSave({ timePerPlayer: parsed, showAnswer });
              onClose();
            }}
            className="rounded-2xl bg-blue-700 py-4 text-lg font-black text-white active:scale-95 disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
