import type { ReactNode } from 'react'

/**
 * Автоматично підсвічує код усередині звичайного тексту:
 * ключові слова JS/TS/React, виклики функцій (fn()), ланцюжки
 * з крапкою (Array.isArray) та оператори (===, =>, ?? ...).
 * Завдяки цьому пояснення читаються як хороша документація.
 */

const KEYWORDS = new Set([
  // JS: значення та ключові слова
  'null', 'undefined', 'NaN', 'Infinity', 'true', 'false', 'this',
  'typeof', 'instanceof', 'new', 'delete', 'in', 'of',
  'async', 'await', 'yield', 'return', 'throw',
  'var', 'let', 'const', 'class', 'extends', 'super', 'constructor',
  'prototype', 'arguments', 'import', 'export', 'default', 'require',
  'try', 'catch', 'finally', 'switch', 'case',
  // типи-примітиви
  'string', 'number', 'boolean', 'bigint', 'symbol', 'object', 'function',
  // вбудовані обʼєкти
  'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef', 'Symbol',
  'BigInt', 'Proxy', 'Reflect', 'JSON', 'Object', 'Array', 'String',
  'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Math',
  'Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError',
  'globalThis', 'window', 'document', 'console',
  // таймери та браузерні API
  'setTimeout', 'setInterval', 'setImmediate', 'clearTimeout',
  'clearInterval', 'queueMicrotask', 'requestAnimationFrame', 'fetch',
  'XMLHttpRequest', 'localStorage', 'sessionStorage', 'addEventListener',
  'removeEventListener', 'MutationObserver', 'IntersectionObserver',
  'ResizeObserver', 'AbortController', 'FormData', 'URLSearchParams',
  'structuredClone', 'eval', 'WebSocket', 'Worker',
  // React
  'useState', 'useEffect', 'useLayoutEffect', 'useMemo', 'useCallback',
  'useRef', 'useContext', 'useReducer', 'useTransition',
  'useDeferredValue', 'useId', 'useSyncExternalStore', 'useOptimistic',
  'props', 'state', 'ref', 'refs', 'key', 'children', 'setState',
  'render', 'memo', 'forwardRef', 'createContext', 'createPortal',
  'StrictMode', 'Suspense', 'Fragment', 'ErrorBoundary',
  // TypeScript
  'any', 'unknown', 'never', 'void', 'interface', 'enum', 'namespace',
  'declare', 'readonly', 'keyof', 'infer', 'satisfies', 'as', 'is',
  'type', 'generic', 'Partial', 'Required', 'Pick', 'Omit', 'Record',
  'Readonly', 'Exclude', 'Extract', 'ReturnType', 'Awaited',
  'NonNullable', 'Parameters', 'tsconfig',
])

// слова-кандидати (латиниця), ланцюжки з крапкою, виклики fn() та оператори
const TOKEN_RE =
  /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$#][\w$]*)+(?:\(\))?|\.[a-z][\w$]*(?:\(\))?|[A-Za-z_$][\w$]*(?:\(\))?|===|!==|==|!=|=>|\?\?=?|\?\.|&&|\|\|=?|\.\.\./g

function isCodeToken(token: string): boolean {
  if (!/^[A-Za-z_$.]/.test(token)) return true // оператори
  if (token.includes('(')) return true // виклики: fn()
  if (token.includes('.')) return true // ланцюжки: obj.prop, .then
  if (KEYWORDS.has(token)) return true
  if (/[a-z][A-Z]/.test(token)) return true // camelCase: getBoundingClientRect
  return false
}

export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0

  for (const m of text.matchAll(TOKEN_RE)) {
    const token = m[0]
    if (!isCodeToken(token)) continue
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <code
        key={m.index}
        className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-rose-600 dark:bg-slate-800 dark:text-rose-400"
      >
        {token}
      </code>,
    )
    last = m.index + token.length
  }
  parts.push(text.slice(last))

  return <>{parts}</>
}
