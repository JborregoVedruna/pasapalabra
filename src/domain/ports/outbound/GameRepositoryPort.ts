import type { GameStateModel, SettingsModel } from '../../model/GameModel';

export interface GameRepositoryPort {
  loadSettings(): SettingsModel;
  saveSettings(settings: SettingsModel): void;
  loadGame(): GameStateModel | null;
  saveGame(game: GameStateModel): void;
  clearGame(): void;
}
