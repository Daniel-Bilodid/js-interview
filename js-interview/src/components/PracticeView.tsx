import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Tab, Topic } from '../types'
import { RichText } from './RichText'
import { toParagraphs } from '../utils/text'

type Props = {
  tab: Tab
  learnedSet: Set<string>
  onToggleLearned: (id: string) => void
}

type Mode = 'all' | 'unlearned'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function PracticeView({ tab, learnedSet, onToggleLearned }: Props) {
  const [mode, setMode] = useState<Mode | null>(null)
  const [queue, setQueue] = useState<Topic[]>([])
  const [total, setTotal] = useState(0)
  const [known, setKnown] = useState(0) // закриті картки
  const [repeats, setRepeats] = useState(0) // натискань «повторити»
  const [revealed, setRevealed] = useState(false)

  const unlearnedCount = tab.topics.filter((t) => !learnedSet.has(t.id)).length

  const start = useCallback(
    (m: Mode) => {
      const pool =
        m === 'unlearned'
          ? tab.topics.filter((t) => !learnedSet.has(t.id))
          : tab.topics
      setMode(m)
      setQueue(shuffle(pool))
      setTotal(pool.length)
      setKnown(0)
      setRepeats(0)
      setRevealed(false)
    },
    [tab.topics, learnedSet],
  )

  // при зміні вкладки — скидаємо тренування
  useEffect(() => {
    setMode(null)
    setQueue([])
  }, [tab.key])

  const current: Topic | undefined = queue[0]

  const know = useCallback(() => {
    setQueue((q) => q.slice(1))
    setKnown((k) => k + 1)
    setRevealed(false)
  }, [])

  const repeat = useCallback(() => {
    setQueue((q) => (q.length > 1 ? [...q.slice(1), q[0]] : q))
    setRepeats((r) => r + 1)
    setRevealed(false)
  }, [])

  // клавіатура: Space/Enter — показати, 1 — знав, 2 — повторити
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setRevealed(true)
      } else if (revealed && e.key === '1') {
        know()
      } else if (revealed && e.key === '2') {
        repeat()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealed, know, repeat])

  // ——— Стартовий екран ———
  if (mode === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl">🎯</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Самоперевірка: {tab.label}
          </h1>
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            Сайт показує питання, як на співбесіді. Спробуйте відповісти вголос
            своїми словами, потім відкрийте відповідь і чесно оцініть себе.
            Картки, які «не знав», повернуться в кінець колоди.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => start('all')}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
          >
            Усі теми ({tab.topics.length})
          </button>
          <button
            onClick={() => start('unlearned')}
            disabled={unlearnedCount === 0}
            className="rounded-full border border-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/30"
          >
            Лише невивчені ({unlearnedCount})
          </button>
        </div>
        <Link
          to={`/${tab.key}`}
          className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
        >
          ← назад до тем
        </Link>
      </div>
    )
  }

  // ——— Фінальний екран ———
  if (!current) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl">🎉</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Колоду пройдено!
          </h1>
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            {total} {total === 1 ? 'картка' : 'карток'} ·{' '}
            {repeats === 0
              ? 'усе з першої спроби — супер!'
              : `${repeats} раз(и) знадобилося повторення — поверніться до цих тем пізніше.`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => start(mode)}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
          >
            Ще раз 🔄
          </button>
          <Link
            to={`/${tab.key}`}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            До списку тем
          </Link>
        </div>
      </div>
    )
  }

  // ——— Картка ———
  const learned = learnedSet.has(current.id)

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10 sm:px-10">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span>
            🎯 Самоперевірка · {known + 1} з {total}
          </span>
          <Link
            to={`/${tab.key}`}
            className="normal-case tracking-normal hover:text-slate-600 dark:hover:text-slate-300"
          >
            завершити ✕
          </Link>
        </div>

        {/* Питання */}
        <div className="rounded-2xl border border-indigo-200/70 bg-linear-to-br from-indigo-50 to-white p-6 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-slate-900/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
            Питання
          </p>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            {current.title}
          </h1>
        </div>

        {!revealed ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Спершу відповідайте вголос — як інтервʼюеру
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Показати відповідь
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-600">
              або натисніть Space
            </p>
          </div>
        ) : (
          <>
            {/* Відповідь */}
            <div className="rounded-2xl border border-sky-200/70 bg-linear-to-br from-sky-50 to-white p-5 dark:border-sky-900/40 dark:from-sky-950/30 dark:to-slate-900/20">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                <span>💡</span> Відповідь
              </p>
              <div className="space-y-3">
                {toParagraphs(current.description).map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-7 text-slate-700 dark:text-slate-200"
                  >
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>

            {current.gotchas.length > 0 && (
              <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/15">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  <span>⚠️</span> Не забути про підводні камені
                </p>
                <ul className="list-disc space-y-1.5 pl-5">
                  {current.gotchas.map((g, i) => (
                    <li
                      key={i}
                      className="text-sm leading-6 text-slate-700 dark:text-slate-200"
                    >
                      <RichText text={g} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link
                to={`/${tab.key}/${current.id}`}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Відкрити тему з прикладами коду →
              </Link>
              <button
                onClick={() => onToggleLearned(current.id)}
                className={`text-xs transition ${
                  learned
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {learned ? '✓ вивчено' : '○ позначити вивченим'}
              </button>
            </div>

            {/* Оцінка себе */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={know}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
              >
                ✅ Знав
                <span className="mt-1 block text-xs font-normal opacity-60">
                  клавіша 1
                </span>
              </button>
              <button
                onClick={repeat}
                className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/60"
              >
                🔁 Повторити пізніше
                <span className="mt-1 block text-xs font-normal opacity-60">
                  клавіша 2
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
