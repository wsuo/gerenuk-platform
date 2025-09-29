import { 
  JIAHE_INTERVIEW_CONFIG, 
  JiahePersonalityResult, 
  JiaheLogicResult, 
  JiaheInterviewResult,
  calculatePersonalityScores,
  getDominantPersonalityTypes
} from './jiahe-interview-config'
import { JiaheInterviewQuestion } from './jiahe-interview-db'

/**
 * 嘉禾面试测试分析器
 * 负责处理逻辑测试和性格测试的结果分析
 */
export class JiaheInterviewAnalyzer {
  
  /**
   * 分析逻辑测试结果
   * @param answers 用户答案 {questionId: selectedAnswer}
   * @param questions 逻辑测试题目列表
   * @returns 逻辑测试结果
   */
  static analyzeLogicTest(
    answers: { [key: number]: string },
    questions: JiaheInterviewQuestion[]
  ): JiaheLogicResult {
    const answerDetails = []
    let correctCount = 0

    for (const question of questions) {
      if (question.section !== 'logic' || !question.id) continue

      const selectedAnswer = answers[question.id] || ''
      const correctAnswer = question.correct_answer || ''
      const isCorrect = selectedAnswer === correctAnswer

      if (isCorrect) {
        correctCount++
      }

      answerDetails.push({
        questionNumber: question.question_number,
        questionText: question.question_text,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        explanation: '' // 如果题目有解析可以在这里添加
      })
    }

    const totalQuestions = questions.filter(q => q.section === 'logic').length
    const wrongAnswers = totalQuestions - correctCount
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0

    return {
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers,
      accuracy: Math.round(accuracy * 100) / 100, // 保留两位小数
      answerDetails: answerDetails.sort((a, b) => a.questionNumber - b.questionNumber)
    }
  }

  /**
   * 分析性格测试结果（D-I-S-C模型）
   * @param answers 用户答案 {questionId: selectedAnswer}
   * @param questions 性格测试题目列表
   * @returns 性格测试结果
   */
  static analyzePersonalityTestDISC(
    answers: { [key: number]: string },
    questions: JiaheInterviewQuestion[]
  ): JiahePersonalityResult {
    console.log('开始分析D-I-S-C性格测试结果...')
    
    // D-I-S-C类型计数
    const discCounts = {
      D: 0, // 力量型
      I: 0, // 活泼型
      S: 0, // 和平型
      C: 0  // 完美型
    }

    // 统计每种类型的选择次数
    // 注意：这里需要根据实际的题目选项映射来调整
    // 目前假设每道题的A、B、C、D选项分别对应不同的性格类型
    questions
      .filter(q => q.section === 'personality')
      .forEach(question => {
        if (question.id && answers[question.id]) {
          const selectedAnswer = answers[question.id]
          
          // 根据题目内容确定选项到性格类型的映射
          // 这个映射需要根据实际题目内容来调整
          const optionToTypeMapping = this.getOptionToDiscMapping(question)
          
          if (optionToTypeMapping[selectedAnswer]) {
            const discType = optionToTypeMapping[selectedAnswer]
            discCounts[discType as keyof typeof discCounts]++
          }
        }
      })

    console.log('D-I-S-C类型统计:', discCounts)

    // 转换为标准格式
    const scores = {
      D: discCounts.D,
      I: discCounts.I,
      S: discCounts.S,
      C: discCounts.C
    }

    // 计算总题数
    const totalAnswered = Object.values(discCounts).reduce((sum, count) => sum + count, 0)
    
    // 计算百分比并排序
    const dominantTypes = Object.entries(scores)
      .map(([type, score]) => ({
        type,
        name: JIAHE_INTERVIEW_CONFIG.PERSONALITY_TYPES[type].name,
        score,
        percentage: totalAnswered > 0 ? score / totalAnswered : 0
      }))
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0)

    console.log('主导性格类型:', dominantTypes)

    // 生成性格特征描述
    const characteristics = this.generateCharacteristics(dominantTypes)
    
    // 生成总结报告
    const summary = this.generatePersonalitySummary(dominantTypes, characteristics)

