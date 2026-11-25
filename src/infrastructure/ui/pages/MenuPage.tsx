import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { SettingsModal } from '../components/SettingsModal';
import { Rosco } from '../components/Rosco';
import { ROSCO_LETTERS } from '../../../domain/model/GameModel';

const DECOR = ROSCO_LETTERS.map((letter, i) => ({
  letter,
  status: i % 7 === 2 ? ('correct' as const) : i % 11 === 5 ? ('incorrect' as const) : ('pending' as const),
}));

export function MenuPage() {
  const navigate = useNavigate();
  const { settings, saveSettings, resetGame, game } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const canContinue = game?.status === 'playing';

  const startNewGame = () => {
    resetGame();
    navigate('/sorteo');
  };

  return (
    <main className="screen screen--centered">
      <div className="section-centered">
        <div className="rosco-size rosco-size--menu">
          <Rosco letters={DECOR} currentIndex={null}>
            <div className="text-center">
              <div className="text-[11cqw] font-black leading-none tracking-tight text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">
                PASA
              </div>
              <div className="text-[11cqw] font-black leading-none tracking-tight text-amber-300 drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">
                PALABRA
              </div>
              <div className="mt-[2cqw] text-[3.6cqw] font-bold uppercase tracking-[0.3em] text-blue-200">
                El Rosco
              </div>
            </div>
          </Rosco>
        </div>

        <p className="mt-6 text-center text-blue-100 text-lg font-semibold">
          <span className="text-white font-black">Topo</span>
          <span className="mx-2 text-amber-300 font-black">VS</span>
          <span className="text-white font-black">Bego</span>
        </p>
      </div>

      <div className="section-centered gap-3">
        {canContinue && (
          <button
            type="button"
            onClick={() => navigate('/juego')}
            className="w-full rounded-3xl bg-emerald-500 py-4 text-xl font-black text-white shadow-lg border-b-4 border-emerald-700 active:scale-[0.98]"
          >
            Continuar partida
          </button>
        )}
        <button
          type="button"
          onClick={startNewGame}
          className="w-full rounded-3xl bg-linear-to-b from-amber-300 to-amber-500 py-5 text-2xl font-black text-blue-950 shadow-xl shadow-amber-500/30 border-b-4 border-amber-700 active:scale-[0.98]"
        >
          Iniciar partida
        </button>
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="w-full rounded-3xl bg-blue-950/60 py-4 text-lg font-bold text-blue-100 border-2 border-blue-600 active:scale-[0.98]"
        >
          ⚙ Ajustes
        </button>
        <p className="text-center text-xs font-semibold text-blue-200">
          {settings.timePerPlayer} s por jugador · {settings.mode === 'host' ? 'Modo presentador' : 'Modo jugadores'}
        </p>
      </div>

      {showSettings && (
        <SettingsModal initial={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />
      )}
    </main>
  );
}
