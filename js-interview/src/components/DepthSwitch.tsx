import { DEPTHS, type Depth } from '../types'

type Props = {
  depth: Depth
  onChange: (d: Depth) => void
}

/**
 * Перемикач глибини розкриття теми. Вибір спільний для всього сайту
 * і зберігається в localStorage — щоб не перемикати на кожній темі.
 */
export function DepthSwitch({ depth, onChange }: Props) {
  const active = DEPTHS.find((d) => d.key === depth)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900/60">
        <span className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Глибина
        </span>
        {DEPTHS.map((d) => (
          <button
            key={d.key}
            onClick={() => onChange(d.key)}
            title={d.hint}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              d.key === depth
                ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:bg-slate-800 dark:text-indigo-300 dark:ring-indigo-900'
                : 'text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/70'
            }`}
          >
            <span>{d.icon}</span>
            {d.label}
          </button>
        ))}
      </div>
      {active && (
        <p className="px-1 text-xs text-slate-400 dark:text-slate-500">
          {active.hint}
        </p>
      )}
    </div>
  )
}
