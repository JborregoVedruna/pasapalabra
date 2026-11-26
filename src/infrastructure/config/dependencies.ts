/**
 * Punto de montaje (composition root): aquí, y solo aquí, se crean los
 * adaptadores de salida y los casos de uso, y se conectan entre sí.
 *
 * La interfaz (adaptador de entrada) solo ve los puertos de entrada exportados
 * abajo; no conoce las clases concretas ni de dónde salen los datos.
 */
import type { GameRepositoryPort } from '../../domain/ports/outbound/GameRepositoryPort';
import type { QuestionRepositoryPort } from '../../domain/ports/outbound/QuestionRepositoryPort';
import type { CreateGamePort } from '../../domain/ports/inbound/CreateGamePort';
import type { StartTurnPort } from '../../domain/ports/inbound/StartTurnPort';
import type { AnswerPort } from '../../domain/ports/inbound/AnswerPort';
import type { SubmitAnswerPort } from '../../domain/ports/inbound/SubmitAnswerPort';
import type { TickPort } from '../../domain/ports/inbound/TickPort';
import type { PauseGamePort } from '../../domain/ports/inbound/PauseGamePort';
import type { FinishGamePort } from '../../domain/ports/inbound/FinishGamePort';
import type { GetQuestionPort } from '../../domain/ports/inbound/GetQuestionPort';
import type { GetGameResultPort } from '../../domain/ports/inbound/GetGameResultPort';
import StorageAdapter from '../adapters/outbound/storage/StorageAdapter';
import { LocalStorageGameRepository } from '../adapters/outbound/storage/LocalStorageGameRepository';
import { JsonQuestionRepository } from '../adapters/outbound/data/JsonQuestionRepository';
import { CreateGameUseCase } from '../../application/usecases/CreateGameUseCase';
import { StartTurnUseCase } from '../../application/usecases/StartTurnUseCase';
import { AnswerUseCase } from '../../application/usecases/AnswerUseCase';
import { SubmitAnswerUseCase } from '../../application/usecases/SubmitAnswerUseCase';
import { TickUseCase } from '../../application/usecases/TickUseCase';
import { PauseGameUseCase } from '../../application/usecases/PauseGameUseCase';
import { FinishGameUseCase } from '../../application/usecases/FinishGameUseCase';
import { GetQuestionUseCase } from '../../application/usecases/GetQuestionUseCase';
import { GetGameResultUseCase } from '../../application/usecases/GetGameResultUseCase';

// Adaptadores de salida
export const gameRepository: GameRepositoryPort = new LocalStorageGameRepository(new StorageAdapter());
const questionRepository: QuestionRepositoryPort = new JsonQuestionRepository();

// Casos de uso, expuestos a través de sus puertos de entrada
export const getQuestionUseCase: GetQuestionPort = new GetQuestionUseCase(questionRepository);
export const createGameUseCase: CreateGamePort = new CreateGameUseCase(questionRepository);
export const startTurnUseCase: StartTurnPort = new StartTurnUseCase();
export const answerUseCase: AnswerPort = new AnswerUseCase();
export const submitAnswerUseCase: SubmitAnswerPort = new SubmitAnswerUseCase(getQuestionUseCase, answerUseCase);
export const tickUseCase: TickPort = new TickUseCase();
export const pauseGameUseCase: PauseGamePort = new PauseGameUseCase();
export const finishGameUseCase: FinishGamePort = new FinishGameUseCase();
export const getGameResultUseCase: GetGameResultPort = new GetGameResultUseCase();
