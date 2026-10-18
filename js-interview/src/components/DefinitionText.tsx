import { RichText } from './RichText'

/**
 * Текст «ідеального визначення». Зазвичай це один абзац, але якщо в
 * тексті є переноси рядка, кожен рядок стає окремим блоком, а рядки,
 * що починаються з «• », — пунктами списку (наприклад, фази event loop).
 */
export function DefinitionText({ text }: { text: string }) {
  const className = 'text-[15px] font-medium leading-7 text-slate-800 dark:text-slate-100'

  if (!text.includes('\n')) {
    return (
      <p className={className}>
        <RichText text={text} />
      </p>
    )
  }

  // групуємо послідовні «• »-рядки в один список
  const blocks: ({ kind: 'p'; text: string } | { kind: 'ul'; items: string[] })[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('• ')) {
      const last = blocks.at(-1)
      if (last?.kind === 'ul') last.items.push(line.slice(2))
      else blocks.push({ kind: 'ul', items: [line.slice(2)] })
    } else {
      blocks.push({ kind: 'p', text: line })
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>
            <RichText text={b.text} />
          </p>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-5 marker:text-indigo-400">
            {b.items.map((item, j) => (
              <li key={j}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
