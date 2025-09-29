import { NextRequest, NextResponse } from 'next/server'
import { 
  jiaheInterviewQuestionDB, 
  jiaheInterviewRecordDB 
} from '@/lib/jiahe-interview-db'
import { 
  isJiaheInterviewSession,
  JIAHE_INTERVIEW_CONSTANTS 
} from '@/lib/jiahe-interview-config'
import { JiaheInterviewAnalyzer } from '@/lib/jiahe-interview-analyzer'

/**
 * 提交嘉禾面试测试答案
 * POST /api/jiahe-interview/submit
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const {
      sessionId,
      employeeName,
      startedAt,
      answers, // 格式: { questionId: selectedAnswer }
    } = await request.json()
    
    console.log(`[嘉禾面试] 收到答题提交:`, { 
      sessionId, 
      employeeName, 
      answersCount: Object.keys(answers).length
    })
    
    // 验证必要参数
    if (!sessionId || !employeeName || !startedAt || !answers) {
      return NextResponse.json(
        { success: false, message: '提交参数不完整' },
        { status: 400 }
      )
    }
    
    // 验证会话ID格式
    if (!isJiaheInterviewSession(sessionId)) {
      return NextResponse.json(
        { success: false, message: '无效的会话标识' },
        { status: 400 }
      )
    }
    
    // 获取所有题目
    const allQuestions = await jiaheInterviewQuestionDB.findAll()
    
    if (allQuestions.length === 0) {
      return NextResponse.json(
        { success: false, message: '题目数据不存在' },
        { status: 404 }
      )
    }
    
    // 分析答题结果
    const analysisStartTime = Date.now()
    
    const startTimeObj = new Date(startedAt)
    const endTimeObj = new Date()
    
    const completeResult = JiaheInterviewAnalyzer.generateCompleteResult(
      sessionId,
      employeeName.trim(),
      answers,
      allQuestions,
      startTimeObj,
      endTimeObj
    )
    
    console.log(`[嘉禾面试] 结果分析耗时: ${Date.now() - analysisStartTime}ms`)
    
    // 获取用户IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // 保存答题记录到数据库
    const dbStartTime = Date.now()
    
    const recordData = {
      employee_name: employeeName.trim(),
      logic_answers: JSON.stringify(answers), // 所有答案
      personality_answers: JSON.stringify(answers), // 同样的答案数据
      logic_results: JSON.stringify(completeResult.logicResult),
      personality_scores: JSON.stringify(completeResult.personalityResult.scores),
      main_characteristics: completeResult.personalityResult.dominantTypes
        .map(t => t.name)
        .join(', ') || '无明显特征',
      session_duration: completeResult.sessionDuration,
      completed_at: endTimeObj.toISOString(),
      ip_address: ip
    }
    
    const recordId = await jiaheInterviewRecordDB.insertRecord(recordData)
    console.log(`[嘉禾面试] 数据库写入耗时: ${Date.now() - dbStartTime}ms`)
    
    // 生成详细报告
    const detailedReport = JiaheInterviewAnalyzer.generateDetailedReport(completeResult)
    
    const totalTime = Date.now() - startTime
    console.log(`[嘉禾面试] 答题记录已保存: ID=${recordId}, 员工=${employeeName}, 总耗时=${totalTime}ms`)
    
    // 返回完整结果
    const responseData = {
      recordId,
      sessionId,
      employeeName,
      completedAt: endTimeObj.toISOString(),
      sessionDuration: completeResult.sessionDuration,
      
      // 逻辑测试结果
      logicTest: {
        totalQuestions: completeResult.logicResult.totalQuestions,
        correctAnswers: completeResult.logicResult.correctAnswers,
        wrongAnswers: completeResult.logicResult.wrongAnswers,
        accuracy: completeResult.logicResult.accuracy,
        answerDetails: completeResult.logicResult.answerDetails
      },
      
      // 性格测试结果
      personalityTest: {
        scores: completeResult.personalityResult.scores,
        dominantTypes: completeResult.personalityResult.dominantTypes,
        characteristics: completeResult.personalityResult.characteristics,
        summary: completeResult.personalityResult.summary
      },
      
      // 综合评价
      overallSummary: completeResult.overallSummary,
      
      // 详细报告
      detailedReport
    }
    
    return NextResponse.json({
      success: true,
      data: responseData,
      message: '测试完成！感谢您的参与。'
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 提交答题结果失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '提交答题结果失败，请稍后重试',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取嘉禾面试测试记录
 * GET /api/jiahe-interview/submit?employeeName=xxx&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeName = searchParams.get('employeeName')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (employeeName) {
      // 获取指定员工的测试记录
      const records = await jiaheInterviewRecordDB.findByEmployeeName(employeeName)
      
      return NextResponse.json({
        success: true,
        data: {
          employeeName,
          records: records.map(record => ({
            id: record.id,
            completedAt: record.completed_at,
            sessionDuration: record.session_duration,
            mainCharacteristics: record.main_characteristics,
            // 解析详细结果
            logicResult: JSON.parse(record.logic_results),
            personalityScores: JSON.parse(record.personality_scores)
          })),
          totalAttempts: records.length
        }
      })
    } else {
      // 获取最新的测试记录
      const latestRecords = await jiaheInterviewRecordDB.findLatest(limit)
      
      return NextResponse.json({
        success: true,
        data: {
          records: latestRecords.map(record => ({
            id: record.id,
            employeeName: record.employee_name,
            completedAt: record.completed_at,
            sessionDuration: record.session_duration,
            mainCharacteristics: record.main_characteristics
          })),
          total: latestRecords.length
        }
      })
    }
    
  } catch (error) {
    console.error('[嘉禾面试] 获取测试记录失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取测试记录失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}