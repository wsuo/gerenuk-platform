import { NextRequest, NextResponse } from 'next/server'
import { questionDB, questionSetDB, examCategoryDB, trainingRecordDB, systemConfigDB } from '@/lib/database'
import { calculatePersonalityTest, generatePersonalityReport } from '@/lib/personality-test-analyzer'
import { PERSONALITY_TEST_SET_ID, PERSONALITY_TEST_CATEGORY_ID } from '@/lib/personality-test-config'
import { isJiaheInterviewCategory, isJiaheInterviewSet } from '@/lib/jiahe-interview-constants'
import { JiaheInterviewAnalyzer } from '@/lib/jiahe-interview-analyzer'
import { isChoiceAnswerCorrect, normalizeChoiceAnswer } from '@/lib/choice-answer'

interface AnswerItem {
  questionId: number
  questionNumber: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation?: string
}

// 提交答题结果
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const {
      sessionId,
      employeeName,
      setId,
      categoryId, // 新增类别ID
      startedAt,
      answers, // 格式: { questionId: selectedAnswer }
      autoSubmitted = false // 是否为自动提交
    } = await request.json()
    
    console.log(`[${new Date().toISOString()}] 收到答题提交:`, { 
      sessionId, 
      employeeName, 
      setId, 
      categoryId, 
      answersCount: Object.keys(answers).length,
      autoSubmitted: autoSubmitted ? '自动提交' : '手动提交'
    })
    
    // 验证必要参数
    if (!sessionId || !employeeName || !setId || !startedAt || !answers) {
      return NextResponse.json(
        { success: false, message: '提交参数不完整' },
        { status: 400 }
      )
    }
    
    // 获取合格分数线
    const passScore = await systemConfigDB.getTrainingPassScore()
    
    // 获取试卷的所有题目
    const questionStartTime = Date.now()
    const questions = await questionDB.findBySetId(setId)
    console.log(`获取题目耗时: ${Date.now() - questionStartTime}ms, 题目数量: ${questions.length}`)
    
    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, message: '试卷题目不存在' },
        { status: 404 }
      )
    }
    
    // 获取题库和考核类别的成绩查看配置
    const configStartTime = Date.now()
    const questionSet = await questionSetDB.findById(setId)
    let allowViewScore = true // 默认允许查看成绩
    
    if (questionSet) {
      // 检查题库级别的配置
      allowViewScore = questionSet.allow_view_score !== false
      
      // 如果题库允许查看，进一步检查类别级别的配置
      if (allowViewScore && categoryId) {
        const category = await examCategoryDB.findById(categoryId)
        if (category) {
          allowViewScore = category.allow_view_score !== false
        }
      }
    }
    
    console.log(`查询成绩配置耗时: ${Date.now() - configStartTime}ms, 是否允许查看: ${allowViewScore}`)
    
    // 判断是否为面试测试
    const isPersonalityTest = setId === PERSONALITY_TEST_SET_ID || categoryId === PERSONALITY_TEST_CATEGORY_ID
    
    // 判断是否为嘉禾面试测试
    const category = categoryId ? await examCategoryDB.findById(categoryId) : null
    const isJiaheInterview = category ? isJiaheInterviewCategory(category.name) : 
                            questionSet ? isJiaheInterviewSet(questionSet.name) : false
    
    console.log(`是否为面试测试: ${isPersonalityTest}`)
    console.log(`是否为嘉禾面试测试: ${isJiaheInterview}`)
    
    // 评分处理
    const scoringStartTime = Date.now()
    const answerResults: AnswerItem[] = []
    let correctCount = 0
    let personalityResult = null
    let personalityReport = ''
    let jiaheInterviewResult = null
    
    if (isJiaheInterview) {
      // 嘉禾面试测试：使用专门的分析器
      console.log('开始嘉禾面试测试评测...')
      
      // 转换题目格式给嘉禾分析器
      const jiaheQuestions = questions.map(q => ({
        id: q.id,
        section: q.section === 'logic' ? 'logic' as const : 'personality' as const,
        question_number: q.question_number,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        personality_type: q.explanation?.includes('性格类型:') ? 
          q.explanation.replace('性格类型: ', '') : undefined
      }))
      
      jiaheInterviewResult = JiaheInterviewAnalyzer.generateCompleteResult(
        sessionId,
        employeeName,
        answers,
        jiaheQuestions,
        new Date(startedAt),
        new Date()
      )
      
      // 为嘉禾面试创建答案结果
      for (const question of questions) {
        const selectedAnswer = answers[question.id!]
        const isLogicQuestion = question.section === 'logic'
        const isCorrect = isLogicQuestion ? isChoiceAnswerCorrect(selectedAnswer, question.correct_answer) : true
        
        if (isLogicQuestion && isCorrect) {
          correctCount++
        }
        
        answerResults.push({
          questionId: question.id!,
          questionNumber: question.question_number,
          questionText: question.question_text,
          optionA: question.option_a,
          optionB: question.option_b,
          optionC: question.option_c,
          optionD: question.option_d,
          selectedAnswer: normalizeChoiceAnswer(selectedAnswer || ''),
          correctAnswer: isLogicQuestion ? normalizeChoiceAnswer(question.correct_answer) : '',
          isCorrect,
          explanation: question.explanation || ''
        })
      }
      
      console.log('嘉禾面试测试评测完成:', {
        逻辑测试正确数: jiaheInterviewResult.logicResult.correctAnswers,
        性格倾向数量: jiaheInterviewResult.personalityResult.dominantTypes.length
      })
    } else if (isPersonalityTest) {
      // 面试测试：进行性格倾向评测
      console.log('开始面试测试评测...')
      personalityResult = calculatePersonalityTest(answers, employeeName)
      personalityReport = generatePersonalityReport(personalityResult)
      
      // 为面试测试创建答案结果（不需要正确答案判断）
      for (const question of questions) {
        const selectedAnswer = answers[question.id!]
        
        answerResults.push({
          questionId: question.id!,
          questionNumber: question.question_number,
          questionText: question.question_text,
          optionA: question.option_a,
          optionB: question.option_b,
          optionC: question.option_c,
          optionD: question.option_d,
          selectedAnswer: normalizeChoiceAnswer(selectedAnswer || ''),
          correctAnswer: '', // 面试测试无标准答案
          isCorrect: true, // 面试测试所有答案都视为"正确"
          explanation: question.explanation || ''
        })
      }
      
      console.log('面试测试评测完成:', {
        主要倾向数量: personalityResult.mainTendencies.length,
        推荐职业数量: personalityResult.recommendedOccupations.length
      })
    } else {
      // 传统考试：按正确答案评分
      for (const question of questions) {
        const selectedAnswer = answers[question.id!]
        const isCorrect = isChoiceAnswerCorrect(selectedAnswer, question.correct_answer)
        
        if (isCorrect) {
          correctCount++
        }
        
        answerResults.push({
          questionId: question.id!,
          questionNumber: question.question_number,
          questionText: question.question_text,
          optionA: question.option_a,
          optionB: question.option_b,
          optionC: question.option_c,
          optionD: question.option_d,
          selectedAnswer: normalizeChoiceAnswer(selectedAnswer || ''),
          correctAnswer: normalizeChoiceAnswer(question.correct_answer),
          isCorrect,
          explanation: question.explanation || ''
        })
      }
    }
    console.log(`评分处理耗时: ${Date.now() - scoringStartTime}ms`)
    
    // 计算分数
    let score
    if (isJiaheInterview) {
      // 嘉禾面试：逻辑测试部分按正确率，性格测试按完成度，综合为100分
      score = 100 // 嘉禾面试统一显示100分完成
    } else if (isPersonalityTest) {
      // 面试测试按完成度计分
      score = 100
    } else {
      // 传统考试按正确率计分
      score = Math.round((correctCount / questions.length) * 100)
    }
    
    // 计算答题时长
    const startTime = new Date(startedAt)
    const endTime = new Date()
    const sessionDuration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    
    // 获取用户IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // 保存答题记录
    const dbStartTime = Date.now()
    
    // 转换日期格式为MySQL兼容格式  
    const mysqlStartedAt = new Date(startedAt).toISOString().slice(0, 19).replace('T', ' ')
    
    const recordData = {
      employee_name: employeeName.trim(),
      set_id: setId,
      category_id: categoryId || null,
      answers: JSON.stringify(answerResults),
      score,
      total_questions: questions.length,
      started_at: mysqlStartedAt,
      completed_at: endTime.toISOString(),
      ip_address: ip,
      session_duration: sessionDuration,
      // 面试测试专用字段
      is_personality_test: isPersonalityTest || isJiaheInterview,
      personality_test_result: isJiaheInterview ? 
        JSON.stringify(jiaheInterviewResult) : 
        personalityResult ? JSON.stringify(personalityResult) : null,
      personality_scores: isJiaheInterview ? 
        JSON.stringify(jiaheInterviewResult.personalityResult.scores) :
        personalityResult ? JSON.stringify(personalityResult.scores) : null,
      main_tendencies: isJiaheInterview ? 
        jiaheInterviewResult.personalityResult.dominantTypes.map(t => t.name).join(',') :
        personalityResult ? personalityResult.mainTendencies.map(t => t.tendencyName).join(',') : null,
      recommended_occupations: isJiaheInterview ? 
        jiaheInterviewResult.personalityResult.characteristics.join(',') :
        personalityResult ? personalityResult.recommendedOccupations.join(',') : null,
      test_report: isJiaheInterview ? 
        JiaheInterviewAnalyzer.generateDetailedReport(jiaheInterviewResult) :
        personalityResult ? personalityReport : null
    }
    
    const recordId = await trainingRecordDB.insertRecord(recordData)
    console.log(`数据库写入耗时: ${Date.now() - dbStartTime}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`[${new Date().toISOString()}] 答题记录已保存: ID=${recordId}, 员工=${employeeName}, 分数=${score}/${questions.length}, 总耗时=${totalTime}ms`)
    
    // 返回答题结果
    const responseData = {
      recordId,
      sessionId,
      employeeName,
      allowViewScore, // 添加成绩查看配置
      completedAt: endTime.toISOString()
    }
    
    // 根据配置决定返回的信息
    if (allowViewScore) {
      // 允许查看成绩，返回详细信息
      const resultData = {
        ...responseData,
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: questions.length - correctCount,
        accuracy: Math.round((correctCount / questions.length) * 100),
        sessionDuration,
        passed: score >= passScore,
        answerDetails: answerResults
      }

      // 如果是嘉禾面试测试，添加专门的结果数据
      if (isJiaheInterview && jiaheInterviewResult) {
        resultData.jiaheInterviewResult = jiaheInterviewResult
        resultData.categoryName = category?.name
        resultData.setName = questionSet?.name
      }

      return NextResponse.json({
        success: true,
        data: resultData,
        message: score >= passScore ? '恭喜你通过了培训考试！' : `很遗憾，你的成绩未达到及格线（${passScore}分），建议继续学习后重新参加考试。`
      })
    } else {
      // 不允许查看成绩，只返回基本完成信息
      return NextResponse.json({
        success: true,
        data: {
          ...responseData,
          totalQuestions: questions.length,
          sessionDuration
        },
        message: '感谢您完成本次测验，您的答题记录已保存。'
      })
    }
    
  } catch (error) {
    console.error('提交答题结果失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '提交答题结果失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// 获取答题历史 (可选功能)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeName = searchParams.get('employeeName')
    
    if (!employeeName) {
      return NextResponse.json(
        { success: false, message: '请提供员工姓名' },
        { status: 400 }
      )
    }
    
    // 获取合格分数线
    const passScore = await systemConfigDB.getTrainingPassScore()
    
    const records = await trainingRecordDB.findByEmployeeName(employeeName)
    
    return NextResponse.json({
      success: true,
      data: {
        employeeName,
        records: records.map(record => ({
          id: record.id,
          score: record.score,
          totalQuestions: record.total_questions,
          passed: record.score >= passScore, // 使用动态合格分数线
          sessionDuration: record.session_duration,
          completedAt: record.completed_at,
          setId: record.set_id
        })),
        totalAttempts: records.length,
        bestScore: records.length > 0 ? Math.max(...records.map(r => r.score)) : 0
      }
    })
    
  } catch (error) {
    console.error('获取答题历史失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取答题历史失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
