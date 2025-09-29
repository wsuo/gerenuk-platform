import { NextRequest, NextResponse } from 'next/server'
import { replaceJiaheQuestionsWithRealContent, getQuestionReplacementStatus } from '@/scripts/replace-jiahe-questions'

/**
 * 替换嘉禾面试题目为真实内容
 * POST /api/jiahe-interview/replace-questions
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[嘉禾面试] 开始替换题目为真实内容...')
    
    const result = await replaceJiaheQuestionsWithRealContent()
    
    const status = await getQuestionReplacementStatus()
    
    return NextResponse.json({
      success: true,
      message: '嘉禾面试题目替换成功',
      data: {
        ...result,
        ...status,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 题目替换失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '题目替换失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取嘉禾面试题目替换状态
 * GET /api/jiahe-interview/replace-questions
 */
export async function GET(request: NextRequest) {
  try {
    const status = await getQuestionReplacementStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        ...status,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 获取题目替换状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取题目替换状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}