import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { tabs } from '../data'

// з цієї ширини навігація стоїть у рядку; на 1024px і менше — бургер
const DESKTOP_QUERY = '(min-width: 1025px)'

type Props = {
  theme: string
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const burgerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) burgerRef.current?.focus()
  }, [])

  // при відкритті: фокус на активний пункт, Escape закриває, Tab не виходить за меню
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const links = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href]') ?? [])

    const active = panel?.querySelector<HTMLElement>('a[aria-current="page"]')
    ;(active ?? links()[0])?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = [burgerRef.current!, ...links()]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    // сторінка під меню не скролиться
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = prevOverflow
    }
  }, [open, close])

  // розширили вікно до десктопа — меню більше не потрібне
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <header className="relative z-40 flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Interview Prep
            </span>
          </div>
          <nav aria-label="Розділи" className="hidden gap-1 min-[1025px]:flex">
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

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            title="Перемкнути тему"
          >
            <span aria-hidden>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="max-sm:sr-only">
              {theme === 'dark' ? ' Світла' : ' Темна'}
            </span>
          </button>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            className="grid size-10 place-items-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 min-[1025px]:hidden"
          >
            <BurgerIcon open={open} />
          </button>
        </div>

        <div
          id={menuId}
          ref={panelRef}
          inert={!open}
          className={[
            'absolute inset-x-0 top-full border-b border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40 min-[1025px]:hidden',
            'transition-[clip-path,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            open
              ? 'opacity-100 [clip-path:inset(0_0_-3rem_0)]'
              : 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]',
          ].join(' ')}
        >
          <nav
            aria-label="Розділи"
            className="thin-scroll max-h-[calc(100dvh-4.5rem)] overflow-y-auto p-3"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {tabs.map((t, i) => (
                <li
                  key={t.key}
                  style={{ transitionDelay: open ? `${80 + i * 35}ms` : '0ms' }}
                  className={[
                    'transition duration-300 ease-out motion-reduce:transition-none',
                    open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
                  ].join(' ')}
                >
                  <NavLink
                    to={`/${t.key}`}
                    onClick={() => close(false)}
                    className={({ isActive }) =>
                      [
                        'group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={[
                              'size-1.5 rounded-full transition',
                              isActive
                                ? 'bg-indigo-500'
                                : 'bg-slate-300 group-hover:bg-slate-400 dark:bg-slate-700',
                            ].join(' ')}
                          />
                          {t.label}
                        </span>
                        <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">
                          {t.topics.length} тем
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* поза header: його backdrop-blur обмежив би fixed-елемент своїми межами */}
      <div
        aria-hidden
        onClick={() => close()}
        className={[
          'fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none min-[1025px]:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />
    </>
  )
}

// три лінії: при відкритті спершу сходяться в центр, потім повертаються в хрестик
function BurgerIcon({ open }: { open: boolean }) {
  const line =
    'absolute left-0 h-0.5 w-full rounded-full bg-current motion-reduce:transition-none'
  const outer = open
    ? '[transition:translate_150ms_ease-in,rotate_200ms_cubic-bezier(0.34,1.56,0.64,1)_150ms]'
    : '[transition:rotate_150ms_ease-in,translate_200ms_cubic-bezier(0.34,1.56,0.64,1)_150ms]'

  return (
    <span aria-hidden className="relative block h-3.5 w-5">
      <span
        className={`${line} top-0 ${outer} ${open ? 'translate-y-1.5 rotate-45' : ''}`}
      />
      <span
        className={`${line} top-1.5 transition-opacity duration-100 ${
          open ? 'opacity-0 delay-100' : 'opacity-100 delay-150'
        }`}
      />
      <span
        className={`${line} top-3 ${outer} ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
      />
    </span>
  )
}
