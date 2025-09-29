// 江苏嘉禾植保面试测试配置
export const JIAHE_INTERVIEW_CONFIG = {
  // 测试基本信息
  TEST_INFO: {
    name: '江苏嘉禾植保面试测试',
    description: '包含逻辑测试和性格测试两部分，用于综合评估应聘者的能力和性格特征',
    totalQuestions: 0, // 将在导入题目后更新
    logicTestQuestions: 0, // 逻辑测试题目数量
    personalityTestQuestions: 0, // 性格测试题目数量
  },

  // 性格类型定义（D-I-S-C模型）
  PERSONALITY_TYPES: {
    "D": {
      name: "力量型 (Dominance)",
      description: "强势，好胜，具有强烈的进取心，脾气急躁，黑白分明，喜欢挑战权威，固执，不听别人规劝，刚愎自用。具有强烈的权利欲望和天生的领导气质，好面子，容易中别人的激将法。",
      characteristics: ["强势好胜", "权力欲望", "天生领导", "喜欢挑战", "决策果断", "目标导向"]
    },
    "I": {
      name: "活泼型 (Influence)", 
      description: "爱说话，爱交际，贪玩，有趣，容易冲动，善于沟通，容易兴奋，善附和人，没有心机，容易相信别人，有强大亲和力，重承诺，爱面子，\"大错不犯，小错不断\"。不喜欢做一些太细节的事。",
      characteristics: ["善于交际", "亲和力强", "热情洋溢", "乐观积极", "影响他人", "富有魅力"]
    },
    "S": {
      name: "和平型 (Steadiness)",
      description: "认真，行事稳健，不张扬，态度友善，工作条理性强，不太好意思拒绝别人的要求，心态平和，举止温和，让别人觉得他与世无争。喜欢安全稳定的环境，工作踏实，不贪图一蹴而就的成就。",
      characteristics: ["稳定可靠", "团队合作", "耐心温和", "忠诚守信", "支持他人", "避免冲突"]
    },
    "C": {
      name: "完美型 (Compliance)",
      description: "重视实际，凡事喜欢按规章办事，不讲情面，话少，追求完美主义，因此，行为常表现得向慢郎中，喜欢钻细节，把每个细节都琢磨得很准确，做事有条理性，遵纪守法，实际，从不幻想美好的未来。",
      characteristics: ["追求完美", "注重细节", "逻辑严谨", "质量导向", "谨慎分析", "系统性强"]
    }
  },

  // 性格测试题目与类型的映射关系
  // 这个映射需要根据实际的答案文档来配置
  PERSONALITY_QUESTION_MAPPING: {
    // 示例格式：题目编号 -> 性格类型
    // 需要根据答案文档中的信息来填充
    /*
    1: { type: "A", weight: 1 },
    2: { type: "B", weight: 1 },
    3: { type: "C", weight: 1 },
    // ... 更多映射
    */
  },

  // 逻辑测试评分规则
  LOGIC_TEST_SCORING: {
    // 不计分，只标注对错
    showCorrectAnswers: true,
    showExplanations: false, // 如果有解析的话
    passingScore: null // 不设及格线
  },

  // 性格测试评分规则
  PERSONALITY_TEST_SCORING: {
    // 统计各类型的选择次数
    analysisMethod: "frequency", // 频次统计
    minimumQuestions: 5, // 每个类型最少题目数量
    dominantThreshold: 0.3 // 主导性格的最低比例
  },

  // 结果展示配置
  RESULT_DISPLAY: {
    showLogicAnswers: true, // 显示逻辑测试答案对错
    showPersonalityChart: true, // 显示性格分析图表
    showRecommendations: true, // 显示建议
    generateReport: true // 生成详细报告
  },

  // 答题界面配置
  EXAM_INTERFACE: {
    sectionsInfo: {
      logic: {
        title: "第一部分：逻辑推理测试",
        description: "本部分测试您的逻辑思维和推理能力，每题只有一个正确答案。",
        timeLimit: null, // 无时间限制
        shuffleQuestions: false // 不打乱题目顺序
      },
      personality: {
        title: "第二部分：性格特征测试", 
        description: "本部分了解您的性格特征和工作风格，请根据真实情况作答，无标准答案。",
        timeLimit: null,
        shuffleQuestions: false
      }
    },
    navigation: {
      allowBack: true, // 允许返回上一题
      allowSkip: false, // 不允许跳过
      showProgress: true, // 显示进度
      showSectionProgress: true // 显示分段进度
    }
  }
}

