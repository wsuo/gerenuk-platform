"use client"

import React, { useEffect, useState } from 'react'
import { ModuleHeader } from '@/components/module-header'
import { PlatformFooter } from '@/components/platform-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, User, Trophy, X } from 'lucide-react'

export default function TrainingCompletePage() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    // 清理考试相关数据
    localStorage.removeItem('trainingExamData')
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('exam-answers-')) {
        localStorage.removeItem(key)
      }
    })

    // 在客户端设置当前时间，使用本地时区
    const now = new Date()
    const timeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    setCurrentTime(timeString)
  }, [])

  const handleCloseWindow = () => {
    // 尝试关闭窗口
    if (window.opener) {
      // 如果是在新窗口中打开的，关闭窗口
      window.close()
    } else {
      // 如果不能关闭，跳转到主页
      window.location.href = '/training'
    }
  }

  return (
    <>
      <ModuleHeader
        title="考核完成"
        description="员工培训考试系统 - 考核已完成"
        icon={Trophy}
        showAuthStatus={false}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 relative overflow-hidden pt-28">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />
        
        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* 成功图标 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                考核已完成
              </h1>
              <p className="text-lg text-gray-600">
                恭喜您完成本次考核，感谢您的参与！
              </p>
            </div>

            {/* 完成状态卡片 */}
            <Card className="bg-white/95 backdrop-blur-xl border-green-200/50 shadow-lg mb-6">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-base">
                    <Trophy className="w-4 h-4 mr-2" />
                    考核完成
                  </Badge>
                </div>
                <CardTitle className="text-xl text-green-800">
                  您的答题记录已成功提交
                </CardTitle>
                <CardDescription className="text-green-600 mt-2">
                  系统已保存您的考核数据，相关人员将会查看您的考核情况
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-700">答题状态</div>
                    <div className="text-lg font-bold text-green-800">已完成</div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-700">提交时间</div>
                    <div className="text-sm font-bold text-blue-800">
                      {currentTime || '加载中...'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <User className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-700">记录状态</div>
                    <div className="text-lg font-bold text-purple-800">已保存</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 重要提示 */}
            <Card className="bg-amber-50/80 backdrop-blur-xl border-amber-200/50 shadow-lg mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">重要说明</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      本次考核不提供即时成绩查看。相关人员将对您的考核结果进行评估，并通过适当渠道通知您结果。请耐心等待后续通知。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleCloseWindow}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg shadow-lg"
              >
                <X className="w-5 h-5 mr-2" />
                关闭页面
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/training'}
                className="w-full sm:w-auto px-8 py-3 border-green-300 text-green-700 hover:bg-green-50 text-lg"
              >
                返回首页
              </Button>
            </div>

            {/* 联系信息 */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>如有技术问题或疑问，请联系系统管理员</p>
            </div>
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