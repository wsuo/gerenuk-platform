import { NextRequest, NextResponse } from 'next/server'
import { jiaheInterviewQuestionDB } from '@/lib/jiahe-interview-db'
import { 
  generateJiaheSessionId, 
  JIAHE_INTERVIEW_CONFIG,
  JIAHE_INTERVIEW_CONSTANTS 
} from '@/lib/jiahe-interview-config'

// Fisher-Yates洗牌算法（如果需要随机排序）
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 开始嘉禾面试测试
 * POST /api/jiahe-interview/start
 */
export async function POST(request: NextRequest) {
  try {
    const { employeeName } = await request.json()
    
    if (!employeeName || !employeeName.trim()) {
      return NextResponse.json(
        { success: false, message: '请输入您的姓名' },
        { status: 400 }
      )
    }
    
    console.log(`[嘉禾面试] 员工 ${employeeName} 开始测试`)
    
    // 获取所有题目
    const allQuestions = await jiaheInterviewQuestionDB.findAll()
    
    if (allQuestions.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: '测试题目尚未准备就绪，请联系管理员' 
        },
        { status: 404 }
      )
    }
    
    // 分离逻辑测试和性格测试题目
    const logicQuestions = allQuestions.filter(q => q.section === 'logic')
    const personalityQuestions = allQuestions.filter(q => q.section === 'personality')
    
    console.log(`逻辑测试题目: ${logicQuestions.length} 题`)
    console.log(`性格测试题目: ${personalityQuestions.length} 题`)
    
    // 准备题目数据（不包含正确答案）
    const prepareQuestions = (questions: any[]) => {
      return questions.map((q, index) => ({
        id: q.id,
        section: q.section,
        questionNumber: q.question_number,
        questionText: q.question_text,
        optionA: q.option_a,
        optionB: q.option_b,
        optionC: q.option_c,
        optionD: q.option_d,
        // 不返回正确答案和性格类型，保持测试的公正性
      }))
    }
    
    // 根据配置决定是否打乱题目顺序
    const processedLogicQuestions = JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE.sectionsInfo.logic.shuffleQuestions
      ? shuffleArray(prepareQuestions(logicQuestions))
      : prepareQuestions(logicQuestions.sort((a, b) => a.question_number - b.question_number))
    
    const processedPersonalityQuestions = JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE.sectionsInfo.personality.shuffleQuestions
      ? shuffleArray(prepareQuestions(personalityQuestions))
      : prepareQuestions(personalityQuestions.sort((a, b) => a.question_number - b.question_number))
    
    // 生成会话ID
    const sessionId = generateJiaheSessionId()
    
    // 构建考试数据
    const examData = {
      sessionId,
      employeeName: employeeName.trim(),
      testInfo: {
        ...JIAHE_INTERVIEW_CONFIG.TEST_INFO,
        totalQuestions: allQuestions.length,
        logicTestQuestions: logicQuestions.length,
        personalityTestQuestions: personalityQuestions.length
      },
      sections: {
        logic: {
          ...JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE.sectionsInfo.logic,
          questions: processedLogicQuestions,
          totalQuestions: logicQuestions.length
        },
        personality: {
          ...JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE.sectionsInfo.personality,
          questions: processedPersonalityQuestions,
          totalQuestions: personalityQuestions.length
        }
      },
      interfaceConfig: JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE,
      startedAt: new Date().toISOString()
    }
    
    console.log(`[嘉禾面试] 会话 ${sessionId} 创建成功`)
    
    return NextResponse.json({
      success: true,
      data: examData,
      message: '测试准备就绪，祝您答题顺利！'
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 开始测试失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '开始测试失败，请稍后重试',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取嘉禾面试测试信息
 * GET /api/jiahe-interview/start
 */
export async function GET(request: NextRequest) {
  try {
    // 获取题目统计信息
    const totalCount = await jiaheInterviewQuestionDB.getCount()
    const logicQuestions = await jiaheInterviewQuestionDB.findBySection('logic')
    const personalityQuestions = await jiaheInterviewQuestionDB.findBySection('personality')
    
    return NextResponse.json({
      success: true,
      data: {
        testInfo: {
          ...JIAHE_INTERVIEW_CONFIG.TEST_INFO,
          totalQuestions: totalCount,
          logicTestQuestions: logicQuestions.length,
          personalityTestQuestions: personalityQuestions.length
        },
        interfaceConfig: JIAHE_INTERVIEW_CONFIG.EXAM_INTERFACE,
        available: totalCount > 0
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 获取测试信息失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取测试信息失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}