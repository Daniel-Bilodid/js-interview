import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { Tab } from '../types'
import { ProgressBar } from './ProgressBar'

type Props = {
  tab: Tab
  learnedSet: Set<string>
  onToggleLearned: (id: string) => void
}

export function Sidebar({ tab, learnedSet, onToggleLearned }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tab.topics
    // шукаємо по всіх текстових полях теми — обох форматів
    return tab.topics.filter((t) =>
      [t.title, t.definition, t.why, t.simple, t.description]
        .filter(Boolean)
        .some((text) => text!.toLowerCase().includes(q)),
    )
  }, [tab.topics, query])

  const learnedInTab = tab.topics.filter((t) => learnedSet.has(t.id)).length

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="space-y-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <ProgressBar learned={learnedInTab} total={tab.topics.length} />
        {tab.topics.length > 0 && (
          <NavLink
            to={`/${tab.key}/practice`}
            className={({ isActive }) =>
              [
                'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')
            }
          >
            🎯 Самоперевірка
          </NavLink>
        )}
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук по темах…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Очистити"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <nav className="thin-scroll flex-1 overflow-y-auto p-2">
        {tab.topics.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-slate-400">
            Теми скоро зʼявляться 🚧
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-slate-400">
            Нічого не знайдено
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((topic) => {
              const learned = learnedSet.has(topic.id)
              return (
                <li key={topic.id}>
                  <div className="group flex items-center gap-2.5 rounded-lg px-2.5 transition hover:bg-slate-200/60 dark:hover:bg-slate-800/70">
                    <input
                      type="checkbox"
                      checked={learned}
                      onChange={() => onToggleLearned(topic.id)}
                      title="Позначити як вивчено"
                      className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-500"
                    />
                    <NavLink
                      to={`/${tab.key}/${topic.id}`}
                      className={({ isActive }) =>
                        [
                          'relative flex-1 rounded-lg py-2 pl-3 pr-1 text-sm leading-snug transition',
                          isActive
                            ? 'bg-indigo-50 font-semibold text-indigo-700 before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : 'text-slate-700 dark:text-slate-300',
                          learned ? 'text-slate-400 line-through decoration-slate-400/50 dark:text-slate-500' : '',
                        ].join(' ')
                      }
                    >
                      {topic.title}
                    </NavLink>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </aside>
  )
}
