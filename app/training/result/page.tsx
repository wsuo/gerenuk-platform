"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlatformFooter } from '@/components/platform-footer'
import { TrainingResultNavigator } from '@/components/training-result-navigator'
import {
  CheckCircle, 
  XCircle, 
  Award, 
  Clock, 
  User, 
  BookOpen, 
  Target,
  RotateCcw,
  Home,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  Brain,
  BarChart3
} from 'lucide-react'
import { isJiaheInterviewCategory, isJiaheInterviewSet } from '@/lib/jiahe-interview-constants'
import { normalizeChoiceAnswer } from '@/lib/choice-answer'

interface ExamResult {
  recordId: number
  sessionId: string
  employeeName: string
  allowViewScore: boolean // 新增：是否允许查看成绩配置
  score?: number // 改为可选
  totalQuestions: number
  correctAnswers?: number // 改为可选
  wrongAnswers?: number // 改为可选
  accuracy?: number // 改为可选
  sessionDuration: number
  passed?: boolean // 改为可选
  answerDetails?: AnswerDetail[] // 改为可选
  completedAt: string
  // 嘉禾面试测试专用字段
  categoryName?: string
  setName?: string
  jiaheInterviewResult?: any // 嘉禾面试完整结果
}

interface AnswerDetail {
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

export default function TrainingResultPage() {
  const [result, setResult] = useState<ExamResult | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const timelineRef = useRef<HTMLDivElement>(null)
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const formatAnswer = (answer: string) => {
    const normalized = normalizeChoiceAnswer(answer || '')
    return normalized ? normalized.split('').join(',') : ''
  }

  const getSelectedOptionText = (detail: AnswerDetail) => {
    const selected = normalizeChoiceAnswer(detail.selectedAnswer || '')
    if (!selected) return '未作答'
    return selected
      .split('')
      .map((opt) => `${opt}. ${detail[`option${opt}` as keyof AnswerDetail] as string}`)
      .join('；')
  }

  useEffect(() => {
    // 从localStorage加载结果数据
    const savedResult = localStorage.getItem('examResult')
    if (savedResult) {
      try {
        const data = JSON.parse(savedResult)
        setResult(data)
      } catch (error) {
        console.error('加载考试结果失败:', error)
        router.push('/training')
      }
    } else {
      // 没有结果数据，重定向到入口页面
      router.push('/training')
    }
    setLoading(false)
  }, [router])

  const handleRetakeExam = () => {
    // 清除结果数据
    localStorage.removeItem('examResult')
    // 返回入口页面重新开始
    router.push('/training')
  }

  const handleGoHome = () => {
    // 清除结果数据
    localStorage.removeItem('examResult')
    // 返回首页
    router.push('/')
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  const getScoreColor = (score: number, passed: boolean) => {
    if (!passed) return 'text-red-600'
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    return 'text-orange-600'
  }

  const getScoreBadgeColor = (score: number, passed: boolean) => {
    if (!passed) return 'bg-red-100 text-red-800 border-red-200'
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  // 导航到指定题目
  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
    const questionElement = questionRefs.current[questionIndex]
    if (questionElement && timelineRef.current) {
      // 平滑滚动到指定题目
      const timelineContainer = timelineRef.current
      const containerRect = timelineContainer.getBoundingClientRect()
      const questionRect = questionElement.getBoundingClientRect()
      
      const scrollTop = timelineContainer.scrollTop + questionRect.top - containerRect.top - 20
      
      timelineContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  // 监听滚动位置，更新当前题目索引
  const handleScroll = () => {
    if (!timelineRef.current || !result) return
    
    const timelineContainer = timelineRef.current
    const containerRect = timelineContainer.getBoundingClientRect()
    const containerCenter = containerRect.top + containerRect.height / 2
    
    let closestIndex = 0
    let minDistance = Infinity
    
    result.answerDetails.forEach((_, index) => {
      const questionElement = questionRefs.current[index]
      if (questionElement) {
        const questionRect = questionElement.getBoundingClientRect()
        const questionCenter = questionRect.top + questionRect.height / 2
        const distance = Math.abs(questionCenter - containerCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = index
        }
      }
    })
    
    if (closestIndex !== currentQuestionIndex) {
      setCurrentQuestionIndex(closestIndex)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">加载考试结果中...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">未找到考试结果</h2>
            <p className="text-muted-foreground mb-4">请重新参加考试</p>
            <Button onClick={handleRetakeExam}>
              重新考试
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 判断是否为嘉禾面试测试
  const isJiaheInterview = (result.categoryName && isJiaheInterviewCategory(result.categoryName)) ||
                          (result.setName && isJiaheInterviewSet(result.setName)) ||
                          !!result.jiaheInterviewResult

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {!result.allowViewScore ? (
          // 不允许查看成绩的情况 - 只显示完成信息
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-blue-100">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                测验已完成
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                感谢您完成本次测验，您的答题记录已保存
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">姓名</span>
                  <span className="font-medium">{result.employeeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">完成时间</span>
                  <span className="font-medium">
                    {new Date(result.completedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">题目数量</span>
                  <span className="font-medium">{result.totalQuestions} 题</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">答题时长</span>
                  <span className="font-medium">{formatDuration(result.sessionDuration)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleGoHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
              <Button onClick={handleRetakeExam} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                重新考试
              </Button>
            </div>
          </div>
        ) : isJiaheInterview ? (
          // 嘉禾面试测试专门显示逻辑
          <div className="max-w-5xl mx-auto">
            {/* 嘉禾面试结果头部 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-emerald-100">
                <Brain className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                江苏嘉禾植保面试测试完成
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                您已完成逻辑推理测试和性格特征测试
              </p>
            </div>

            {/* 嘉禾面试测试结果详情 */}
            {result.jiaheInterviewResult && (
              <>
                {/* 基本信息和总结 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* 基本信息卡片 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        测试信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">姓名</span>
                        <span className="font-medium">{result.employeeName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">完成时间</span>
                        <span className="font-medium">
                          {new Date(result.completedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">答题时长</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(result.sessionDuration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">总题数</span>
                        <span className="font-medium">{result.totalQuestions} 题</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 逻辑测试成绩卡片 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        逻辑推理测试
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">题目数量</span>
                        <span className="font-medium">{result.jiaheInterviewResult.logicResult.totalQuestions} 题</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">正确数量</span>
                        <span className="font-medium text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {result.jiaheInterviewResult.logicResult.correctAnswers} 题
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">错误数量</span>
                        <span className="font-medium text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          {result.jiaheInterviewResult.logicResult.wrongAnswers} 题
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">正确率</span>
                        <span className="font-medium text-blue-600">
                          {result.jiaheInterviewResult.logicResult.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">准确度进度</span>
                          <span className="font-medium">{result.jiaheInterviewResult.logicResult.accuracy.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={result.jiaheInterviewResult.logicResult.accuracy} 
                          className="h-3 [&>div]:bg-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 性格测试结果 */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      D-I-S-C 性格特征分析
                    </CardTitle>
                    <CardDescription>
                      基于您在性格测试中的选择，以下是您的性格特征分析结果
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 主导性格类型 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">主导性格类型</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {result.jiaheInterviewResult.personalityResult.dominantTypes.map((type, index) => (
                          <div key={type.type} className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-1">{type.name}</h5>
                            <p className="text-sm text-gray-600">
                              {type.score} 选择 ({(type.percentage * 100).toFixed(1)}%)
                            </p>
                            <div className="mt-2">
                              <Progress value={type.percentage * 100} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 突出特征 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">突出特征</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.jiaheInterviewResult.personalityResult.characteristics.map((characteristic, index) => (
                          <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                            {characteristic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 性格分析总结 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">性格分析总结</h4>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-gray-800 leading-relaxed">
                          {result.jiaheInterviewResult.personalityResult.summary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 综合评价 */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      综合评价
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-gray-800 leading-relaxed">
                        {result.jiaheInterviewResult.overallSummary}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 逻辑测试详情（只显示逻辑题的对错） */}
                {result.answerDetails && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        逻辑推理测试详情
                      </CardTitle>
                      <CardDescription>
                        以下显示逻辑推理题目的答题情况（性格测试题目无对错之分）
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.answerDetails
                          .filter((detail, index) => index < result.jiaheInterviewResult.logicResult.totalQuestions) // 只显示逻辑题
                          .map((detail, index) => (
                          <div
                            key={detail.questionId}
                            className={`p-4 border rounded-lg transition-all ${
                              detail.isCorrect 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-red-200 bg-red-50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                detail.isCorrect 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              }`}>
                                {detail.questionNumber}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {detail.isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
                                  </h4>
                                  <div className="flex gap-2 text-xs">
                                    <span className="text-gray-600">
                                      正确: <span className="font-medium text-green-700">{formatAnswer(detail.correctAnswer)}</span>
                                    </span>
                                    <span className="text-gray-600">
                                      您选: <span className={`font-medium ${
                                        detail.selectedAnswer === detail.correctAnswer ? 'text-green-700' : 'text-red-700'
                                      }`}>
                                        {formatAnswer(detail.selectedAnswer) || '未作答'}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{detail.questionText}</p>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">选项:</span> {getSelectedOptionText(detail)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleGoHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                返回首页
              </Button>
              <Button onClick={handleRetakeExam} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                重新测试
              </Button>
            </div>
          </div>
        ) : (
          // 允许查看成绩的情况 - 显示详细成绩
          <>
            {/* 结果概览 */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                result.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.passed ? (
                  <Award className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {result.passed ? '恭喜，考试通过！' : '考试未通过'}
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                {result.passed 
                  ? '您已成功完成培训考试' 
                  : '建议您继续学习相关知识后重新参加考试'
                }
              </p>
              
              <Badge className={`text-lg px-4 py-1 ${getScoreBadgeColor(result.score!, result.passed!)}`}>
                {result.score} 分
              </Badge>
            </div>

        {/* 成绩详情卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                考试信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">姓名</span>
                <span className="font-medium">{result.employeeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">完成时间</span>
                <span className="font-medium">
                  {new Date(result.completedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">用时</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(result.sessionDuration)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">考试状态</span>
                <Badge variant={result.passed ? "default" : "destructive"}>
                  {result.passed ? "通过" : "未通过"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 成绩统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                成绩统计
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总题数</span>
                <span className="font-medium">{result.totalQuestions} 题</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">正确数</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {result.correctAnswers} 题
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">错误数</span>
                <span className="font-medium text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {result.wrongAnswers} 题
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">正确率</span>
                <span className={`font-medium ${getScoreColor(result.score, result.passed)}`}>
                  {result.accuracy}%
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">得分进度</span>
                  <span className="font-medium">{result.score}/100</span>
                </div>
                <Progress 
                  value={result.score} 
                  className={`h-3 ${result.passed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 答题详情分析 - 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-3">
            <TrainingResultNavigator
              answerDetails={result.answerDetails}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              employeeName={result.employeeName}
              score={result.score}
              totalQuestions={result.totalQuestions}
              correctAnswers={result.correctAnswers}
              className="sticky top-4"
            />
          </div>

          {/* 右侧时间轴 */}
          <div className="lg:col-span-9">
            <Card className="flex flex-col" style={{height: '800px'}}>
              <CardHeader className="pb-4 border-b flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    答题详情时间轴
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>第 {currentQuestionIndex + 1} / {result.totalQuestions} 题</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  点击左侧题号或使用鼠标滚轮浏览所有答题详情
                </CardDescription>
              </CardHeader>
              
              <div className="flex-1 relative min-h-0">
                <div 
                  ref={timelineRef}
                  className="absolute inset-0 overflow-y-auto px-4 py-6"
                  onScroll={handleScroll}
                >
                  <div className="relative space-y-6">
                    {/* 时间轴线 */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-300" />
                    
                    {result.answerDetails.map((detail, index) => (
                      <div
                        key={detail.questionId}
                        ref={el => { questionRefs.current[index] = el }}
                        className={`relative pl-12 transition-all duration-200`}
                      >
                        {/* 时间轴节点 */}
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-white border-2 transition-all duration-200 ${
                          detail.isCorrect 
                            ? 'border-green-400 text-green-600' 
                            : 'border-red-400 text-red-600'
                        } ${index === currentQuestionIndex ? 'scale-110 shadow-lg' : 'shadow-sm'}`}>
                          {detail.questionNumber}
                        </div>
                        
                        {/* 题目卡片 */}
                        <Card className={`overflow-hidden border transition-all duration-200 ${
                          detail.isCorrect 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        } hover:shadow-md`}>
                          {/* 题目头部 */}
                          <CardHeader className={`pb-3 border-b ${
                            detail.isCorrect 
                              ? 'bg-green-100 border-green-200' 
                              : 'bg-red-100 border-red-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {detail.isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <div>
                                  <div className={`font-semibold ${
                                    detail.isCorrect ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    {detail.isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    正确: <span className="font-medium text-green-700">{formatAnswer(detail.correctAnswer)}</span> | 
                                    您选: <span className={`font-medium ${
                                      detail.selectedAnswer === detail.correctAnswer ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                      {formatAnswer(detail.selectedAnswer) || '未作答'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <Badge 
                                variant={detail.isCorrect ? "default" : "destructive"}
                                className="text-xs px-2 py-1"
                              >
                                第 {detail.questionNumber} 题
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 space-y-4">
                            {/* 题目内容 */}
                            <div>
                              <h4 className="font-medium text-base text-gray-900 mb-3 leading-relaxed">
                                {detail.questionText}
                              </h4>
                              
                              {/* 选项列表 */}
                              <div className="space-y-2">
                                {['A', 'B', 'C', 'D'].map((option) => {
                                  const optionText = detail[`option${option}` as keyof AnswerDetail] as string
                                  const isSelected = normalizeChoiceAnswer(detail.selectedAnswer || '').includes(option)
                                  const isCorrect = normalizeChoiceAnswer(detail.correctAnswer || '').includes(option)
                                  
                                  return (
                                    <div
                                      key={option}
                                      className={`relative p-3 rounded-lg border transition-all duration-100 ${
                                        isCorrect
                                          ? 'bg-green-100 border-green-300'
                                          : isSelected && !isCorrect
                                          ? 'bg-red-100 border-red-300'
                                          : 'bg-white border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border ${
                                          isCorrect
                                            ? 'bg-green-500 text-white border-green-600'
                                            : isSelected && !isCorrect
                                            ? 'bg-red-500 text-white border-red-600'
                                            : 'bg-gray-100 text-gray-700 border-gray-300'
                                        }`}>
                                          {option}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-gray-900 leading-relaxed">
                                            {optionText}
                                          </p>
                                        </div>
                                        
                                        {/* 状态标识 */}
                                        <div className="flex gap-1">
                                          {isSelected && (
                                            <Badge 
                                              variant={isCorrect ? "default" : "destructive"} 
                                              className="text-xs px-1.5 py-0.5"
                                            >
                                              选择
                                            </Badge>
                                          )}
                                          {isCorrect && (
                                            <Badge 
                                              variant="outline" 
                                              className="text-xs px-1.5 py-0.5 bg-green-50 border-green-300 text-green-800"
                                            >
                                              正解
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* 解析说明 */}
                            {detail.explanation && (
                              <div className="p-3 bg-blue-50 rounded">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">?</span>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-blue-900 mb-1 text-sm">解析</h5>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                      {detail.explanation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 滚动提示 */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 bg-white shadow-md"
                    onClick={() => handleQuestionSelect(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 bg-white shadow-md"
                    onClick={() => handleQuestionSelect(Math.min(result.answerDetails.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === result.answerDetails.length - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Button>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8 text-sm text-muted-foreground space-y-2">
          <p>考试结果已自动保存，如需重新参加考试或查询历史记录请联系管理员</p>
          <PlatformFooter />
        </div>
          </>
        )}
      </div>
    </div>
  )
}
