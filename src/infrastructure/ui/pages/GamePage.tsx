import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useWakeLock } from '../hooks/useWakeLock';
import { Scoreboard } from '../components/Scoreboard';
import { Rosco } from '../components/Rosco';
import { HostCard, type AnswerFeedback } from '../components/HostCard';
import { ActionBar } from '../components/ActionBar';
import { PauseModal } from '../components/PauseModal';
import { liveRemainingMs, msToSeconds, otherPlayer, scoreOf } from '../../../domain/services/RoscoRules';

export function GamePage() {
  const navigate = useNavigate();
  const { game, now, settings, startTurn, answer, submitAnswer, pauseGame, finishGame, resetGame, getQuestion } =
    useGame();
  /** null = modal cerrado; true/false = si el reloj corría al abrirlo. */
  const [pausedFromRunning, setPausedFromRunning] = useState<boolean | null>(null);
  /** Resultado de la última respuesta escrita (modo jugadores). */
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  useWakeLock(game?.status === 'playing');

  // El aviso (verde o rojo) se mantiene hasta la siguiente interacción:
  // enviar otra respuesta lo sustituye; Pasapalabra o comenzar turno lo quitan.

  if (!game) return <Navigate to="/" replace />;
  if (game.status === 'finished') return <Navigate to="/resumen" replace />;

  const player = game.players[game.currentPlayer];
  const running = game.phase === 'running';
  const solo = game.players[otherPlayer(player.id)].done;
  const current = player.letters[player.currentIndex];
  const question = running ? getQuestion(player.id, player.currentIndex) : null;

  const handleStartTurn = () => {
    setFeedback(null);
    startTurn();
  };

  const handleAnswer: typeof answer = (outcome) => {
    setFeedback(null);
    answer(outcome);
  };

  const handleSubmit = (text: string) => {
    const result = submitAnswer(text);
    if (result) setFeedback({ outcome: result.outcome, given: text.trim(), expected: result.expected });
  };

  const openPause = () => {
    setPausedFromRunning(running);
    pauseGame();
  };

  const resume = () => {
    if (pausedFromRunning) startTurn();
    setPausedFromRunning(null);
  };

  const restart = () => {
    setPausedFromRunning(null);
    resetGame();
    navigate('/sorteo', { replace: true });
  };

  const finish = () => {
    setPausedFromRunning(null);
    finishGame(); // al pasar a 'finished' se redirige solo al resumen
  };

  const exitToMenu = () => {
    setPausedFromRunning(null);
    navigate('/');
  };

  return (
    <main className="screen screen--game">
      <Scoreboard game={game} now={now} onPause={openPause} />

      <div className="rosco-wrap">
        <div className="rosco-size rosco-size--game">
          <Rosco letters={player.letters} currentIndex={player.currentIndex}>
            <div className="text-center">
              <div className="text-[5.5cqw] font-bold uppercase tracking-widest text-blue-200">
                Rosco de
              </div>
              <div className="text-[10cqw] font-black leading-none text-white">{player.name}</div>
              <div className="mt-[2cqw] text-[16cqw] font-black leading-none text-amber-300">
                {current?.letter}
              </div>
              <div className="mt-[1cqw] text-[4.5cqw] font-bold text-blue-100">
                {scoreOf(player)} aciertos
              </div>
            </div>
          </Rosco>
        </div>
      </div>

      <div className="game-side">
        <HostCard
          running={running}
          playerName={player.name}
          solo={solo}
          question={question}
          mode={settings.mode}
          questionKey={`${player.id}-${player.currentIndex}`}
          feedback={feedback}
          onStartTurn={handleStartTurn}
          onSubmit={handleSubmit}
        />

        <ActionBar enabled={running} mode={settings.mode} onAnswer={handleAnswer} />
      </div>

      {pausedFromRunning !== null && (
        <PauseModal
          playerName={player.name}
          seconds={msToSeconds(liveRemainingMs(game, player.id, now))}
          onResume={resume}
          onRestart={restart}
          onFinish={finish}
          onExit={exitToMenu}
        />
      )}
    </main>
  );
}
