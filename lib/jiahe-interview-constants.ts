/**
 * 嘉禾面试测试的常量定义
 * 纯客户端文件，不包含任何服务器端代码
 */

// 嘉禾面试测试的特殊标识
export const JIAHE_INTERVIEW_CATEGORY_NAME = '江苏嘉禾植保面试测试'
export const JIAHE_INTERVIEW_SET_NAME = '嘉禾植保综合测评'

/**
 * 检查是否为嘉禾面试测试
 */
export function isJiaheInterviewCategory(categoryName: string): boolean {
  return categoryName === JIAHE_INTERVIEW_CATEGORY_NAME
}

export function isJiaheInterviewSet(setName: string): boolean {
  return setName === JIAHE_INTERVIEW_SET_NAME
}