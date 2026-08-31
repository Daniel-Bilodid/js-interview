import type { Tab, Topic } from '../types'
import { javascriptTopics } from './javascript'
import { typescriptTopics } from './typescript'
import { reactTopics } from './react'
import { reactNativeTopics } from './reactnative'
import { architectureTopics } from './architecture'

/*
 * Порядок тем «від простого до складного» — щоб вчити послідовно.
 * Нову тему можна просто додати в кінець масиву у файлі даних:
 * якщо її id немає у списку нижче, вона зʼявиться в кінці вкладки.
 */

// Логічний порядок вивчення: спочатку основи мови, далі функції та обʼєкти,
// потім асинхронність, мережа й наостанок інженерні теми.
const JS_ORDER = [
  // Основи: типи й порівняння
  'data-types',
  'null-undefined',
  'typeof-null',
  'object-equality',
  // Змінні, область видимості, замикання
  'var-let-const',
  'scope',
  'closures',
  'this',
  'call-apply-bind',
  // Робота з даними
  'destructuring',
  'spread',
  'spread-vs-rest',
  'array-methods',
  'reduce',
  'hof',
  'debounce-throttle',
  'object-vs-map',
  'garbage-collector',
  'weak-collections',
  // Обʼєкти, прототипи, ООП
  'getter-setter',
  'proxy-reflect',
  'object-creation',
  'prototype',
  'classes',
  'oop-principles',
  'solid',
  'design-patterns',
  // Асинхронність
  'event-loop',
  'micro-macro-tasks',
  'timers',
  'promise-generators',
  'promise-all-race',
  'async-await',
  'web-workers',
  // Браузер і події
  'event-delegation',
  'new-event',
  'web-storage',
  // Мережа
  'http',
  'ajax',
  'websocket',
  'soap',
  'webrtc',
  // Інше / інженерія
  'regexp',
  'big-o',
  'transpilation',
  'ci-cd',
]

const REACT_ORDER = [
  // Як React працює
  'virtual-dom',
  'element-vs-component',
  'state-vs-props',
  'rerender',
  // Компоненти та життєвий цикл
  'class-vs-function',
  'lifecycle-stages',
  'lifecycle-methods',
  // Хуки
  'hooks',
  'hooks-list',
  'usestate-lazy-init',
  'hooks-didmount-unmount',
  'useeffect-vs-uselayouteffect',
  'effects-three',
  'refs',
  'useref-values',
  'useimperativehandle',
  // Форми та події
  'controlled-uncontrolled',
  'synthetic-event',
  // Продуктивність
  'pure-function',
  'reconciliation',
  'memoization',
  'react-memo',
  'pure-components',
  'should-component-update',
  'batching',
  'usetransition',
  'usedeferredvalue',
  'lazy-suspense',
  // Стан застосунку
  'context-api',
  'hoc',
  'flux',
  'redux',
  'flow',
]

const TS_ORDER = [
  // Основи типів
  'ts-interface-vs-type',
  'ts-alias-vs-interface',
  'ts-enums',
  'ts-union-intersection',
  'ts-tuples',
  'ts-optional-required',
  'ts-index-signatures',
  'ts-readonly-vs-const',
  // Безпека типів
  'ts-any-vs-unknown',
  'ts-never',
  'ts-null-undefined-handling',
  'ts-type-narrowing',
  'ts-type-assertions',
  'ts-as-vs-angle-bracket',
  // Просунуті типи
  'ts-generics',
  'utility-types',
  'ts-keyof-typeof',
  'ts-mapped-types',
  'ts-conditional-types',
  'ts-function-overloads',
  // Класи та ООП
  'ts-inheritance-polymorphism',
  'ts-access-modifiers',
  'ts-decorators',
  // Організація коду й конфіг
  'ts-namespaces',
  'ts-ambient-declaration-merging',
  'ts-tsconfig',
  'ts-strict-mode',
]

// Від «що це взагалі таке» до внутрішньої будови й продуктивності.
// Нову тему достатньо дописати в reactnative.ts — без id у цьому списку
// вона стане в кінець вкладки.
const RN_ORDER = [
  // Що це і як влаштоване
  'rn-what-is',
  'rn-threads',
  'rn-bridge',
  'rn-new-architecture',
  'rn-hermes',
  // Рендер і верстка
  'rn-layout-yoga',
  // Практика
  'rn-lists',
  'rn-animations',
  'rn-native-modules',
  'rn-performance',
  'rn-deploy',
]

// Теми про TypeScript, які історично лежать у файлі javascript.ts —
// показуємо їх у вкладці TypeScript.
const MOVED_TO_TS = new Set(['utility-types', 'ts-access-modifiers'])

function orderTopics(topics: Topic[], order: string[]): Topic[] {
  const byId = new Map(topics.map((t) => [t.id, t]))
  const ordered = order.map((id) => byId.get(id)).filter((t): t is Topic => !!t)
  const rest = topics.filter((t) => !order.includes(t.id))
  return [...ordered, ...rest]
}

const jsTopics = javascriptTopics.filter((t) => !MOVED_TO_TS.has(t.id))
const tsTopics = [
  ...typescriptTopics,
  ...javascriptTopics.filter((t) => MOVED_TO_TS.has(t.id)),
]

export const tabs: Tab[] = [
  { key: 'javascript', label: 'JavaScript', topics: orderTopics(jsTopics, JS_ORDER) },
  { key: 'typescript', label: 'TypeScript', topics: orderTopics(tsTopics, TS_ORDER) },
  { key: 'react', label: 'React', topics: orderTopics(reactTopics, REACT_ORDER) },
  {
    key: 'react-native',
    label: 'React Native',
    topics: orderTopics(reactNativeTopics, RN_ORDER),
  },
  // порядок тем вкладки — порядок в architecture.ts
  { key: 'architecture', label: 'Архітектура', topics: architectureTopics },
]

export const getTab = (key: string): Tab | undefined =>
  tabs.find((t) => t.key === key)
