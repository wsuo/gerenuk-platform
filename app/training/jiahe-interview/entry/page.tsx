"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleHeader } from '@/components/module-header'
import { PlatformFooter } from '@/components/platform-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  GraduationCap,
  Building2,
  Brain,
  UserCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { JIAHE_INTERVIEW_CONSTANTS } from '@/lib/jiahe-interview-config'

interface JiaheTestInfo {
  name: string
  description: string
  totalQuestions: number
  logicTestQuestions: number
  personalityTestQuestions: number
  available: boolean
}

export default function JiaheInterviewEntryPage() {
  const [employeeName, setEmployeeName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [testInfo, setTestInfo] = useState<JiaheTestInfo | null>(null)
  const [loadingTestInfo, setLoadingTestInfo] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    loadTestInfo()
  }, [])

  const loadTestInfo = async () => {
    try {
      setLoadingTestInfo(true)
      const response = await fetch(JIAHE_INTERVIEW_CONSTANTS.API_ENDPOINTS.START)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setTestInfo(result.data.testInfo)
        }
      }
    } catch (error) {
      console.error('加载测试信息失败:', error)
      setError('加载测试信息失败，请刷新重试')
    } finally {
      setLoadingTestInfo(false)
    }
  }

  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!employeeName.trim()) {
      setError('请输入您的姓名')
      return
    }

    if (!testInfo?.available) {
      setError('测试题目尚未准备就绪，请联系管理员')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(JIAHE_INTERVIEW_CONSTANTS.API_ENDPOINTS.START, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeName: employeeName.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        // 将考试数据保存到localStorage
        localStorage.setItem(JIAHE_INTERVIEW_CONSTANTS.STORAGE_KEYS.EXAM_DATA, JSON.stringify(result.data))
        
        // 跳转到答题页面
        router.push(JIAHE_INTERVIEW_CONSTANTS.ROUTES.EXAM)
      } else {
        setError(result.message || '开始测试失败')
      }
    } catch (error) {
      setError('网络连接失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ModuleHeader
        title="嘉禾面试测试"
        description="江苏嘉禾植保面试测试系统"
        icon={GraduationCap}
        showAuthStatus={false}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-100 to-gray-50 relative overflow-hidden pt-24 p-4">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              江苏嘉禾植保面试测试
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              综合评估逻辑推理能力和性格特征，为面试提供科学参考
            </p>
          </div>

          {loadingTestInfo ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">正在加载测试信息...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* 左侧：测试介绍 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      测试说明
                    </CardTitle>
                    <CardDescription>
                      本测试包含两个部分，全面评估您的能力和特征
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {testInfo && testInfo.available ? (
                      <div className="space-y-4">
                        {/* 逻辑测试部分 */}
                        <div className="p-4 border-2 rounded-lg border-purple-200 bg-purple-50">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-purple-900">第一部分：逻辑推理测试</div>
                              <div className="text-sm text-purple-700">
                                {testInfo.logicTestQuestions} 道题目
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-purple-800">
                            测试您的逻辑思维和推理能力，每题只有一个正确答案
                          </p>
                        </div>

                        {/* 性格测试部分 */}
                        <div className="p-4 border-2 rounded-lg border-teal-200 bg-teal-50">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-teal-900">第二部分：性格特征测试</div>
                              <div className="text-sm text-teal-700">
                                {testInfo.personalityTestQuestions} 道题目
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-teal-800">
                            了解您的性格特征和工作风格，请根据真实情况作答
                          </p>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                          <div className="text-sm text-green-800">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <strong>总计 {testInfo.totalQuestions} 道题目</strong>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span>无时间限制，请仔细作答</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          测试题目尚未准备就绪，请联系管理员
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* 测试特点 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      测试特点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">科学评估</p>
                        <p className="text-sm text-muted-foreground">
                          基于心理学理论，科学评估逻辑思维和性格特征
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">个性化分析</p>
                        <p className="text-sm text-muted-foreground">
                          提供详细的个人特征分析和职业建议
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">即时反馈</p>
                        <p className="text-sm text-muted-foreground">
                          完成测试后立即查看详细结果报告
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：开始测试表单 */}
              <div className="space-y-6">
                {/* 开始测试表单 */}
                <Card>
                  <CardHeader>
                    <CardTitle>开始测试</CardTitle>
                    <CardDescription>
                      请输入您的姓名，准备开始面试测试
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStartTest} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="employeeName">姓名 *</Label>
                        <Input
                          id="employeeName"
                          type="text"
                          placeholder="请输入您的姓名"
                          value={employeeName}
                          onChange={(e) => setEmployeeName(e.target.value)}
                          required
                          className="text-lg py-3"
                          autoComplete="name"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full text-lg py-6"
                        disabled={isLoading || !employeeName.trim() || !testInfo?.available}
                        size="lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            正在准备测试...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            开始测试
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* 注意事项 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">注意事项</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• 请确保在安静的环境下独立完成测试</p>
                    <p>• 逻辑测试每题只有一个正确答案</p>
                    <p>• 性格测试请根据真实情况作答，无标准答案</p>
                    <p>• 建议一次性完成，中途离开可能丢失进度</p>
                    <p>• 如遇技术问题，请联系技术支持</p>
                  </CardContent>
                </Card>

                {/* 返回按钮 */}
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/training')}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    返回考核首页
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 底部信息 */}
          <PlatformFooter />
        </div>
      </div>
    </>
  )
}