    return {
      scores,
      dominantTypes,
      characteristics,
      summary
    }
  }

  /**
   * 获取题目选项到D-I-S-C类型的映射
   * 现在选项已经按照D、I、S、C顺序排序，所以可以直接映射
   */
  private static getOptionToDiscMapping(question: JiaheInterviewQuestion): { [key: string]: string } {
    // 选项已按DISC顺序排列：A=D, B=I, C=S, D=C
    return {
      'A': 'D', // A选项对应力量型 (Dominance)
      'B': 'I', // B选项对应活泼型 (Influence)  
      'C': 'S', // C选项对应和平型 (Steadiness)
      'D': 'C'  // D选项对应完美型 (Compliance)
    }
  }

  /**
   * 分析性格测试结果（原有逻辑，保持兼容性）
   * @param answers 用户答案 {questionId: selectedAnswer}
   * @param questions 性格测试题目列表
   * @param mapping 题目与性格类型的映射关系
   * @returns 性格测试结果
   */
  static analyzePersonalityTest(
    answers: { [key: number]: string },
    questions: JiaheInterviewQuestion[],
    mapping?: { [key: number]: { type: string; weight: number } }
  ): JiahePersonalityResult {
    console.log('开始分析性格测试结果...')
    
    // 如果没有提供映射，使用题目中的personality_type字段
    const questionMapping = mapping || this.generateMappingFromQuestions(questions)
    
    // 计算性格类型得分
    const scores = calculatePersonalityScores(answers, questionMapping)
    console.log('性格类型得分:', scores)

    // 获取主导性格类型
    const dominantTypes = getDominantPersonalityTypes(
      scores, 
      JIAHE_INTERVIEW_CONFIG.PERSONALITY_TEST_SCORING.dominantThreshold
    )
    console.log('主导性格类型:', dominantTypes)

    // 生成性格特征描述
    const characteristics = this.generateCharacteristics(dominantTypes)
    
    // 生成总结报告
    const summary = this.generatePersonalitySummary(dominantTypes, characteristics)

    return {
      scores,
      dominantTypes,
      characteristics,
      summary
    }
  }

  /**
   * 从题目数据生成映射关系（如果没有提供映射配置）
   */
  private static generateMappingFromQuestions(
    questions: JiaheInterviewQuestion[]
  ): { [key: number]: { type: string; weight: number } } {
    const mapping: { [key: number]: { type: string; weight: number } } = {}
    
    questions
      .filter(q => q.section === 'personality' && q.personality_type)
      .forEach(question => {
        if (question.id && question.personality_type) {
          mapping[question.id] = {
            type: question.personality_type,
            weight: 1
          }
        }
      })
    
    return mapping
  }

  /**
   * 生成性格特征描述
   */
  private static generateCharacteristics(
    dominantTypes: Array<{ type: string; name: string; score: number; percentage: number }>
  ): string[] {
    const characteristics: string[] = []
    
    dominantTypes.forEach(({ type, percentage }) => {
      const personalityType = JIAHE_INTERVIEW_CONFIG.PERSONALITY_TYPES[type]
      if (personalityType && percentage > 0.2) { // 超过20%才算显著特征
        characteristics.push(...personalityType.characteristics)
      }
    })
    
    // 去重并返回
    return [...new Set(characteristics)]
  }

  /**
   * 生成性格分析总结
   */
  private static generatePersonalitySummary(
    dominantTypes: Array<{ type: string; name: string; score: number; percentage: number }>,
    characteristics: string[]
  ): string {
    if (dominantTypes.length === 0) {
      return '根据您的答题情况，暂无法确定明显的性格倾向特征。建议您在实际工作中多加观察和总结。'
    }

    const primaryType = dominantTypes[0]
    const primaryTypeInfo = JIAHE_INTERVIEW_CONFIG.PERSONALITY_TYPES[primaryType.type]
    
    let summary = `根据您的测试结果，您主要表现为${primaryType.name}特征`
    
    if (primaryTypeInfo) {
      summary += `，${primaryTypeInfo.description}`
    }
    
    if (dominantTypes.length > 1) {
      const secondaryTypes = dominantTypes.slice(1, 3).map(t => t.name).join('、')
      summary += `。同时，您也具有${secondaryTypes}的特点`
    }
    
    if (characteristics.length > 0) {
      const mainCharacteristics = characteristics.slice(0, 5).join('、')
      summary += `，在${mainCharacteristics}等方面表现突出`
    }
    
    summary += '。这些特质将有助于您在相关岗位上发挥优势。'
    
    return summary
  }

  /**
   * 生成完整的面试测试结果
   * @param sessionId 会话ID
   * @param employeeName 员工姓名
   * @param answers 所有答案
   * @param questions 所有题目
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @returns 完整的面试测试结果
   */
  static generateCompleteResult(
    sessionId: string,
    employeeName: string,
    answers: { [key: number]: string },
    questions: JiaheInterviewQuestion[],
    startTime: Date,
    endTime: Date
  ): JiaheInterviewResult {
    console.log('开始生成完整的面试测试结果...')
    
    // 分离逻辑测试和性格测试题目
    const logicQuestions = questions.filter(q => q.section === 'logic')
    const personalityQuestions = questions.filter(q => q.section === 'personality')
    
    console.log(`逻辑测试题目数量: ${logicQuestions.length}`)
    console.log(`性格测试题目数量: ${personalityQuestions.length}`)
    
    // 分析逻辑测试结果
    const logicResult = this.analyzeLogicTest(answers, logicQuestions)
    console.log('逻辑测试分析完成')
    
    // 分析性格测试结果（使用D-I-S-C模型）
    const personalityResult = this.analyzePersonalityTestDISC(answers, personalityQuestions)
    console.log('D-I-S-C性格测试分析完成')
    
    // 计算答题时长
    const sessionDuration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    
    // 生成综合评价
    const overallSummary = this.generateOverallSummary(logicResult, personalityResult, sessionDuration)
    
    const result: JiaheInterviewResult = {
      sessionId,
      employeeName,
      completedAt: endTime.toISOString(),
      sessionDuration,
      logicResult,
      personalityResult,
      overallSummary
    }
    
    console.log('完整面试测试结果生成完成')
    return result
  }

  /**
   * 生成综合评价
   */
  private static generateOverallSummary(
    logicResult: JiaheLogicResult,
    personalityResult: JiahePersonalityResult,
    sessionDuration: number
  ): string {
    const minutes = Math.round(sessionDuration / 60)
    
    let summary = `您在 ${minutes} 分钟内完成了本次面试测试。`
    
    // 逻辑测试部分评价
    if (logicResult.totalQuestions > 0) {
      const accuracy = logicResult.accuracy
      let logicEvaluation = ''
      
      if (accuracy >= 80) {
        logicEvaluation = '逻辑推理能力表现优秀'
      } else if (accuracy >= 60) {
        logicEvaluation = '逻辑推理能力表现良好'
      } else {
        logicEvaluation = '逻辑推理能力有待提升'
      }
      
      summary += `在逻辑推理测试中，您答对了 ${logicResult.correctAnswers}/${logicResult.totalQuestions} 题，正确率为 ${accuracy.toFixed(1)}%，${logicEvaluation}。`
    }
    
    // 性格测试部分评价
    if (personalityResult.dominantTypes.length > 0) {
      const primaryType = personalityResult.dominantTypes[0]
      summary += `在性格特征测试中，您主要表现为${primaryType.name}特质。`
      summary += personalityResult.summary
    }
    
    summary += '感谢您参与本次测试，祝您面试顺利！'
    
    return summary
  }

  /**
   * 生成详细的测试报告
   * @param result 完整的面试测试结果
   * @returns 格式化的报告文本
   */
  static generateDetailedReport(result: JiaheInterviewResult): string {
    const report = `
============================================================
           江苏嘉禾植保面试测试报告
============================================================
姓    名：${result.employeeName}
测试日期：${new Date(result.completedAt).toLocaleString('zh-CN')}
答题时长：${Math.round(result.sessionDuration / 60)} 分钟
会话标识：${result.sessionId}
------------------------------------------------------------

一、逻辑推理测试结果
本部分测试您的逻辑思维和推理能力。

总题数：${result.logicResult.totalQuestions} 题
正确数：${result.logicResult.correctAnswers} 题  
错误数：${result.logicResult.wrongAnswers} 题
正确率：${result.logicResult.accuracy.toFixed(1)}%

${result.logicResult.accuracy >= 80 ? '✓ 优秀' : 
  result.logicResult.accuracy >= 60 ? '✓ 良好' : '△ 有待提升'}

------------------------------------------------------------

二、性格特征测试结果
本部分分析您的性格倾向和工作风格。

主要性格类型：
${result.personalityResult.dominantTypes.map((type, index) => 
  `${index + 1}. ${type.name} (${(type.percentage * 100).toFixed(1)}%)`
).join('\n')}

突出特征：
${result.personalityResult.characteristics.map(char => `• ${char}`).join('\n')}

性格分析：
${result.personalityResult.summary}

------------------------------------------------------------

三、综合评价
${result.overallSummary}

------------------------------------------------------------

重要说明：
本报告基于您的答题情况生成，仅供参考。测试结果不代表对个人能力的
最终评判，建议结合实际工作表现和其他评估方式综合考量。

============================================================
                  --- 报告结束 ---
============================================================`

    return report
  }
}