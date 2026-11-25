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

/**
 * Rosco circular responsivo. Todo se dimensiona en porcentaje del contenedor
 * (y la tipografía en cqw), así que los 25 círculos nunca se solapan:
 * diámetro 10.5 % vs. separación entre centros ≈ 11.2 %.
 */
export function Rosco({ letters, currentIndex, children }: RoscoProps) {
  const total = letters.length;
  const RADIUS = 44.5; // % del lado del contenedor

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
            style={{ left: `${left}%`, top: `${top}%` }}
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