// 性格分析结果接口
export interface JiahePersonalityResult {
  scores: { [personalityType: string]: number }
  dominantTypes: Array<{
    type: string
    name: string
    score: number
    percentage: number
  }>
  characteristics: string[]
  summary: string
}

// 逻辑测试结果接口
export interface JiaheLogicResult {
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  accuracy: number
  answerDetails: Array<{
    questionNumber: number
    questionText: string
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation?: string
  }>
}

// 完整的嘉禾面试结果接口
export interface JiaheInterviewResult {
  sessionId: string
  employeeName: string
  completedAt: string
  sessionDuration: number
  logicResult: JiaheLogicResult
  personalityResult: JiahePersonalityResult
  overallSummary: string
}

// 用于导入数据的题目格式
export interface JiaheRawQuestion {
  section: 'logic' | 'personality'
  questionNumber: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer?: string // 逻辑测试用
  personalityType?: string // 性格测试用
}

// 常量定义
export const JIAHE_INTERVIEW_CONSTANTS = {
  // 会话标识前缀
  SESSION_PREFIX: 'jiahe_interview_',
  
  // 本地存储键名
  STORAGE_KEYS: {
    EXAM_DATA: 'jiaheInterviewData',
    ANSWERS: 'jiaheInterviewAnswers',
    CURRENT_SECTION: 'jiaheCurrentSection',
    CURRENT_QUESTION: 'jiaheCurrentQuestion'
  },

  // 页面路由
  ROUTES: {
    ENTRY: '/training/jiahe-interview',
    EXAM: '/training/jiahe-interview/exam', 
    RESULT: '/training/jiahe-interview/result'
  },

  // API 端点
  API_ENDPOINTS: {
    START: '/api/jiahe-interview/start',
    SUBMIT: '/api/jiahe-interview/submit',
    RECORDS: '/api/jiahe-interview/records'
  }
}

// 工具函数：生成会话ID
export function generateJiaheSessionId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${JIAHE_INTERVIEW_CONSTANTS.SESSION_PREFIX}${timestamp}_${random}`
}

// 工具函数：验证是否为嘉禾面试会话
export function isJiaheInterviewSession(sessionId: string): boolean {
  return sessionId.startsWith(JIAHE_INTERVIEW_CONSTANTS.SESSION_PREFIX)
}

// 工具函数：计算性格类型得分
export function calculatePersonalityScores(
  answers: { [key: number]: string },
  mapping: { [key: number]: { type: string; weight: number } }
): { [personalityType: string]: number } {
  const scores: { [personalityType: string]: number } = {}
  
  // 初始化所有性格类型得分为0
  Object.keys(JIAHE_INTERVIEW_CONFIG.PERSONALITY_TYPES).forEach(type => {
    scores[type] = 0
  })
  
  // 统计每个选项的选择次数
  Object.entries(answers).forEach(([questionId, answer]) => {
    const questionNum = parseInt(questionId)
    const questionMapping = mapping[questionNum]
    
    if (questionMapping && answer) {
      // 根据选择的选项和权重计算得分
      const weight = questionMapping.weight || 1
      if (scores[questionMapping.type] !== undefined) {
        scores[questionMapping.type] += weight
      }
    }
  })
  
  return scores
}

// 工具函数：获取主导性格类型
export function getDominantPersonalityTypes(
  scores: { [personalityType: string]: number },
  threshold: number = 0.3
): Array<{ type: string; name: string; score: number; percentage: number }> {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  
  if (totalScore === 0) {
    return []
  }
  
  return Object.entries(scores)
    .map(([type, score]) => ({
      type,
      name: JIAHE_INTERVIEW_CONFIG.PERSONALITY_TYPES[type]?.name || type,
      score,
      percentage: score / totalScore
    }))
    .filter(item => item.percentage >= threshold)
    .sort((a, b) => b.score - a.score)
}