import type { ReactNode } from 'react';
import type { LetterStateModel } from '../../../domain/model/GameModel';

interface RoscoProps {
  letters: LetterStateModel[];
  currentIndex: number | null;
  /** Contenido del centro del rosco. */
  children?: ReactNode;
}

const STATUS_CLASS: Record<LetterStateModel['status'], string> = {
  pending: 'rosco-letter--pending',
  correct: 'rosco-letter--correct',
  incorrect: 'rosco-letter--incorrect',
};

/** Diámetro máximo de cada círculo, en % del lado del rosco. */
const MAX_SIZE = 10.5;
/** Hueco mínimo entre círculos vecinos, como fracción de la distancia entre centros. */
const GAP = 0.08;

/**
 * Rosco circular responsivo. Todo se dimensiona en porcentaje del contenedor
 * (y la tipografía en cqw). El tamaño de cada círculo se calcula a partir del
 * número de letras, así que nunca se solapan, sean 25 o 27.
 */
export function Rosco({ letters, currentIndex, children }: RoscoProps) {
  const total = letters.length;
  // Radio R y diámetro d (en %) tales que d = (1 - GAP) · 2πR / n y R + d/2 ≈ 49.5.
  const factor = ((1 - GAP) * 2 * Math.PI) / total;
  const size = Math.min(MAX_SIZE, (49.5 * factor) / (1 + factor / 2));
  const RADIUS = 49.5 - size / 2;

  return (
    <div className="rosco" aria-label="Rosco de letras">
      {letters.map((l, i) => {
        const angle = (2 * Math.PI * i) / total;
        const left = 50 + RADIUS * Math.sin(angle);
        const top = 50 - RADIUS * Math.cos(angle);
        const isCurrent = i === currentIndex;
        return (
          <div
            key={l.letter}
            className={`rosco-letter ${STATUS_CLASS[l.status]} ${isCurrent ? 'rosco-letter--current' : ''}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}%`,
              fontSize: `${size * 0.53}cqw`,
            }}
            aria-label={`Letra ${l.letter}: ${
              l.status === 'pending' ? 'pendiente' : l.status === 'correct' ? 'acertada' : 'fallada'
            }${isCurrent ? ' (en juego)' : ''}`}
          >
            {l.letter}
          </div>
        );
      })}
      <div className="rosco-center">{children}</div>
    </div>
  );
}
