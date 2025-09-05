import { PERSONALITY_TEST_CONFIG } from './personality-test-config'

export interface PersonalityScore {
  [tendencyId: string]: number
}

export interface PersonalityAnalysisResult {
  scores: PersonalityScore
  mainTendencies: Array<{
    tendencyId: string
    tendencyName: string
    score: number
  }>
  recommendedOccupations: string[]
  reportData: {
    employeeName: string
    testDate: string
    scoreOverview: PersonalityScore
    mainTendenciesAnalysis: Array<{
      name: string
      score: number
      description: string
    }>
    occupationRecommendations: string[]
  }
}

/**
 * 计算面试测试的性格倾向得分
 * @param answers - 用户答案 {questionId: answer}，answer为"符合"或"不符合"
 * @param employeeName - 员工姓名
 * @returns 完整的性格分析结果
 */
export function calculatePersonalityTest(
  answers: {[key: number]: string}, 
  employeeName: string
): PersonalityAnalysisResult {
  console.log('开始性格测试评测计算...')
  console.log('收到的答案数据格式:', typeof answers)
  console.log('答案数据示例:', Object.entries(answers).slice(0, 5))
  
  // 第一步：初始化九种倾向的分数
  const scores: PersonalityScore = {
    "T1": 0,
    "T2": 0,
    "T3": 0,
    "T4": 0,
    "T5": 0,
    "T6": 0,
    "T7": 0,
    "T8": 0,
    "T9": 0
  }

  // 第二步：遍历题目计分
  PERSONALITY_TEST_CONFIG.QUESTION_MAPPING.forEach(mapping => {
    const questionId = mapping.question_id
    const userAnswer = answers[questionId]
    
    if (!userAnswer) {
      console.warn(`题目 ${questionId} 未找到答案`)
      return
    }

    // 转换选项字母为实际含义
    let normalizedAnswer = userAnswer
    if (userAnswer === 'A') {
      normalizedAnswer = '符合'
    } else if (userAnswer === 'B') {
      normalizedAnswer = '不符合'
    }

    const tendencyId = mapping.tendency_id
    console.log(`题目 ${questionId}: 选择=${userAnswer} -> ${normalizedAnswer}, 倾向=${tendencyId}`)
    
    // 处理反向计分题
    if (tendencyId.includes('_REVERSE')) {
      const baseTendencyId = tendencyId.replace('_REVERSE', '')
      // 反向题：选择"不符合"得1分
      if (normalizedAnswer === '不符合') {
        scores[baseTendencyId] += 1
        console.log(`  反向题得分: ${baseTendencyId} +1 = ${scores[baseTendencyId]}`)
      }
    } else {
      // 正向题：选择"符合"得1分
      if (normalizedAnswer === '符合') {
        scores[tendencyId] += 1
        console.log(`  正向题得分: ${tendencyId} +1 = ${scores[tendencyId]}`)
      }
    }
  })

  console.log('性格倾向得分结果:', scores)

  // 第三步：分析主要性格倾向
  const sortedTendencies = Object.entries(scores)
    .map(([tendencyId, score]) => ({
      tendencyId,
      tendencyName: PERSONALITY_TEST_CONFIG.TENDENCIES[tendencyId],
      score
    }))
    .sort((a, b) => b.score - a.score) // 按分数降序排列

  // 选取前3-4个主要倾向（如果第3名和第4名分数相同，则都选取）
  const mainTendencies = []
  const topScore = sortedTendencies[0]?.score || 0
  const thirdScore = sortedTendencies[2]?.score || 0
  
  for (let i = 0; i < sortedTendencies.length; i++) {
    const tendency = sortedTendencies[i]
    if (i < 3 || (i === 3 && tendency.score === thirdScore)) {
      mainTendencies.push(tendency)
    } else {
      break
    }
  }

  console.log('主要性格倾向:', mainTendencies)

  // 第四步：职业匹配
  const recommendedOccupationCodes = new Set<number>()
  
  mainTendencies.forEach(tendency => {
    const occupationCodes = PERSONALITY_TEST_CONFIG.TENDENCY_TO_OCCUPATION[tendency.tendencyId] || []
    occupationCodes.forEach(code => recommendedOccupationCodes.add(code))
  })

  // 转换为职业名称
  const recommendedOccupations = Array.from(recommendedOccupationCodes)
    .map(code => PERSONALITY_TEST_CONFIG.OCCUPATION_NAMES[code.toString()])
    .filter(name => name) // 过滤掉未找到的职业名称
    .sort()

  console.log(`推荐职业数量: ${recommendedOccupations.length}`)

  // 第五步：生成报告数据
  const reportData = {
    employeeName,
    testDate: new Date().toLocaleString('zh-CN'),
    scoreOverview: scores,
    mainTendenciesAnalysis: mainTendencies.map(tendency => ({
      name: tendency.tendencyName,
      score: tendency.score,
      description: PERSONALITY_TEST_CONFIG.TENDENCY_DESCRIPTIONS[tendency.tendencyName] || ''
    })),
    occupationRecommendations: recommendedOccupations
  }

  return {
    scores,
    mainTendencies,
    recommendedOccupations,
    reportData
  }
}

/**
 * 生成标准格式的性格测试报告
 * @param result - 性格分析结果
 * @returns 格式化的报告文本
 */
export function generatePersonalityReport(result: PersonalityAnalysisResult): string {
  const { reportData } = result
  
  let report = `============================================================
           职业性格测验结果报告
============================================================
姓    名：${reportData.employeeName}
测评日期：${reportData.testDate}
------------------------------------------------------------

一、您的性格倾向得分概览
本部分展示了您在九种职业性格倾向上的具体得分。分数越高，代表该倾向在您的性格中表现越突出。

`

  // 得分概览
  Object.entries(PERSONALITY_TEST_CONFIG.TENDENCIES).forEach(([id, name]) => {
    const score = reportData.scoreOverview[id] || 0
    report += ` - ${name}：${score} 分\n`
  })

  report += `------------------------------------------------------------

二、您的主要性格倾向分析
根据您的测验结果，以下是您最为突出的性格倾向及其详细解读：

`

  // 主要倾向分析
  reportData.mainTendenciesAnalysis.forEach((tendency, index) => {
    report += `### ${index + 1}. ${tendency.name} (得分: ${tendency.score})
${tendency.description}

`
  })

  report += `------------------------------------------------------------

三、基于您的性格倾向的职业方向建议
综合分析您在 ${reportData.mainTendenciesAnalysis.map(t => t.name).join('、')} 等方面的突出特质，我们为您推荐以下职业方向作为参考。这些职业通常需要具备您所拥有的性格优势。

推荐职业列表：
`

  // 职业推荐，每行显示3-4个职业
  const occupations = reportData.occupationRecommendations
  for (let i = 0; i < occupations.length; i += 3) {
    const line = occupations.slice(i, i + 3)
    report += `  - ${line.join('          ')}\n`
  }

  report += `
------------------------------------------------------------

重要声明：
本报告是根据您对测验题目的回答进行分析的结果，旨在为您提供一个探索个人职业性格的参考工具。报告结论不代表对个人能力的最终评判，建议您结合自身实际情况、专业技能和工作经验，综合考量未来的职业发展方向。

============================================================
                  --- 报告结束 ---
============================================================`

  return report
}