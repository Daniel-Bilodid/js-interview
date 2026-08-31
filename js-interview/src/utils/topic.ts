import type { Depth, RelatedNote, Topic } from '../types'
import { toParagraphs } from './text'

/**
 * Що саме показувати для теми на обраному рівні глибини.
 *
 *   🔁 refresh — визначення + senior-нюанси
 *   📖 learn   — плюс пояснення простими словами і приклади коду
 *   🌱 deep    — плюс «навіщо це існує» і супутні теми
 *
 * Теми старого формату (description + gotchas) підставляються автоматично:
 * description грає роль simple, gotchas — роль seniorNotes. Якщо власного
 * definition немає, на рівні «Повторення» ним стає перший абзац опису.
 */
export type TopicSections = {
  definition?: string
  why?: string
  simple?: string
  related: RelatedNote[]
  seniorNotes: string[]
  codeExamples: Topic['codeExamples']
}

export function sectionsFor(topic: Topic, depth: Depth): TopicSections {
  const simple = topic.simple ?? topic.description ?? ''
  const short = depth === 'refresh'
  const full = depth === 'deep'

  return {
    // у старих тем визначення окремо немає — беремо перший абзац опису,
    // але лише в режимі повторення, щоб не дублювати текст нижче
    definition: topic.definition ?? (short ? toParagraphs(simple)[0] : undefined),
    why: full ? topic.why : undefined,
    simple: short ? undefined : simple || undefined,
    related: full ? (topic.related ?? []) : [],
    seniorNotes: topic.seniorNotes ?? topic.gotchas ?? [],
    codeExamples: short ? [] : topic.codeExamples,
  }
}
