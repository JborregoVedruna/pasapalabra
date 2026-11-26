import { useState } from 'react';
import type { AnswerOutcome, GameMode, QuestionModel } from '../../../../../domain/model/GameModel';

export interface AnswerFeedback {
  outcome: AnswerOutcome;
  given: string;
  expected: string;
}

interface HostCardProps {
  running: boolean;
  playerName: string;
  solo: boolean;
  question: QuestionModel | null;
  mode: GameMode;
  /** Identifica la pregunta actual para vaciar el campo al cambiar de letra. */
  questionKey: string;
  feedback: AnswerFeedback | null;
  onStartTurn: () => void;
  onSubmit: (text: string) => void;
}

function FeedbackBanner({ feedback }: { feedback: AnswerFeedback }) {
  if (feedback.outcome === 'correct') {
    return (
      <div className="w-full rounded-2xl bg-emerald-500 px-3 py-2 text-center text-lg font-black text-white shadow">
        ✓ ¡Correcto! <span className="uppercase">{feedback.expected}</span>
      </div>
    );
  }
  return (
    <div className="w-full rounded-2xl bg-red-600 px-3 py-2 text-center text-white shadow">
      <div className="text-lg font-black">✕ Incorrecto</div>
      <div className="text-sm">
        {feedback.given ? (
          <>
            Has escrito <span className="font-bold uppercase">«{feedback.given}»</span>.{' '}
          </>
        ) : null}
        Era <span className="font-black uppercase">{feedback.expected}</span>
      </div>
    </div>
  );
}

/** Campo de respuesta del modo jugadores. Se monta de nuevo en cada pregunta (key), así empieza vacío. */
function AnswerInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  const canSubmit = text.trim().length > 0;

  return (
    <form
      className="mt-3 flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(text);
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="send"
        placeholder="Escribe tu respuesta"
        aria-label="Tu respuesta"
        className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-blue-200 px-4 text-center text-xl font-bold uppercase text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="h-14 shrink-0 rounded-2xl bg-emerald-600 px-4 text-base font-black text-white border-b-4 border-emerald-800 active:scale-95 active:border-b-0 disabled:opacity-40"
      >
        Responder
      </button>
    </form>
  );
}

export function HostCard({
  running,
  playerName,
  solo,
  question,
  mode,
  questionKey,
  feedback,
  onStartTurn,
  onSubmit,
}: HostCardProps) {
  if (!running || !question) {
    return (
      <section className="section-centered gap-2">
        <button
          type="button"
          onClick={onStartTurn}
          className="w-full rounded-3xl bg-linear-to-b from-amber-300 to-amber-500 text-blue-950 py-6 px-4 text-2xl font-black shadow-xl shadow-amber-500/30 border-4 border-amber-200 active:scale-[0.98] transition-transform"
        >
          ▶ Comenzar turno de {playerName}
        </button>
        {feedback && <FeedbackBanner feedback={feedback} />}
        <p className="text-center text-sm text-blue-200">
          {solo
            ? `${playerName} sigue jugando en solitario. El reloj está parado.`
            : 'El reloj está parado. La pregunta se mostrará al comenzar el turno.'}
        </p>
      </section>
    );
  }

  const condition = question.type === 'starts' ? 'Empieza por' : 'Contiene la';

  return (
    <section className="section-centered gap-2">
      <div className="flex w-full flex-col items-center rounded-3xl bg-white p-4 text-center text-slate-900 shadow-xl">
        <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
          {condition} {question.letter}
        </span>
        <p className="mt-2 text-lg font-semibold leading-snug">{question.question}</p>

        {mode === 'host' ? (
          <div className="mt-3 w-full rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 px-3 py-2">
            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-700">
              Respuesta
            </span>
            <span className="block text-2xl font-black uppercase text-emerald-800">{question.answer}</span>
          </div>
        ) : (
          <AnswerInput key={questionKey} onSubmit={onSubmit} />
        )}
      </div>
      {feedback?.outcome === 'correct' && <FeedbackBanner feedback={feedback} />}
    </section>
  );
}
