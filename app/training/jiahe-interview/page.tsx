"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleHeader } from '@/components/module-header'
import { PlatformFooter } from '@/components/platform-footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  User, 
  BookOpen, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap,
  MousePointer2,
  X,
  Info,
  Brain,
  Users
} from 'lucide-react'
import { JIAHE_INTERVIEW_CONSTANTS } from '@/lib/jiahe-interview-config'

interface JiaheExamData {
  sessionId: string
  employeeName: string
  testInfo: {
    name: string
    description: string
    totalQuestions: number
    logicTestQuestions: number
    personalityTestQuestions: number
  }
  sections: {
    logic: {
      title: string
      description: string
      questions: JiaheQuestion[]
      totalQuestions: number
    }
    personality: {
      title: string
      description: string
      questions: JiaheQuestion[]
      totalQuestions: number
    }
  }
  interfaceConfig: any
  startedAt: string
}

interface JiaheQuestion {
  id: number
  section: 'logic' | 'personality'
  questionNumber: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}

type CurrentSection = 'logic' | 'personality'

export default function JiaheInterviewExamPage() {
  const [examData, setExamData] = useState<JiaheExamData | null>(null)
  const [currentSection, setCurrentSection] = useState<CurrentSection>('logic')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showDoubleClickTip, setShowDoubleClickTip] = useState(true)
  const [isSubmissionCompleted, setIsSubmissionCompleted] = useState(false)
  
  const router = useRouter()

  // beforeunload处理函数
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!isSubmissionCompleted) {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
  }, [isSubmissionCompleted])

  // 页面离开时清空答题数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (examData && !isSubmissionCompleted) {
          localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.EXAM_DATA)
          localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.ANSWERS)
        }
      }
    }

    // 添加事件监听
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [examData, handleBeforeUnload, isSubmissionCompleted])

  // 加载考试数据
  useEffect(() => {
    const savedExamData = localStorage.getItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.EXAM_DATA)
    if (savedExamData) {
      try {
        const data = JSON.parse(savedExamData)
        setExamData(data)
        
        // 加载已保存的答案
        const savedAnswers = localStorage.getItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.ANSWERS)
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers))
        }
        
        // 加载当前位置
        const savedSection = localStorage.getItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_SECTION) as CurrentSection
        const savedQuestion = localStorage.getItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_QUESTION)
        
        if (savedSection) {
          setCurrentSection(savedSection)
        }
        if (savedQuestion) {
          setCurrentQuestionIndex(parseInt(savedQuestion))
        }
        
      } catch (error) {
        console.error('加载考试数据失败:', error)
        router.push('/training')
      }
    } else {
      // 没有考试数据，重定向到入口页面
      router.push('/training')
    }
  }, [router])

  // 计时器
  useEffect(() => {
    if (!examData) return

    const startTime = new Date(examData.startedAt).getTime()
    
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [examData])

  // 保存答案到localStorage
  const saveAnswersToLocal = useCallback((newAnswers: {[key: number]: string}) => {
    localStorage.setItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.ANSWERS, JSON.stringify(newAnswers))
  }, [])

  // 保存当前位置到localStorage
  const saveCurrentPosition = useCallback((section: CurrentSection, questionIndex: number) => {
    localStorage.setItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_SECTION, section)
    localStorage.setItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_QUESTION, questionIndex.toString())
  }, [])

  // 处理答案选择
  const handleAnswerSelect = (questionId: number, selectedAnswer: string) => {
    const newAnswers = { ...answers, [questionId]: selectedAnswer }
    setAnswers(newAnswers)
    saveAnswersToLocal(newAnswers)
  }

  // 处理双击选项：选择答案并跳转到下一题
  const handleDoubleClickOption = (questionId: number, selectedAnswer: string) => {
    handleAnswerSelect(questionId, selectedAnswer)
    
    setTimeout(() => {
      goToNextQuestion()
    }, 300)
  }

  // 关闭双击提示
  const dismissDoubleClickTip = () => {
    setShowDoubleClickTip(false)
    localStorage.setItem('jiaheHideDoubleClickTip', 'true')
  }

  // 检查是否应该显示双击提示
  useEffect(() => {
    const hideDoubleClickTip = localStorage.getItem('jiaheHideDoubleClickTip')
    if (hideDoubleClickTip === 'true') {
      setShowDoubleClickTip(false)
    }
  }, [])

  // 切换到指定部分的指定题目
  const goToQuestion = (section: CurrentSection, index: number) => {
    if (!examData) return
    
    const maxIndex = examData.sections[section].questions.length - 1
    if (index >= 0 && index <= maxIndex) {
      setCurrentSection(section)
      setCurrentQuestionIndex(index)
      saveCurrentPosition(section, index)
    }
  }

  // 下一题
  const goToNextQuestion = () => {
    if (!examData) return
    
    const currentSectionData = examData.sections[currentSection]
    
    if (currentQuestionIndex < currentSectionData.questions.length - 1) {
      // 当前部分还有下一题
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      saveCurrentPosition(currentSection, nextIndex)
    } else if (currentSection === 'logic') {
      // 逻辑测试完成，切换到性格测试
      setCurrentSection('personality')
      setCurrentQuestionIndex(0)
      saveCurrentPosition('personality', 0)
    }
    // 如果是性格测试的最后一题，保持在当前位置
  }

  // 上一题
  const goToPreviousQuestion = () => {
    if (!examData) return
    
    if (currentQuestionIndex > 0) {
      // 当前部分还有上一题
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      saveCurrentPosition(currentSection, prevIndex)
    } else if (currentSection === 'personality') {
      // 回到逻辑测试的最后一题
      const logicQuestions = examData.sections.logic.questions.length
      setCurrentSection('logic')
      setCurrentQuestionIndex(logicQuestions - 1)
      saveCurrentPosition('logic', logicQuestions - 1)
    }
  }

  // 提交答案
  const handleSubmit = async () => {
    if (!examData) return

    setIsSubmitting(true)
    setError('')
    
    console.log('开始提交嘉禾面试答案...', { 
      sessionId: examData.sessionId, 
      answersCount: Object.keys(answers).length 
    })

    try {
      const response = await fetch(JIAHE_INTERVIEW_CONSTANTS.API_ENDPOINTS.SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: examData.sessionId,
          employeeName: examData.employeeName,
          startedAt: examData.startedAt,
          answers
        })
      })

      console.log('API 响应状态:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('API 响应结果:', result)

      if (result.success) {
        console.log('提交成功，准备跳转...')
        
        // 标记提交完成，允许无提示离开页面
        setIsSubmissionCompleted(true)
        
        // 保存结果到localStorage
        localStorage.setItem('jiaheInterviewResult', JSON.stringify(result.data))
        
        // 清理考试数据
        localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.EXAM_DATA)
        localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.ANSWERS)
        localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_SECTION)
        localStorage.removeItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.CURRENT_QUESTION)
        
        // 跳转到结果页面
        setTimeout(() => {
          window.location.href = JIAHE_INTERVIEW_CONSTANTS.ROUTES.RESULT
        }, 100)
      } else {
        console.error('提交失败:', result.message)
        setError(result.message || '提交失败，请重试')
      }
    } catch (error) {
      console.error('提交过程中发生错误:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      setError(`提交失败：${errorMessage}`)
    } finally {
      setIsSubmitting(false)
      setShowConfirmSubmit(false)
    }
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (!examData) {
    return (
      <>
        <ModuleHeader
          title="嘉禾面试测试"
          description="江苏嘉禾植保面试测试系统 - 加载中"
          icon={GraduationCap}
          showAuthStatus={false}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 flex items-center justify-center pt-28">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-400 rounded-full animate-spin animate-reverse mx-auto" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600">正在加载考试数据...</p>
              <p className="text-sm text-gray-500">请稍候，系统正在准备您的试卷</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const currentSectionData = examData.sections[currentSection]
  const currentQuestion = currentSectionData.questions[currentQuestionIndex]
  
  // 计算总体进度
  const logicAnswered = examData.sections.logic.questions
    .filter(q => answers.hasOwnProperty(q.id)).length
  const personalityAnswered = examData.sections.personality.questions
    .filter(q => answers.hasOwnProperty(q.id)).length
  const totalAnswered = logicAnswered + personalityAnswered
  const totalQuestions = examData.testInfo.totalQuestions
  const isAllAnswered = totalAnswered === totalQuestions

  // 计算当前部分进度
  const currentSectionAnswered = currentSectionData.questions
    .filter(q => answers.hasOwnProperty(q.id)).length

  return (
    <>
      <ModuleHeader
        title="嘉禾面试测试"
        description="江苏嘉禾植保面试测试系统 - 答题进行中"
        icon={GraduationCap}
        showAuthStatus={false}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 relative overflow-hidden pt-28">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />
        
        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* 题目导航侧边栏 */}
              <div className="lg:w-80 lg:flex-shrink-0 order-1">
                <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      答题进度
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      点击题号快速跳转
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* 逻辑测试部分 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">逻辑测试</span>
                        <Badge variant="outline" className="text-xs">
                          {logicAnswered}/{examData.sections.logic.questions.length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 mb-2">
                        {examData.sections.logic.questions.map((question, index) => {
                          const isAnswered = answers.hasOwnProperty(question.id)
                          const isCurrent = currentSection === 'logic' && index === currentQuestionIndex
                          
                          return (
                            <button
                              key={index}
                              onClick={() => goToQuestion('logic', index)}
                              className={`
                                w-full h-8 text-xs rounded-lg flex items-center justify-center font-medium transition-all duration-200 transform hover:scale-105
                                ${isCurrent 
                                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                                  : isAnswered 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                                }
                              `}
                            >
                              {index + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* 性格测试部分 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium text-teal-700">性格测试</span>
                        <Badge variant="outline" className="text-xs">
                          {personalityAnswered}/{examData.sections.personality.questions.length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 mb-2">
                        {examData.sections.personality.questions.map((question, index) => {
                          const isAnswered = answers.hasOwnProperty(question.id)
                          const isCurrent = currentSection === 'personality' && index === currentQuestionIndex
                          
                          return (
                            <button
                              key={index}
                              onClick={() => goToQuestion('personality', index)}
                              className={`
                                w-full h-8 text-xs rounded-lg flex items-center justify-center font-medium transition-all duration-200 transform hover:scale-105
                                ${isCurrent 
                                  ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg' 
                                  : isAnswered 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                                }
                              `}
                            >
                              {index + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                          <span className="text-blue-700 font-medium">当前题目</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-100 rounded-full border border-green-300" />
                          <span className="text-green-700">已作答</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-100 rounded-full border border-gray-300" />
                          <span className="text-gray-600">未作答</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 主要答题区域 */}
              <div className="flex-1 order-2">
                <div className="space-y-4">
                  {/* 进度状态卡片 */}
                  <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200">
                            <User className="w-3 h-3" />
                            {examData.employeeName}
                          </Badge>
                          <Badge variant="outline" className={`flex items-center gap-2 ${
                            currentSection === 'logic' 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-teal-50 text-teal-700 border-teal-200'
                          }`}>
                            {currentSection === 'logic' ? <Brain className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {currentSectionData.title}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-700">
                              用时: {formatTime(elapsedTime)}
                            </span>
                          </div>
                          
                          <div className="text-sm bg-white/70 px-3 py-1 rounded-full border border-gray-300">
                            <span className="text-green-600 font-medium">{totalAnswered}</span>
                            <span className="text-gray-600"> / {totalQuestions}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            总进度: {totalAnswered} / {totalQuestions} 题
                          </span>
                          <span className="text-xs text-gray-500">
                            (当前: {currentSectionData.title} 第 {currentQuestionIndex + 1} 题)
                          </span>
                        </div>
                        <Progress 
                          value={(totalAnswered / totalQuestions) * 100} 
                          className="h-2.5 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-teal-500" 
                        />
                        
                        <div className="flex items-center gap-2 mt-2 mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            {currentSectionData.title}: {currentSectionAnswered} / {currentSectionData.totalQuestions} 题
                          </span>
                        </div>
                        <Progress 
                          value={(currentSectionAnswered / currentSectionData.totalQuestions) * 100} 
                          className={`h-2 bg-gray-200 ${
                            currentSection === 'logic' 
                              ? '[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500'
                              : '[&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-green-500'
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 双击操作提示 */}
                  {showDoubleClickTip && (
                    <Alert className="border-blue-200 bg-blue-50/90 backdrop-blur-sm shadow-lg">
                      <div className="flex items-start gap-3">
                        <MousePointer2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <AlertDescription className="text-blue-800">
                            <div className="flex items-center justify-between">
                              <div>
                                <strong className="font-medium">快捷操作提示：</strong>
                                <br />
                                双击任意选项可直接选择答案并自动跳转到下一题，提高答题效率！
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={dismissDoubleClickTip}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 ml-2 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* 部分说明 */}
                  <Alert className={`border-2 shadow-lg ${
                    currentSection === 'logic' 
                      ? 'border-purple-200 bg-purple-50/90' 
                      : 'border-teal-200 bg-teal-50/90'
                  }`}>
                    <div className="flex items-start gap-3">
                      {currentSection === 'logic' ? 
                        <Brain className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" /> :
                        <Users className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      }
                      <div className="flex-1">
                        <AlertDescription className={currentSection === 'logic' ? 'text-purple-800' : 'text-teal-800'}>
                          <strong className="font-medium">{currentSectionData.title}</strong>
                          <br />
                          {currentSectionData.description}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>

                  {/* 当前题目 */}
                  <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`${
                              currentSection === 'logic' 
                                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                                : 'bg-teal-100 text-teal-700 border-teal-200'
                            }`}>
                              第 {currentQuestionIndex + 1} 题
                            </Badge>
                            <Badge variant="outline" className="border-gray-300 text-gray-600">
                              题号: {currentQuestion.questionNumber}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg lg:text-xl leading-relaxed text-gray-700">
                            {currentQuestion.questionText}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: 'A', text: currentQuestion.optionA },
                          { key: 'B', text: currentQuestion.optionB },
                          { key: 'C', text: currentQuestion.optionC },
                          { key: 'D', text: currentQuestion.optionD }
                        ].filter(option => option.text && option.text.trim() !== '').map(option => {
                          const isSelected = answers[currentQuestion.id] === option.key
                          return (
                            <div 
                              key={option.key}
                              onClick={() => handleAnswerSelect(currentQuestion.id, option.key)}
                              onDoubleClick={() => handleDoubleClickOption(currentQuestion.id, option.key)}
                              className={`flex items-start space-x-3 p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                isSelected 
                                  ? currentSection === 'logic'
                                    ? 'border-purple-300 bg-purple-50 shadow-sm'
                                    : 'border-teal-300 bg-teal-50 shadow-sm'
                                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                              }`}
                              title="双击可选择答案并自动跳转到下一题"
                            >
                              <div className="flex-1 cursor-pointer leading-relaxed text-sm lg:text-base">
                                <span className={`font-medium mr-2 lg:mr-3 inline-flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full text-xs ${
                                  isSelected 
                                    ? currentSection === 'logic'
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-teal-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {option.key}
                                </span>
                                <span className={isSelected 
                                  ? currentSection === 'logic'
                                    ? 'text-purple-700 font-medium'
                                    : 'text-teal-700 font-medium'
                                  : 'text-gray-700'
                                }>
                                  {option.text}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 导航按钮 */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentSection === 'logic' && currentQuestionIndex === 0}
                      className="w-full sm:w-auto flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      上一题
                    </Button>

                    <div className="flex items-center gap-3">
                      {/* 如果所有题目都已作答，显示提交按钮 */}
                      {isAllAnswered ? (
                        <Button
                          onClick={() => setShowConfirmSubmit(true)}
                          className="w-full sm:w-auto flex items-center gap-2 px-6 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4" />
                          提交试卷
                        </Button>
                      ) : (
                        /* 继续下一题或提交未完成的试卷 */
                        <div className="flex gap-2">
                          {(currentSection === 'personality' && 
                            currentQuestionIndex === examData.sections.personality.questions.length - 1) ? (
                            /* 在性格测试最后一题，显示提交按钮 */
                            <Button
                              onClick={() => setShowConfirmSubmit(true)}
                              variant="outline"
                              className="w-full sm:w-auto flex items-center gap-2 px-6 border-gray-300 text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                              提交试卷（还有未答题目）
                            </Button>
                          ) : (
                            /* 显示下一题按钮 */
                            <Button
                              onClick={goToNextQuestion}
                              className={`w-full sm:w-auto flex items-center gap-2 ${
                                currentSection === 'logic' 
                                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                                  : 'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600'
                              }`}
                            >
                              下一题
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 提交确认对话框 */}
                  {showConfirmSubmit && (
                    <Card className="border-orange-200 bg-orange-50/90 backdrop-blur-sm shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-orange-500 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 mb-2">
                              确认提交试卷
                            </h3>
                            
                            <p className="text-orange-800 mb-4">
                              您已完成 {totalAnswered} / {totalQuestions} 道题目。
                              {!isAllAnswered && '请注意：还有题目未作答，提交后将无法修改。'}
                              确认是否提交？
                            </p>
                            
                            {error && (
                              <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    正在提交...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    确认提交
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setShowConfirmSubmit(false)}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-100"
                              >
                                继续答题
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-4 pb-6">
          <PlatformFooter className="text-center" />
        </div>
      </div>
    </>
  )
}