/**
 * Розбиває суцільний текст на абзаци для читабельності.
 * Ділимо по кінцях речень, далі групуємо ~по 2 речення в абзац.
 */
export function toParagraphs(text: string, perPara = 2): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[А-ЯЇІЄҐA-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean)
  const paras: string[] = []
  for (let i = 0; i < sentences.length; i += perPara) {
    paras.push(sentences.slice(i, i + perPara).join(' '))
  }
  return paras
}
