/*
 * ФОРМАТ ТЕМИ
 *
 * Нові теми (React Native і далі) пишуться в розгорнутому форматі:
 *   definition   — ідеальне визначення, яке мав би дати senior
 *   why          — навіщо це існує, яку проблему вирішує
 *   simple       — пояснення простими словами, глибоко і без жаргону
 *   related      — супутні теми, без яких основна не розкривається
 *   codeExamples — приклади
 *   seniorNotes  — senior-нюанси
 *
 * Старі теми (javascript / typescript / react / architecture) написані в
 * короткому форматі: description + gotchas. Обидва формати живуть поруч —
 * компоненти підставляють description замість simple, а gotchas замість
 * seniorNotes, якщо нових полів немає.
 */

/** Наскільки глибоко розкривати тему. Обирає читач, зберігається в localStorage. */
export type Depth =
  | 'refresh' // 🔁 тему знаю — треба лише освіжити
  | 'learn' // 📖 тему знаю погано — треба розібратись
  | 'deep' // 🌱 бачу вперше — максимальне розкриття

export const DEPTHS: { key: Depth; icon: string; label: string; hint: string }[] =
  [
    {
      key: 'refresh',
      icon: '🔁',
      label: 'Повторення',
      hint: 'Тільки визначення і senior-нюанси — швидко освіжити перед співбесідою',
    },
    {
      key: 'learn',
      icon: '📖',
      label: 'Розібратись',
      hint: 'Плюс пояснення простими словами і приклади коду',
    },
    {
      key: 'deep',
      icon: '🌱',
      label: 'З нуля',
      hint: 'Усе: навіщо це існує, супутні теми, повний розбір',
    },
  ]

/** Супутня тема — те, без чого основна не розкривається до кінця. */
export type RelatedNote = {
  title: string
  text: string
}

export type Topic = {
  id: string
  title: string

  // ——— розгорнутий формат ———
  /** Ідеальне визначення, яке мав би дати senior. 2-4 речення, готове до озвучення. */
  definition?: string
  /** Навіщо це існує і яку проблему вирішує. Показується на рівні «З нуля». */
  why?: string
  /** Пояснення простими словами — глибоко, але без складних слів. */
  simple?: string
  /** Супутні теми. Показуються на рівні «З нуля». */
  related?: RelatedNote[]
  /** Senior-нюанси: те, що відрізняє senior від middle. */
  seniorNotes?: string[]

  // ——— короткий формат (наявні 111 тем) ———
  /** Стисле пояснення. Використовується як simple, якщо simple немає. */
  description?: string
  /** Підводні камені. Використовуються як seniorNotes, якщо тих немає. */
  gotchas?: string[]

  codeExamples: { label: string; code: string }[]
}

export type TabKey =
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'react-native'
  | 'architecture'

export type Tab = {
  key: TabKey
  label: string
  topics: Topic[]
}
