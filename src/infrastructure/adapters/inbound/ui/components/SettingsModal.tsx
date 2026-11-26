import { useState } from 'react';
import type { GameMode, QuestionSet, SettingsModel } from '../../../../../domain/model/GameModel';

interface SettingsModalProps {
  initial: SettingsModel;
  onSave: (settings: SettingsModel) => void;
  onClose: () => void;
}

const MIN = 10;
const MAX = 900;

const QUESTION_SETS: { id: QuestionSet; title: string; description: string }[] = [
  { id: 'default', title: 'Por defecto', description: 'Una pregunta fija por letra.' },
  { id: 'custom', title: 'Custom', description: 'Varias por letra; sale una al azar en cada partida.' },
];

const MODES: { id: GameMode; title: string; description: string; icon: string }[] = [
  {
    id: 'host',
    icon: '🎤',
    title: 'Modo presentador',
    description: 'El presentador ve la respuesta y marca Correcto o Incorrecto.',
  },
  {
    id: 'players',
    icon: '⌨️',
    title: 'Modo jugadores',
    description: 'No se ve la respuesta: el jugador la escribe y se corrige sola.',
  },
];

export function SettingsModal({ initial, onSave, onClose }: SettingsModalProps) {
  const [value, setValue] = useState<string>(String(initial.timePerPlayer));
  const [mode, setMode] = useState<GameMode>(initial.mode);
  const [questionSet, setQuestionSet] = useState<QuestionSet>(initial.questionSet);
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
        className="w-full max-w-sm max-h-[calc(100dvh-32px)] overflow-y-auto rounded-3xl bg-white text-slate-900 p-6 shadow-2xl"
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

        {/* Modo de juego */}
        <p className="mt-5 text-center text-sm font-bold text-slate-600">Modo de juego</p>
        <div className="mt-2 flex flex-col gap-2" role="radiogroup" aria-label="Modo de juego">
          {MODES.map((m) => {
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMode(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors active:scale-[0.99] ${
                  selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {m.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-base font-black ${selected ? 'text-blue-900' : 'text-slate-700'}`}>
                    {m.title}
                  </span>
                  <span className="block text-xs text-slate-500">{m.description}</span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-blue-600' : 'border-slate-300'
                  }`}
                >
                  {selected && <span className="h-3 w-3 rounded-full bg-blue-600" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Banco de preguntas */}
        <p className="mt-5 text-center text-sm font-bold text-slate-600">Preguntas</p>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Banco de preguntas">
          {QUESTION_SETS.map((q) => {
            const selected = questionSet === q.id;
            return (
              <button
                key={q.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setQuestionSet(q.id)}
                className={`flex flex-col items-center rounded-2xl border-2 px-3 py-3 text-center transition-colors active:scale-[0.98] ${
                  selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                }`}
              >
                <span className={`text-base font-black ${selected ? 'text-blue-900' : 'text-slate-700'}`}>
                  {q.title}
                </span>
                <span className="mt-0.5 text-[11px] leading-tight text-slate-500">{q.description}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-center text-[11px] text-slate-400">Se aplica al iniciar una partida nueva.</p>

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
              onSave({ timePerPlayer: parsed, mode, questionSet });
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
