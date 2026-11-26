/**
 * Action de JavaScript sin dependencias: valida una pregunta y la añade a
 * customGameData.json en la lista de su jugador y letra.
 *
 * GitHub pasa cada input como variable de entorno INPUT_<NOMBRE EN MAYÚSCULAS>,
 * y las salidas y el resumen se escriben en los archivos GITHUB_OUTPUT y
 * GITHUB_STEP_SUMMARY. Así no hace falta @actions/core ni empaquetar nada.
 */
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const LETTERS = 'A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z'.split(' ');
const PLAYERS = { Topo: 'topo', Bego: 'bego' };
const TYPES = ['starts', 'contains'];

class ValidationError extends Error {}

/** Copia exacta: mismo tipo, misma pregunta y misma respuesta, carácter a carácter. */
const isSameQuestion = (a, b) => a.type === b.type && a.question === b.question && a.answer === b.answer;

/** Los inputs booleanos llegan como texto ("true" / "false"). */
const isTrue = (value) => ['true', '1', 'yes', 'si', 'sí'].includes(value.toLowerCase());

const getInput = (name) => (process.env[`INPUT_${name.toUpperCase()}`] ?? '').trim();

const setOutput = (name, value) => {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
};

const writeSummary = (markdown) => {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
};

/**
 * Mayúsculas y sin tildes ni diéresis, conservando la Ñ.
 * Mismo criterio que domain/services/AnswerMatcher.ts usa en el juego.
 */
const normalize = (text) =>
  Array.from(text.normalize('NFC').toLocaleUpperCase('es'))
    .map((ch) => (ch === 'Ñ' ? ch : ch.normalize('NFD').replace(/[̀-ͯ]/g, '')))
    .join('');

function validate({ para, tipo, letra, pregunta, respuesta }) {
  if (!(para in PLAYERS)) throw new ValidationError(`"Para" debe ser Topo o Bego (recibido: "${para}").`);
  if (!TYPES.includes(tipo)) throw new ValidationError(`"Tipo" debe ser starts o contains (recibido: "${tipo}").`);
  if (!LETTERS.includes(letra)) {
    throw new ValidationError(`"Letra" debe ser una de: ${LETTERS.join(' ')} (recibido: "${letra}").`);
  }
  if (!pregunta) throw new ValidationError('La pregunta no puede estar vacía.');
  if (!respuesta) throw new ValidationError('La respuesta no puede estar vacía.');
  if (/\s/.test(respuesta)) {
    throw new ValidationError(`La respuesta no puede contener espacios (recibido: "${respuesta}").`);
  }
  const norm = normalize(respuesta);
  if (tipo === 'starts' && !norm.startsWith(letra)) {
    throw new ValidationError(`Con tipo "starts", la respuesta "${respuesta}" debe empezar por ${letra}.`);
  }
  if (tipo === 'contains' && !norm.includes(letra)) {
    throw new ValidationError(`Con tipo "contains", la respuesta "${respuesta}" debe contener la ${letra}.`);
  }
}

/**
 * Lee la pregunta desde el JSON pegado, con el formato del correo:
 * { "to": "Bego", "letter": "X", "question": { "type": "contains", "question": "...", "answer": "..." } }
 */
function fromJson(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new ValidationError(`El JSON no es válido: ${error.message}`);
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new ValidationError('El JSON debe ser un objeto con "to", "letter" y "question".');
  }
  const { to, letter, question } = data;
  if (typeof question !== 'object' || question === null) {
    throw new ValidationError('Falta el objeto "question" con "type", "question" y "answer".');
  }
  const text_ = (value, field) => {
    if (typeof value !== 'string') throw new ValidationError(`Falta "${field}" o no es un texto.`);
    return value;
  };
  // "to" sin distinguir mayúsculas: "Bego", "bego" o "BEGO"
  const player = Object.keys(PLAYERS).find((name) => name.toLowerCase() === text_(to, 'to').trim().toLowerCase());
  return {
    para: player ?? text_(to, 'to').trim(),
    tipo: text_(question.type, 'question.type').trim(),
    letra: text_(letter, 'letter').trim().toLocaleUpperCase('es'),
    pregunta: text_(question.question, 'question.question'),
    respuesta: text_(question.answer, 'question.answer'),
  };
}

