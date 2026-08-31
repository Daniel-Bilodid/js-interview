#!/usr/bin/env node
/**
 * Перевіряє теми у src/data на відповідність формату.
 *
 *   npm run check:topics              — перевірити всі вкладки
 *   npm run check:topics -- rn-lists  — перевірити конкретні теми за id
 *
 * Теми старого формату (description + gotchas) перевіряються лише на
 * унікальність id. Повні правила застосовуються до тем, у яких є definition.
 */
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src/data')

/** файл даних → назва масиву порядку в index.ts (null = порядок за файлом) */
const FILES = {
  'javascript.ts': 'JS_ORDER',
  'typescript.ts': 'TS_ORDER',
  'react.ts': 'REACT_ORDER',
  'reactnative.ts': 'RN_ORDER',
  'architecture.ts': null,
}

const LIMITS = {
  definition: { sentences: [2, 5], chars: [250, 750] },
  why: { sentences: [1, 4], chars: [120, 500] },
  simple: { sentences: [6, 14], chars: [600, 1600] },
  related: { count: [2, 4], titleChars: [4, 70], textChars: [120, 550] },
  codeExamples: { count: [1, 3], labelChars: [4, 70], lines: [3, 45] },
  seniorNotes: { count: [4, 6], chars: [80, 400] },
}

/** Штампи, що не несуть інформації — у тексті тем їх бути не повинно. */
const FILLER = [
  'дуже важливо',
  'варто зазначити',
  'слід зауважити',
  'як відомо',
  'у сучасному світі',
  'не секрет',
  'потрібно розуміти, що це важливо',
  'це дуже потужний',
  'простими словами кажучи',
]

const errors = []
const warnings = []
const err = (id, msg) => errors.push(`${id}: ${msg}`)
const warn = (id, msg) => warnings.push(`${id}: ${msg}`)

const sentences = (t) =>
  t.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 3).length

function inRange(value, [min, max]) {
  return value >= min && value <= max
}

/**
 * Дані лежать у .ts, але це чисті літерали з єдиним type-only імпортом.
 * Прибираємо типи й імпортуємо як звичайний модуль.
 */
async function loadTopics(file) {
  const src = readFileSync(join(DATA, file), 'utf8')
    .replace(/^import type .*$/gm, '')
    .replace(/:\s*Topic\[\]\s*=/, ' =')
  const dir = mkdtempSync(join(tmpdir(), 'topics-'))
  const tmp = join(dir, file.replace(/\.ts$/, '.mjs'))
  writeFileSync(tmp, src)
  try {
    const mod = await import(pathToFileURL(tmp).href)
    return Object.values(mod)[0]
  } finally {
    unlinkSync(tmp)
  }
}

/** Витягує id з масивів *_ORDER у index.ts. */
function loadOrders() {
  const src = readFileSync(join(DATA, 'index.ts'), 'utf8')
  const orders = {}
  for (const m of src.matchAll(/const (\w+_ORDER) = \[([\s\S]*?)\n\]/g)) {
    orders[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])
  }
  return orders
}

