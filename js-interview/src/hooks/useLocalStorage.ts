import { useCallback, useEffect, useState } from 'react'

/**
 * Стан, синхронізований із localStorage.
 * Зберігає значення під ключем і відновлює його при перезавантаженні.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* приватний режим / переповнення — ігноруємо */
    }
  }, [key, value])

  return [value, setValue] as const
}

/**
 * Зручний хук для зберігання множини id (напр. вивчені теми).
 */
export function useStringSet(key: string) {
  const [arr, setArr] = useLocalStorage<string[]>(key, [])
  const set = new Set(arr)

  const toggle = useCallback(
    (id: string) => {
      setArr((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return [...next]
      })
    },
    [setArr],
  )

  return { set, toggle }
}
