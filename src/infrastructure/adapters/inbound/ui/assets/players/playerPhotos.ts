import type { PlayerId } from '../../../../../../domain/model/GameModel';
import topo from './topo.webp';
import bego from './bego.webp';

/**
 * Foto de cada jugador para el centro del rosco: sin fondo (transparente) y centrada en un
 * lienzo cuadrado de 520×520 cuyo círculo inscrito contiene la foto entera, sin recortes.
 */
export const PLAYER_PHOTOS: Record<PlayerId, string> = { topo, bego };
