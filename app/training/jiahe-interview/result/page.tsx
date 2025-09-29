"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleHeader } from '@/components/module-header'
import { PlatformFooter } from '@/components/platform-footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle,
  Clock, 
  User, 
  BookOpen, 
  AlertCircle, 
  ArrowLeft, 
  GraduationCap,
  Brain,
  Users,
  FileText,
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Award,
  Target
} from 'lucide-react'

interface JiaheInterviewResultData {
  recordId: number
  sessionId: string
  employeeName: string
  completedAt: string
  sessionDuration: number
  
  logicTest: {
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
  
  personalityTest: {
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
  
  overallSummary: string
  detailedReport: string
}

export default function JiaheInterviewResultPage() {
  const [resultData, setResultData] = useState<JiaheInterviewResultData | null>(null)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [showAnswerDetails, setShowAnswerDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    // 从localStorage加载结果数据
    const savedResult = localStorage.getItem('jiaheInterviewResult')
    if (savedResult) {
      try {
        const data = JSON.parse(savedResult)
        setResultData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('解析结果数据失败:', error)
        router.push('/training')
      }
    } else {
      // 没有结果数据，重定向到入口页面
      router.push('/training')
    }
  }, [router])

  // 格式化时间
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (minutes > 0) {
      return `${minutes} 分 ${secs} 秒`
    }
    return `${secs} 秒`
  }

