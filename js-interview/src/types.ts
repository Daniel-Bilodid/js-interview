export type Topic = {
  id: string
  title: string
  description: string // пояснення простими словами
  codeExamples: { label: string; code: string }[] // 1-2 приклади
  gotchas: string[] // підводні камені та часті помилки
}

export type TabKey = 'javascript' | 'typescript' | 'react' | 'architecture'

export type Tab = {
  key: TabKey
  label: string
  topics: Topic[]
}
