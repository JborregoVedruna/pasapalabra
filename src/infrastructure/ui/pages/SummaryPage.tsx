import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GetGameResultUseCase } from '../../../application/usecases/GetGameResultUseCase';
import {
  PLAYER_IDS,
  type LetterStateModel,
  type LetterStatus,
  type PlayerId,
} from '../../../domain/model/GameModel';

const getGameResultUseCase = new GetGameResultUseCase();

const DOT: Record<LetterStatus, string> = {
  correct: 'bg-emerald-500',
  incorrect: 'bg-red-600',
  pending: 'bg-slate-400',
};

const LABEL: Record<LetterStatus, string> = {
  correct: 'Acertada',
  incorrect: 'Fallada',
  pending: 'Sin responder',
};

/**
 * Modo jugadores:
 * - acertada → la respuesta en verde;
 * - fallada  → lo que escribió el jugador en rojo y tachado, y al lado la buena en azul;
 * - sin responder → la respuesta como siempre.
 */
function PlayersAnswer({ letter, answer }: { letter: LetterStateModel; answer: string }) {
  if (letter.status === 'correct') {
    return <p className="mt-0.5 text-sm font-black uppercase text-emerald-600">{answer}</p>;
  }
  if (letter.status === 'incorrect') {
    return (
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm font-black uppercase">
        {letter.given && (
          <span className="text-red-600 line-through decoration-2" aria-label={`Respondió ${letter.given}`}>
            {letter.given}
          </span>
        )}
        <span className="text-blue-700">{answer}</span>
      </p>
    );
  }
  return <p className="mt-0.5 text-sm font-black uppercase text-blue-800">{answer}</p>;
}

export function SummaryPage() {
  const navigate = useNavigate();
  const { game, getQuestions, resetGame } = useGame();
  const [tab, setTab] = useState<PlayerId>('topo');

  if (!game || game.status !== 'finished') return <Navigate to="/" replace />;

  const result = getGameResultUseCase.execute(game);
  const winnerName = result.winner ? game.players[result.winner].name : null;
  const questions = getQuestions(tab);
  const letters = game.players[tab].letters;
  const playersMode = game.mode === 'players';

  const backToMenu = () => {
    resetGame();
    navigate('/', { replace: true });
  };

  return (
    <main className="screen screen--scroll">
      <section className="w-full rounded-3xl bg-linear-to-b from-amber-300 to-amber-500 text-blue-950 p-5 text-center shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.3em]">Fin de la partida</div>
        <h1 className="mt-1 text-3xl font-black leading-tight">
          {winnerName ? `¡Gana ${winnerName}!` : '¡Empate!'}
        </h1>
        <p className="mt-1 text-sm font-semibold">
          {result.reason === 'score' && 'Por número de aciertos.'}
          {result.reason === 'time' && 'Empate a aciertos: gana quien conservó más segundos.'}
          {result.reason === 'tie' && 'Mismos aciertos y mismo tiempo restante.'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {PLAYER_IDS.map((id) => (
            <div
              key={id}
              className={`rounded-2xl py-3 ${
                result.winner === id ? 'bg-blue-950 text-amber-300' : 'bg-white/50 text-blue-950'
              }`}
            >
              <div className="text-base font-black">{game.players[id].name}</div>
              <div className="text-4xl font-black tabular-nums leading-none">{result.scores[id]}</div>
              <div className="text-[11px] font-bold uppercase">
                aciertos · {result.remainingSeconds[id]} s restantes
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid w-full grid-cols-2 rounded-2xl bg-blue-950/70 p-1" role="tablist">
        {PLAYER_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-xl py-3 text-lg font-black transition-colors ${
              tab === id ? 'bg-white text-blue-900' : 'text-blue-200'
            }`}
          >
            {game.players[id].name}
          </button>
        ))}
      </div>

      <ul className="flex w-full flex-col gap-2">
        {letters.map((l, i) => {
          const q = questions[i];
          return (
            <li key={l.letter} className="flex gap-3 rounded-2xl bg-white/95 p-3 text-slate-900">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-black text-white ${DOT[l.status]}`}
                title={LABEL[l.status]}
              >
                {l.letter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {q.type === 'starts' ? 'Empieza por' : 'Contiene la'} {q.letter} · {LABEL[l.status]}
                </div>
                <p className="text-sm leading-snug">{q.question}</p>
                {playersMode ? (
                  <PlayersAnswer letter={l} answer={q.answer} />
                ) : (
                  <p className="mt-0.5 text-sm font-black uppercase text-blue-800">{q.answer}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={backToMenu}
        className="sticky bottom-3 w-full rounded-3xl bg-blue-700 py-4 text-xl font-black text-white shadow-xl border-b-4 border-blue-900 active:scale-[0.98]"
      >
        Volver al menú principal
      </button>
    </main>
  );
}
