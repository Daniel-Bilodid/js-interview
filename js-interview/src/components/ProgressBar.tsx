type Props = {
  learned: number
  total: number
}

export function ProgressBar({ learned, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((learned / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Прогрес</span>
        <span className="font-medium tabular-nums">
          {learned} / {total} · {pct}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
