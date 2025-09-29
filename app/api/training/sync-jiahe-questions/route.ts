import { NextRequest, NextResponse } from 'next/server'
import { questionSetDB, questionDB } from '@/lib/database'
import { jiaheInterviewQuestionDB } from '@/lib/jiahe-interview-db'
import { JIAHE_INTERVIEW_SET_NAME } from '@/lib/jiahe-interview-constants'

/**
 * 同步嘉禾面试题库题目数量到现有考试系统
 * POST /api/training/sync-jiahe-questions
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[嘉禾面试] 开始同步题目到现有考试系统...')
    
    // 1. 获取嘉禾面试题目总数
    const jiaheQuestions = await jiaheInterviewQuestionDB.findAll()
    const totalQuestions = jiaheQuestions.length
    
    console.log(`发现 ${totalQuestions} 道嘉禾面试题目`)
    
    // 2. 查找现有的嘉禾面试题库
    const questionSets = await questionSetDB.findAll()
    const jiaheSet = questionSets.find(set => set.name === JIAHE_INTERVIEW_SET_NAME)
    
    if (!jiaheSet) {
      return NextResponse.json(
        { 
          success: false, 
          message: '未找到嘉禾面试题库，请先运行集成脚本'
        },
        { status: 404 }
      )
    }
    
    console.log(`找到嘉禾面试题库: ${jiaheSet.name}, ID: ${jiaheSet.id}, 当前题目数: ${jiaheSet.total_questions}`)
    
    // 3. 清空现有的嘉禾面试题目（在question表中）
    await questionDB.deleteBySetId(jiaheSet.id!)
    console.log('清空现有题目完成')
    
    // 4. 将嘉禾题目转换并插入到question表
    const convertedQuestions = jiaheQuestions.map(q => ({
      set_id: jiaheSet.id!,
      question_number: q.question_number,
      section: q.section, // 'logic' 或 'personality'
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer || (q.section === 'logic' ? 'A' : ''), // 性格测试无标准答案
      explanation: q.personality_type ? `性格类型: ${q.personality_type}` : ''
    }))
    
    // 批量插入题目
    for (const question of convertedQuestions) {
      await questionDB.insertQuestion(question)
    }
    
    console.log(`导入 ${convertedQuestions.length} 道题目到现有系统`)
    
    // 5. 更新题库的题目数量
    await questionSetDB.updateQuestionSet(jiaheSet.id!, { total_questions: totalQuestions })
    console.log(`更新题库题目数量为: ${totalQuestions}`)
    
    return NextResponse.json({
      success: true,
      message: '嘉禾面试题目同步成功',
      data: {
        setId: jiaheSet.id,
        setName: jiaheSet.name,
        oldQuestionCount: jiaheSet.total_questions,
        newQuestionCount: totalQuestions,
        logicQuestions: jiaheQuestions.filter(q => q.section === 'logic').length,
        personalityQuestions: jiaheQuestions.filter(q => q.section === 'personality').length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 题目同步失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '题目同步失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取题目同步状态
 * GET /api/training/sync-jiahe-questions
 */
export async function GET(request: NextRequest) {
  try {
    // 获取嘉禾面试题目数量
    const jiaheQuestions = await jiaheInterviewQuestionDB.findAll()
    
    // 查找现有的嘉禾面试题库
    const questionSets = await questionSetDB.findAll()
    const jiaheSet = questionSets.find(set => set.name === JIAHE_INTERVIEW_SET_NAME)
    
    // 获取现有题目数量
    let currentQuestions = 0
    if (jiaheSet) {
      const questions = await questionDB.findBySetId(jiaheSet.id!)
      currentQuestions = questions.length
    }
    
    return NextResponse.json({
      success: true,
      data: {
        jiaheQuestionCount: jiaheQuestions.length,
        currentQuestionCount: currentQuestions,
        setExists: Boolean(jiaheSet),
        setInfo: jiaheSet ? {
          id: jiaheSet.id,
          name: jiaheSet.name,
          totalQuestions: jiaheSet.total_questions
        } : null,
        needsSync: jiaheSet ? (jiaheQuestions.length !== currentQuestions) : false,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 获取同步状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取同步状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}