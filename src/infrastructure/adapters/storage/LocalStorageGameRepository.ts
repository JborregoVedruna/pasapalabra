import {
  DEFAULT_SETTINGS,
  type GameStateModel,
  type SettingsModel,
} from '../../../domain/model/GameModel';
import type { GameRepositoryPort } from '../../../domain/ports/GameRepositoryPort';
import type { StoragePort } from '../../../domain/ports/StoragePort';

const SETTINGS_KEY = 'pasapalabra_settings';
const GAME_KEY = 'pasapalabra_game';

export class LocalStorageGameRepository implements GameRepositoryPort {
  private readonly storage: StoragePort;

  constructor(storage: StoragePort) {
    this.storage = storage;
  }

  loadSettings(): SettingsModel {
    const saved = this.storage.getItem<Partial<SettingsModel>>(SETTINGS_KEY);
    const time = saved?.timePerPlayer;
    return {
      timePerPlayer:
        typeof time === 'number' && time > 0 ? Math.round(time) : DEFAULT_SETTINGS.timePerPlayer,
      mode: saved?.mode === 'host' || saved?.mode === 'players' ? saved.mode : DEFAULT_SETTINGS.mode,
      questionSet:
        saved?.questionSet === 'default' || saved?.questionSet === 'custom'
          ? saved.questionSet
          : DEFAULT_SETTINGS.questionSet,
    };
  }

  saveSettings(settings: SettingsModel): void {
    this.storage.setItem(SETTINGS_KEY, settings);
  }

  loadGame(): GameStateModel | null {
    const game = this.storage.getItem<GameStateModel>(GAME_KEY);
    if (!game || !game.players?.topo || !game.players?.bego) return null;
    return game;
  }

  saveGame(game: GameStateModel): void {
    this.storage.setItem(GAME_KEY, game);
  }

  clearGame(): void {
    this.storage.removeItem(GAME_KEY);
  }
}
