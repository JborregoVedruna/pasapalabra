const DIACRITICS = /[̀-ͯ]/g;

/**
 * Normaliza una respuesta para compararla:
 * - sin distinguir mayúsculas y minúsculas,
 * - sin espacios sobrantes,
 * - sin tildes ni diéresis (á→a, ü→u), pero conservando la Ñ, que es otra letra.
 */
export function normalizeAnswer(text: string): string {
  return Array.from(text.normalize('NFC').trim().toLocaleLowerCase('es'))
    .map((ch) => (ch === 'ñ' ? ch : ch.normalize('NFD').replace(DIACRITICS, '')))
    .join('')
    .replace(/\s+/g, ' ');
}

export function isCorrectAnswer(input: string, expected: string): boolean {
  const given = normalizeAnswer(input);
  return given.length > 0 && given === normalizeAnswer(expected);
}
