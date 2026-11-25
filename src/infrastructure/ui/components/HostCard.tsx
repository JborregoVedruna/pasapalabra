import type { QuestionModel } from '../../../domain/model/GameModel';

interface HostCardProps {
  running: boolean;
  playerName: string;
  solo: boolean;
  question: QuestionModel | null;
  showAnswer: boolean;
  onStartTurn: () => void;
}

export function HostCard({ running, playerName, solo, question, showAnswer, onStartTurn }: HostCardProps) {
  if (!running || !question) {
    return (
      <section className="section-centered">
        <button
          type="button"
          onClick={onStartTurn}
          className="w-full rounded-3xl bg-linear-to-b from-amber-300 to-amber-500 text-blue-950 py-6 px-4 text-2xl font-black shadow-xl shadow-amber-500/30 border-4 border-amber-200 active:scale-[0.98] transition-transform"
        >
          ▶ Comenzar turno de {playerName}
        </button>
        <p className="mt-2 text-center text-sm text-blue-200">
          {solo
            ? `${playerName} sigue jugando en solitario. El reloj está parado.`
            : 'El reloj está parado. La pregunta se mostrará al comenzar el turno.'}
        </p>
      </section>
    );
  }

  const condition = question.type === 'starts' ? 'Empieza por' : 'Contiene la';

  return (
    <section className="section-centered">
      <div className="flex w-full flex-col items-center rounded-3xl bg-white p-4 text-center text-slate-900 shadow-xl">
        <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
          {condition} {question.letter}
        </span>
        <p className="mt-2 text-lg font-semibold leading-snug">{question.question}</p>
        {showAnswer && (
          <div className="mt-3 w-full rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 px-3 py-2">
            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-700">
              Respuesta
            </span>
            <span className="block text-2xl font-black uppercase text-emerald-800">{question.answer}</span>
          </div>
        )}
      </div>
    </section>
  );
}
