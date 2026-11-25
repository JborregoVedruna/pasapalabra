import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  AnswerOutcome,
  GameStateModel,
  PlayerId,
  QuestionModel,
  SettingsModel,
} from '../../../domain/model/GameModel';
import StorageAdapter from '../../adapters/storage/StorageAdapter';
import { LocalStorageGameRepository } from '../../adapters/storage/LocalStorageGameRepository';
import { JsonQuestionRepository } from '../../adapters/data/JsonQuestionRepository';
import { CreateGameUseCase } from '../../../application/usecases/CreateGameUseCase';
import { StartTurnUseCase } from '../../../application/usecases/StartTurnUseCase';
import { AnswerUseCase } from '../../../application/usecases/AnswerUseCase';
import { TickUseCase } from '../../../application/usecases/TickUseCase';
import { PauseGameUseCase } from '../../../application/usecases/PauseGameUseCase';
import { FinishGameUseCase } from '../../../application/usecases/FinishGameUseCase';
import {
  SubmitAnswerUseCase,
  type SubmitAnswerResult,
} from '../../../application/usecases/SubmitAnswerUseCase';

const gameRepository = new LocalStorageGameRepository(new StorageAdapter());
const questionRepository = new JsonQuestionRepository();
const createGameUseCase = new CreateGameUseCase(questionRepository);
const startTurnUseCase = new StartTurnUseCase();
const answerUseCase = new AnswerUseCase();
const tickUseCase = new TickUseCase();
const pauseGameUseCase = new PauseGameUseCase();
const finishGameUseCase = new FinishGameUseCase();
const submitAnswerUseCase = new SubmitAnswerUseCase(questionRepository, answerUseCase);

const TICK_MS = 100;

interface GameContextType {
  settings: SettingsModel;
  saveSettings: (settings: SettingsModel) => void;
  game: GameStateModel | null;
  /** Instante actual (se refresca mientras corre el reloj). */
  now: number;
  resetGame: () => void;
  createGame: (starter: PlayerId) => void;
  startTurn: () => void;
  answer: (outcome: AnswerOutcome) => void;
  /** Modo jugadores: corrige lo escrito y devuelve si era correcto y la respuesta buena. */
  submitAnswer: (input: string) => SubmitAnswerResult | null;
  /** Detiene el reloj sin cambiar de turno ni de letra. */
  pauseGame: () => void;
  /** Termina la partida ya, con las puntuaciones actuales. */
  finishGame: () => void;
  getQuestion: (player: PlayerId, index: number) => QuestionModel;
  getQuestions: (player: PlayerId) => QuestionModel[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Al recargar con el reloj en marcha, la partida se recupera en pausa con el
 * último tiempo guardado, para no descontar segundos mientras la página cargaba.
 */
function loadInitialGame(): GameStateModel | null {
  const saved = gameRepository.loadGame();
  if (saved && saved.status === 'playing' && saved.phase === 'running') {
    return { ...saved, phase: 'paused', runningSince: null };
  }
  return saved;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsModel>(() => gameRepository.loadSettings());
  const [game, setGame] = useState<GameStateModel | null>(loadInitialGame);
  const [now, setNow] = useState<number>(() => Date.now());

  const isRunning = game?.status === 'playing' && game.phase === 'running';

  // Reloj: consolida el tiempo cada 100 ms mientras el turno está activo.
  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      setGame((prev) => (prev ? tickUseCase.execute(prev, t) : prev));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [isRunning]);

  // Persistencia en tiempo real.
  useEffect(() => {
    if (game) gameRepository.saveGame(game);
    else gameRepository.clearGame();
  }, [game]);

  const saveSettings = (next: SettingsModel) => {
    gameRepository.saveSettings(next);
    setSettings(next);
  };

  const resetGame = () => {
    gameRepository.clearGame();
    setGame(null);
  };

  const createGame = (starter: PlayerId) => {
    const t = Date.now();
    setNow(t);
    setGame(createGameUseCase.execute(starter, settings.timePerPlayer, t));
  };

  const startTurn = () => {
    const t = Date.now();
    setNow(t);
    setGame((prev) => (prev ? startTurnUseCase.execute(prev, t) : prev));
  };

  const answer = (outcome: AnswerOutcome) => {
    const t = Date.now();
    setNow(t);
    setGame((prev) => (prev ? answerUseCase.execute(prev, outcome, t) : prev));
  };

  const submitAnswer = (input: string): SubmitAnswerResult | null => {
    if (!game) return null;
    const t = Date.now();
    const result = submitAnswerUseCase.execute(game, input, t);
    if (!result) return null;
    setNow(t);
    setGame(result.game);
    return result;
  };

  const pauseGame = () => {
    const t = Date.now();
    setNow(t);
    setGame((prev) => (prev ? pauseGameUseCase.execute(prev, t) : prev));
  };

  const finishGame = () => {
    const t = Date.now();
    setNow(t);
    setGame((prev) => (prev ? finishGameUseCase.execute(prev, t) : prev));
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        saveSettings,
        game,
        now,
        resetGame,
        createGame,
        startTurn,
        answer,
        submitAnswer,
        pauseGame,
        finishGame,
        getQuestion: (player, index) => questionRepository.getQuestion(player, index),
        getQuestions: (player) => questionRepository.getQuestions(player),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};
