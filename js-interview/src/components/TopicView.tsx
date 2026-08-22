import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Tab, Topic } from '../types'
import { CodeBlock } from './CodeBlock'
import { RichText } from './RichText'
import { toParagraphs } from '../utils/text'

type Props = {
  tab: Tab
  topic: Topic
  learned: boolean
  onToggleLearned: (id: string) => void
  dark: boolean
}

function SectionHeader({
  icon,
  title,
  subtitle,
  tone,
}: {
  icon: string
  title: string
  subtitle?: string
  tone: 'sky' | 'amber'
}) {
  const toneMap = {
    sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
    amber:
      'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  }
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${toneMap[tone]}`}
      >
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

function LearnedButton({
  learned,
  onClick,
  big,
}: {
  learned: boolean
  onClick: () => void
  big?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 cursor-pointer select-none items-center gap-2 rounded-full border font-medium transition ${
        big ? 'px-6 py-2.5 text-base' : 'px-4 py-2 text-sm'
      } ${
        learned
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      <span>{learned ? '✓' : '○'}</span>
      {learned ? 'Вивчено' : 'Позначити вивченим'}
    </button>
  )
}

export function TopicView({ tab, topic, learned, onToggleLearned, dark }: Props) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLElement>(null)

  const index = tab.topics.findIndex((t) => t.id === topic.id)
  const prev = index > 0 ? tab.topics[index - 1] : undefined
  const next = index < tab.topics.length - 1 ? tab.topics[index + 1] : undefined

  const descParas = toParagraphs(topic.description)

  // при зміні теми повертаємо скрол нагору
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [topic.id])

  // навігація стрілками ← → між темами
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowLeft' && prev) navigate(`/${tab.key}/${prev.id}`)
      if (e.key === 'ArrowRight' && next) navigate(`/${tab.key}/${next.id}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, tab.key, navigate])

  return (
    <article ref={scrollRef} className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-10 sm:px-10">
        {/* Заголовок + опис */}
        <header className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {tab.label} · Тема {index + 1} з {tab.topics.length}
            </p>
            <Link
              to={`/${tab.key}`}
              className="text-xs text-slate-400 hover:text-slate-600 md:hidden dark:text-slate-500 dark:hover:text-slate-300"
            >
              ← всі теми
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              {topic.title}
            </h1>
            <LearnedButton
              learned={learned}
              onClick={() => onToggleLearned(topic.id)}
            />
          </div>

          <div className="rounded-2xl border border-sky-200/70 bg-linear-to-br from-sky-50 to-white p-5 dark:border-sky-900/40 dark:from-sky-950/30 dark:to-slate-900/20">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              <span>💡</span> Простими словами
            </p>
            <div className="space-y-3">
              {descParas.map((p, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-7 text-slate-700 dark:text-slate-200"
                >
                  <RichText text={p} />
                </p>
              ))}
            </div>
          </div>
        </header>

        {/* Приклади коду */}
        <section>
          <SectionHeader icon="💻" title="Приклади коду" tone="sky" />
          <div className="space-y-4">
            {topic.codeExamples.map((ex, i) => (
              <CodeBlock key={i} label={ex.label} code={ex.code} dark={dark} />
            ))}
          </div>
        </section>

        {/* Підводні камені */}
        <section>
          <SectionHeader
            icon="⚠️"
            title="Підводні камені"
            subtitle="часті помилки та каверзні запитання"
            tone="amber"
          />
          <ul className="space-y-2.5">
            {topic.gotchas.map((g, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-amber-200/70 bg-amber-50/50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/15"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                  <RichText text={g} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Підсумок + навігація */}
        <footer className="space-y-6 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex justify-center">
            <LearnedButton
              big
              learned={learned}
              onClick={() => onToggleLearned(topic.id)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                to={`/${tab.key}/${prev.id}`}
                className="group rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  ← Попередня
                </span>
                <span className="mt-1 block text-sm font-medium leading-snug text-slate-700 group-hover:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-300">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/${tab.key}/${next.id}`}
                className="group rounded-xl border border-slate-200 p-4 text-right transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Наступна →
                </span>
                <span className="mt-1 block text-sm font-medium leading-snug text-slate-700 group-hover:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-300">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-600">
            Підказка: гортайте теми стрілками ← → на клавіатурі
          </p>
        </footer>
      </div>
    </article>
  )
}