function readInput() {
  const json = getInput('json');
  const raw = json
    ? fromJson(json)
    : {
        para: getInput('para'),
        tipo: getInput('tipo'),
        letra: getInput('letra'),
        pregunta: getInput('pregunta'),
        respuesta: getInput('respuesta'),
      };
  console.log(json ? 'Origen: JSON pegado (se ignoran los campos del formulario).' : 'Origen: campos del formulario.');
  return {
    para: raw.para,
    tipo: raw.tipo,
    letra: raw.letra.normalize('NFC'),
    // Espacios repetidos o saltos de línea se quedan en un solo espacio
    pregunta: raw.pregunta.split(/\s+/).filter(Boolean).join(' '),
    respuesta: raw.respuesta.trim().normalize('NFC'),
  };
}

function run() {
  const input = readInput();
  const file = getInput('archivo') || 'src/infrastructure/adapters/outbound/data/customGameData.json';
  const defaultFile = getInput('archivo_default') || 'src/infrastructure/adapters/outbound/data/defaultGameData.json';
  const replace = isTrue(getInput('sustituir'));

  validate(input);

  // Mismo criterio que el resto de preguntas: sin punto final (salvo puntos suspensivos)
  let { pregunta } = input;
  if (pregunta.endsWith('.') && !pregunta.endsWith('...')) pregunta = pregunta.slice(0, -1).trimEnd();
  const { para, tipo, letra, respuesta } = input;

  const data = JSON.parse(readFileSync(file, 'utf8'));
  const playerId = PLAYERS[para];
  const letters = (data.questions[playerId] ??= {});
  const options = (letters[letra] ??= []);

  if (options.some((q) => normalize(q.question) === normalize(pregunta))) {
    throw new ValidationError(`Esa pregunta ya existe para ${para} en la letra ${letra}.`);
  }

  // Sustitución: solo si la letra tiene UNA pregunta y es una copia exacta de la del banco por defecto
  let replaced = null;
  let replaceNote = '';
  if (replace) {
    if (options.length !== 1) {
      replaceNote = `No se sustituye: la ${letra} de ${para} tiene ${options.length} preguntas, no una.`;
    } else {
      const defaults = JSON.parse(readFileSync(defaultFile, 'utf8')).questions?.[playerId]?.[letra] ?? [];
      if (defaults.some((q) => isSameQuestion(q, options[0]))) {
        replaced = options.splice(0, 1)[0];
        replaceNote = `Sustituida la copia de la pregunta por defecto: "${replaced.question}" → ${replaced.answer}`;
      } else {
        replaceNote = `No se sustituye: la pregunta actual de la ${letra} de ${para} no es una copia de la de por defecto.`;
      }
    }
    console.log(replaceNote);
  }

  options.push({ type: tipo, question: pregunta, answer: respuesta });

  // Letras en orden alfabético del rosco
  const ordered = {};
  for (const l of LETTERS) if (l in letters) ordered[l] = letters[l];
  for (const [l, v] of Object.entries(letters)) if (!(l in ordered)) ordered[l] = v;
  data.questions[playerId] = ordered;

  // Mismo formato que el archivo actual: 2 espacios y salto de línea final
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  const total = ordered[letra].length;
  console.log(`Añadida para ${para} en la ${letra} (${tipo}): "${pregunta}" → ${respuesta}`);
  console.log(`La ${letra} de ${para} tiene ahora ${total} pregunta(s).`);

  setOutput(
    'commit_message',
    replaced
      ? `Pregunta nueva para ${para} (${letra}): ${respuesta} (sustituye a ${replaced.answer})`
      : `Pregunta nueva para ${para} (${letra}): ${respuesta}`,
  );
  setOutput('total', String(total));
  setOutput('sustituida', String(Boolean(replaced)));

  const condicion = tipo === 'starts' ? 'Empieza por' : 'Contiene la';
  const cell = (text) => text.replaceAll('|', '\\|');
  writeSummary(
    `### ✅ Pregunta añadida\n\n| Para | Condición | Pregunta | Respuesta |\n|---|---|---|---|\n` +
      `| ${para} | ${condicion} ${letra} | ${cell(pregunta)} | ${cell(respuesta)} |\n\n` +
      (replace ? `${replaced ? '🔁' : 'ℹ️'} ${cell(replaceNote)}\n\n` : '') +
      `La ${letra} de ${para} tiene ahora **${total}** pregunta(s).\n`,
  );
}

try {
  run();
} catch (error) {
  // ::error:: lo muestra GitHub como anotación roja en la ejecución
  console.log(`::error::${error instanceof ValidationError ? error.message : `Error inesperado: ${error.message}`}`);
  process.exitCode = 1;
}
