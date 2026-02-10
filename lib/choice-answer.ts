const CHOICE_ORDER = ['A', 'B', 'C', 'D'] as const
type ChoiceOption = (typeof CHOICE_ORDER)[number]

/**
 * 规范化选择题答案：
 * - 忽略空格、逗号等分隔符
 * - 只保留 A/B/C/D
 * - 去重
 * - 按 A-D 排序
 *
 * 示例：
 * - "ca" -> "AC"
 * - "A,C,D" -> "ACD"
 * - "" -> ""
 */
export function normalizeChoiceAnswer(input: string): string {
  if (!input) return ''
  const upper = String(input).toUpperCase()
  const set = new Set<ChoiceOption>()
  for (const ch of upper) {
    if (ch === 'A' || ch === 'B' || ch === 'C' || ch === 'D') {
      set.add(ch)
    }
  }
  return CHOICE_ORDER.filter((o) => set.has(o)).join('')
}

export function isChoiceAnswerCorrect(selected: string, correct: string): boolean {
  return normalizeChoiceAnswer(selected) === normalizeChoiceAnswer(correct)
}