function checkProse(id, field, text) {
  const limit = LIMITS[field]
  if (text.includes('\n')) {
    err(id, `${field}: має бути одним рядком без переносів — абзаци робить toParagraphs()`)
  }
  if (/\*\*|^\s*[-*]\s|`/m.test(text)) {
    err(id, `${field}: без markdown — RichText підсвічує код сам`)
  }
  if (text.includes("'") || text.includes('’')) {
    warn(id, `${field}: апостроф має бути ʼ (U+02BC), інакше рядок ламає лапки`)
  }
  const s = sentences(text)
  if (!inRange(s, limit.sentences)) {
    err(id, `${field}: ${s} речень, треба ${limit.sentences.join('-')}`)
  }
  if (!inRange(text.length, limit.chars)) {
    err(id, `${field}: ${text.length} символів, треба ${limit.chars.join('-')}`)
  }
  const found = FILLER.find((f) => text.toLowerCase().includes(f))
  if (found) err(id, `${field}: штамп «${found}» — заміни на конкретику`)
}

function checkTopic(topic, file, orders) {
  const { id } = topic
  if (!id) return err(file, 'тема без id')
  if (!/^[a-z0-9-]+$/.test(id)) err(id, 'id тільки латиниця в нижньому регістрі й дефіси')
  if (id === 'practice') err(id, 'id "practice" зарезервований під роут самоперевірки')

  if (!topic.title) err(id, 'немає title')

  // старий формат (description + gotchas) — повні правила не застосовуємо
  if (!topic.definition) {
    if (!topic.description) err(id, 'немає ні definition, ні description')
    return
  }

  if (!inRange(topic.title.length, [20, 150]))
    err(id, `title: ${topic.title.length} символів, треба 20-150`)
  // питання або пряме прохання інтервʼюера — обидва формулювання нормальні
  if (!topic.title.includes('?') && !/^(Розкажи|Поясни|Опиши|Порівняй)/.test(topic.title))
    warn(id, 'title краще формулювати як питання інтервʼюера')

  for (const field of ['definition', 'why', 'simple']) {
    if (!topic[field]) err(id, `немає поля ${field}`)
    else checkProse(id, field, topic[field])
  }

  const rel = topic.related ?? []
  if (!inRange(rel.length, LIMITS.related.count))
    err(id, `related: ${rel.length}, треба ${LIMITS.related.count.join('-')}`)
  rel.forEach((r, i) => {
    if (!inRange((r.title ?? '').length, LIMITS.related.titleChars))
      err(id, `related[${i}].title: ${r.title?.length ?? 0} символів, треба ${LIMITS.related.titleChars.join('-')}`)
    if (!inRange((r.text ?? '').length, LIMITS.related.textChars))
      err(id, `related[${i}].text: ${r.text?.length ?? 0} символів, треба ${LIMITS.related.textChars.join('-')}`)
    if (r.code !== undefined) err(id, `related[${i}]: поля code не існує, приклади йдуть у codeExamples`)
  })

  const ex = topic.codeExamples ?? []
  if (!inRange(ex.length, LIMITS.codeExamples.count))
    err(id, `codeExamples: ${ex.length}, треба ${LIMITS.codeExamples.count.join('-')}`)
  ex.forEach((e, i) => {
    if (!inRange((e.label ?? '').length, LIMITS.codeExamples.labelChars))
      err(id, `codeExamples[${i}].label: треба ${LIMITS.codeExamples.labelChars.join('-')} символів`)
    const lines = (e.code ?? '').split('\n').length
    if (!inRange(lines, LIMITS.codeExamples.lines))
      err(id, `codeExamples[${i}].code: ${lines} рядків, треба ${LIMITS.codeExamples.lines.join('-')}`)
  })

  const notes = topic.seniorNotes ?? []
  if (!inRange(notes.length, LIMITS.seniorNotes.count))
    err(id, `seniorNotes: ${notes.length}, треба ${LIMITS.seniorNotes.count.join('-')}`)
  notes.forEach((n, i) => {
    if (!inRange(n.length, LIMITS.seniorNotes.chars))
      err(id, `seniorNotes[${i}]: ${n.length} символів, треба ${LIMITS.seniorNotes.chars.join('-')} — нюанс має бути конкретним`)
    const found = FILLER.find((f) => n.toLowerCase().includes(f))
    if (found) err(id, `seniorNotes[${i}]: штамп «${found}»`)
  })

  if (topic.gotchas) warn(id, 'gotchas разом із seniorNotes — прибери gotchas, воно для старого формату')
  if (topic.description) warn(id, 'description разом із simple — прибери description, воно для старого формату')

  const orderName = FILES[file]
  if (orderName && !(orders[orderName] ?? []).includes(id))
    err(id, `id немає в ${orderName} (data/index.ts) — тема поїде в кінець вкладки`)
}

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const orders = loadOrders()
const seen = new Map()
let checked = 0

for (const file of Object.keys(FILES)) {
  const topics = await loadTopics(file)
  for (const topic of topics) {
    if (seen.has(topic.id)) err(topic.id, `дубль id — уже є в ${seen.get(topic.id)}`)
    else seen.set(topic.id, file)
    if (only.length && !only.includes(topic.id)) continue
    checkTopic(topic, file, orders)
    checked++
  }
}

for (const w of warnings) console.log(`  ⚠️  ${w}`)
for (const e of errors) console.log(`  ❌ ${e}`)

const scope = only.length ? only.join(', ') : `${seen.size} тем`
if (errors.length) {
  console.log(`\n❌ ${errors.length} помилок у форматі (перевірено: ${scope})`)
  process.exit(1)
}
console.log(`\n✅ Формат у порядку — перевірено ${checked} з ${seen.size} тем`)
