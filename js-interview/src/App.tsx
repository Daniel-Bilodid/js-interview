import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import { tabs, getTab } from './data'
import type { Depth, Tab } from './types'
import { Sidebar } from './components/Sidebar'
import { TopicView } from './components/TopicView'
import { PracticeView } from './components/PracticeView'
import { useLocalStorage, useStringSet } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'

function Header({
  theme,
  onToggleTheme,
}: {
  theme: string
  onToggleTheme: () => void
}) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Prep
          </span>
        </div>
        <nav className="flex gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.key}
              to={`/${t.key}`}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                ].join(' ')
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={onToggleTheme}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        title="Перемкнути тему"
      >
        {theme === 'dark' ? '☀️ Світла' : '🌙 Темна'}
      </button>
    </header>
  )
}

function Welcome({
  tab,
  learnedSet,
}: {
  tab: Tab
  learnedSet: Set<string>
}) {
  if (tab.topics.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-4xl">🚧</span>
        <p className="max-w-sm text-slate-500 dark:text-slate-400">
          Розділ «{tab.label}» поки що порожній. Контент буде додано пізніше.
        </p>
      </div>
    )
  }

  const learned = tab.topics.filter((t) => learnedSet.has(t.id)).length
  const firstUnlearned =
    tab.topics.find((t) => !learnedSet.has(t.id)) ?? tab.topics[0]
  const started = learned > 0

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="text-5xl">🧠</span>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {tab.label}: підготовка до співбесіди
        </h1>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          {started
            ? `Вивчено ${learned} з ${tab.topics.length} тем. Так тримати!`
            : `${tab.topics.length} тем із поясненнями простими словами, прикладами коду та підводними каменями.`}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/${tab.key}/${firstUnlearned.id}`}
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
        >
          {started ? 'Продовжити навчання →' : 'Почати навчання →'}
        </Link>
        <Link
          to={`/${tab.key}/practice`}
          className="rounded-full border border-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/30"
        >
          🎯 Самоперевірка
        </Link>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-600">
        або оберіть тему зі списку ліворуч
      </p>
    </div>
  )
}

function TabLayout({
  learnedSet,
  toggleLearned,
  dark,
  depth,
  setDepth,
}: {
  learnedSet: Set<string>
  toggleLearned: (id: string) => void
  dark: boolean
  depth: Depth
  setDepth: (d: Depth) => void
}) {
  const { lang, topicId } = useParams()
  const tab = getTab(lang ?? '')

  if (!tab) return <Navigate to="/javascript" replace />

  const practice = topicId === 'practice'
  const topic =
    topicId && !practice ? tab.topics.find((t) => t.id === topicId) : undefined
  // на мобільному показуємо або список тем, або контент — не обидва
  const showContent = Boolean(topic || practice)

  return (
    <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
      <div
        className={`h-full overflow-hidden md:block ${showContent ? 'hidden' : ''}`}
      >
        <Sidebar
          tab={tab}
          learnedSet={learnedSet}
          onToggleLearned={toggleLearned}
        />
      </div>
      <main
        className={`h-full overflow-hidden bg-white dark:bg-slate-950 md:block ${
          showContent ? '' : 'hidden'
        }`}
      >
        {practice ? (
          <PracticeView
            tab={tab}
            learnedSet={learnedSet}
            onToggleLearned={toggleLearned}
            depth={depth}
            onChangeDepth={setDepth}
          />
        ) : topic ? (
          <TopicView
            tab={tab}
            topic={topic}
            learned={learnedSet.has(topic.id)}
            onToggleLearned={toggleLearned}
            dark={dark}
            depth={depth}
            onChangeDepth={setDepth}
          />
        ) : (
          <Welcome tab={tab} learnedSet={learnedSet} />
        )}
      </main>
    </div>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()
  const { set: learnedSet, toggle: toggleLearned } = useStringSet('learned')
  // глибина розкриття тем — спільна для сайту, памʼятається між сесіями
  const [depth, setDepth] = useLocalStorage<Depth>('depth', 'learn')
  const dark = theme === 'dark'

  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Header theme={theme} onToggleTheme={toggle} />
        <Routes>
          <Route path="/" element={<Navigate to="/javascript" replace />} />
          <Route
            path="/:lang"
            element={
              <TabLayout
                learnedSet={learnedSet}
                toggleLearned={toggleLearned}
                dark={dark}
                depth={depth}
                setDepth={setDepth}
              />
            }
          />
          <Route
            path="/:lang/:topicId"
            element={
              <TabLayout
                learnedSet={learnedSet}
                toggleLearned={toggleLearned}
                dark={dark}
                depth={depth}
                setDepth={setDepth}
              />
            }
          />
          <Route path="*" element={<Navigate to="/javascript" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
