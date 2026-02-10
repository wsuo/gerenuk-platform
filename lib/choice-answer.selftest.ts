import { isChoiceAnswerCorrect, normalizeChoiceAnswer } from './choice-answer'

function assertEqual(actual: any, expected: any, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg}\n  expected: ${expected}\n  actual:   ${actual}`)
  }
}

function assertTrue(val: any, msg: string) {
  if (!val) throw new Error(msg)
}

function main() {
  assertEqual(normalizeChoiceAnswer(''), '', '空答案应归一化为空字符串')
  assertEqual(normalizeChoiceAnswer('ca'), 'AC', '应忽略顺序并排序')
  assertEqual(normalizeChoiceAnswer('A,C,D'), 'ACD', '应忽略分隔符并排序')
  assertEqual(normalizeChoiceAnswer('ABBA'), 'AB', '应去重')

  assertTrue(isChoiceAnswerCorrect('CA', 'AC'), 'CA 与 AC 应视为相同')
  assertTrue(!isChoiceAnswerCorrect('A', 'AC'), '少选应判错')
  assertTrue(!isChoiceAnswerCorrect('ABC', 'AC'), '多选应判错')

  // eslint-disable-next-line no-console
  console.log('✓ choice-answer 基础校验通过')
}

main()