  // 下载详细报告
  const downloadReport = () => {
    if (!resultData) return
    
    const element = document.createElement('a')
    const file = new Blob([resultData.detailedReport], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `嘉禾面试测试报告_${resultData.employeeName}_${new Date().toLocaleDateString()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // 返回首页
  const goBack = () => {
    // 清理结果数据
    localStorage.removeItem('jiaheInterviewResult')
    router.push('/training')
  }

  if (isLoading) {
    return (
      <>
        <ModuleHeader
          title="嘉禾面试测试"
          description="江苏嘉禾植保面试测试系统 - 加载结果"
          icon={GraduationCap}
          showAuthStatus={false}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-100 to-gray-50 flex items-center justify-center pt-28">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600">正在加载测试结果...</p>
              <p className="text-sm text-gray-500">请稍候，系统正在准备您的结果报告</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!resultData) {
    return (
      <>
        <ModuleHeader
          title="嘉禾面试测试"
          description="江苏嘉禾植保面试测试系统"
          icon={GraduationCap}
          showAuthStatus={false}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-100 to-gray-50 flex items-center justify-center pt-28">
          <div className="text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-600">未找到测试结果</p>
              <p className="text-sm text-gray-500">请重新进行测试</p>
              <Button onClick={goBack} className="mt-4">
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ModuleHeader
        title="嘉禾面试测试"
        description="江苏嘉禾植保面试测试系统 - 测试结果"
        icon={GraduationCap}
        showAuthStatus={false}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-100 to-gray-50 relative overflow-hidden pt-28">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* 头部信息 */}
            <Card className="bg-white/95 backdrop-blur-xl border-green-200/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                      <Award className="w-8 h-8 text-green-600" />
                      测试完成！
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      恭喜您完成江苏嘉禾植保面试测试，以下是您的详细结果
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    返回首页
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600">姓名</p>
                      <p className="font-medium text-blue-800">{resultData.employeeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600">用时</p>
                      <p className="font-medium text-purple-800">{formatDuration(resultData.sessionDuration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-600">完成时间</p>
                      <p className="font-medium text-orange-800">
                        {new Date(resultData.completedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600">记录ID</p>
                      <p className="font-medium text-green-800">#{resultData.recordId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 逻辑测试结果 */}
              <Card className="bg-white/95 backdrop-blur-xl border-purple-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Brain className="w-5 h-5" />
                    逻辑推理测试结果
                  </CardTitle>
                  <CardDescription>
                    测试您的逻辑思维和推理能力
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 分数概览 */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{resultData.logicTest.totalQuestions}</p>
                      <p className="text-sm text-purple-600">总题数</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{resultData.logicTest.correctAnswers}</p>
                      <p className="text-sm text-green-600">正确</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{resultData.logicTest.wrongAnswers}</p>
                      <p className="text-sm text-red-600">错误</p>
                    </div>
                  </div>

                  {/* 正确率进度条 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">正确率</span>
                      <span className="text-sm font-bold text-purple-600">
                        {resultData.logicTest.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={resultData.logicTest.accuracy} 
                      className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" 
                    />
                  </div>

                  {/* 评价 */}
                  <Alert className={`border-2 ${
                    resultData.logicTest.accuracy >= 80 
                      ? 'border-green-200 bg-green-50' 
                      : resultData.logicTest.accuracy >= 60 
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      {resultData.logicTest.accuracy >= 80 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : resultData.logicTest.accuracy >= 60 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <AlertDescription className={
                        resultData.logicTest.accuracy >= 80 
                          ? 'text-green-800' 
                          : resultData.logicTest.accuracy >= 60 
                            ? 'text-yellow-800'
                            : 'text-red-800'
                      }>
                        <strong>
                          {resultData.logicTest.accuracy >= 80 
                            ? '优秀' 
                            : resultData.logicTest.accuracy >= 60 
                              ? '良好'
                              : '有待提升'
                          }
                        </strong>
                        <br />
                        {resultData.logicTest.accuracy >= 80 
                          ? '您的逻辑推理能力表现优秀，具备良好的分析和解决问题的能力。' 
                          : resultData.logicTest.accuracy >= 60 
                            ? '您的逻辑推理能力表现良好，在某些方面仍有提升空间。'
                            : '建议加强逻辑思维训练，提升分析和推理能力。'
                        }
                      </AlertDescription>
                    </div>
                  </Alert>

                  {/* 查看详细答案按钮 */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAnswerDetails(!showAnswerDetails)}
                    className="w-full flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Eye className="w-4 h-4" />
                    {showAnswerDetails ? '隐藏' : '查看'}详细答案
                  </Button>
                </CardContent>
              </Card>

              {/* 性格测试结果 */}
              <Card className="bg-white/95 backdrop-blur-xl border-teal-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-700">
                    <Users className="w-5 h-5" />
                    性格特征测试结果
                  </CardTitle>
                  <CardDescription>
                    分析您的性格倾向和工作风格
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 主要性格类型 */}
                  {resultData.personalityTest.dominantTypes.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-teal-700">主要性格特征</h4>
                      {resultData.personalityTest.dominantTypes.slice(0, 3).map((type, index) => (
                        <div key={type.type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {index + 1}. {type.name}
                            </span>
                            <Badge variant="outline" className="text-teal-600 border-teal-300">
                              {(type.percentage * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress 
                            value={type.percentage * 100} 
                            className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-green-500" 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert className="border-gray-200 bg-gray-50">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <AlertDescription className="text-gray-700">
                        暂无明显的性格倾向特征
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* 突出特征 */}
                  {resultData.personalityTest.characteristics.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-teal-700">突出特征</h4>
                      <div className="flex flex-wrap gap-2">
                        {resultData.personalityTest.characteristics.slice(0, 6).map((char, index) => (
                          <Badge key={index} variant="secondary" className="bg-teal-100 text-teal-700">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 性格分析总结 */}
                  <Alert className="border-teal-200 bg-teal-50">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <AlertDescription className="text-teal-800">
                      <strong>性格分析：</strong>
                      <br />
                      {resultData.personalityTest.summary}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* 详细答案展示 */}
            {showAnswerDetails && (
              <Card className="bg-white/95 backdrop-blur-xl border-purple-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <BarChart3 className="w-5 h-5" />
                    逻辑测试详细答案
                  </CardTitle>
                  <CardDescription>
                    查看每道题的答题情况和正确答案
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {resultData.logicTest.answerDetails.map((detail, index) => (
                      <div key={index} className={`p-4 rounded-lg border-2 ${
                        detail.isCorrect 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {detail.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                第 {detail.questionNumber} 题
                              </Badge>
                              <Badge variant={detail.isCorrect ? "default" : "destructive"} className="text-xs">
                                {detail.isCorrect ? "正确" : "错误"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                              {detail.questionText}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">您的答案:</span>
                                <Badge variant="outline" className={
                                  detail.isCorrect ? "border-green-300 text-green-700" : "border-red-300 text-red-700"
                                }>
                                  {detail.selectedAnswer || "未作答"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">正确答案:</span>
                                <Badge variant="outline" className="border-green-300 text-green-700">
                                  {detail.correctAnswer}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 综合评价 */}
            <Card className="bg-white/95 backdrop-blur-xl border-green-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <BookOpen className="w-5 h-5" />
                  综合评价
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {resultData.overallSummary}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">获取详细报告</h3>
                    <p className="text-sm text-gray-600">
                      下载完整的测试报告，包含详细的分析和建议
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailedReport(!showDetailedReport)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {showDetailedReport ? '隐藏' : '预览'}报告
                    </Button>
                    <Button
                      onClick={downloadReport}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    >
                      <Download className="w-4 h-4" />
                      下载报告
                    </Button>
                  </div>
                </div>

                {/* 详细报告预览 */}
                {showDetailedReport && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        详细报告预览
                      </h4>
                      <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {resultData.detailedReport}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-8 pb-6">
          <PlatformFooter className="text-center" />
        </div>
      </div>
    </>
  )
}