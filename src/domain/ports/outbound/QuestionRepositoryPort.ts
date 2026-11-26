import type {
  PlayerId,
  PlayerModel,
  QuestionModel,
  QuestionSet,
  RoscoLetter,
} from '../../model/GameModel';

export interface QuestionRepositoryPort {
  getPlayers(): PlayerModel[];
  getPlayer(id: PlayerId): PlayerModel;
  /** Cuántas preguntas posibles hay para esa letra y jugador en el banco indicado. */
  countOptions(set: QuestionSet, player: PlayerId, letter: RoscoLetter): number;
  /** Una de las preguntas posibles de la letra (optionIndex se ajusta si queda fuera de rango). */
  getQuestion(set: QuestionSet, player: PlayerId, letter: RoscoLetter, optionIndex: number): QuestionModel;
}
