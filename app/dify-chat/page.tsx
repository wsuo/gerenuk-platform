"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Bot, User, RefreshCw, Trash2, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import Link from "next/link"

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  conversationId?: string
}

export default function DifyChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化时设置焦点
  useEffect(() => {
    // 延迟设置焦点，确保组件完全渲染
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // 计算按钮是否应该被禁用
  const isSendDisabled = useMemo(() => {
    return !inputValue.trim() || isLoading
  }, [inputValue, isLoading])

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleString('zh-CN')
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: userMessage.content,
          conversation_id: conversationId,
          user: 'guest_user'
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'API 调用失败')
      }

      const assistantMessage: ChatMessage = {
        id: data.data.message_id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.answer,
        timestamp: new Date().toLocaleString('zh-CN'),
        conversationId: data.data.conversation_id
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // 更新会话 ID
      if (data.data.conversation_id && data.data.conversation_id !== conversationId) {
        setConversationId(data.data.conversation_id)
      }

    } catch (error) {
      console.error('发送消息失败:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toLocaleString('zh-CN')
      }
      
      setMessages(prev => [...prev, errorMessage])
      
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 清空对话
  const clearConversation = () => {
    setMessages([])
    setConversationId("")
    toast({
      title: "对话已清空",
      description: "可以开始新的对话了"
    })
  }

  // 重新开始对话
  const restartConversation = () => {
    setConversationId("")
    toast({
      title: "开始新对话",
      description: "已开始新的对话会话"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50">
      {/* 页面头部 */}
      <ModuleHeader
        title="智能助手"
        subtitle="AI 智能对话助手"
        description="与 AI 助手对话，获取专业的问题解答和建议"
        showBackButton={true}
      />

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* 工具栏 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              智能助手
            </Badge>
            {conversationId && (
              <Badge variant="secondary" className="text-xs">
                对话 ID: {conversationId.slice(-8)}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={restartConversation}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              新对话
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </Button>
          </div>
        </div>

        {/* 聊天区域 */}
        <Card className="flex flex-col min-h-[600px] max-h-[800px]">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              对话区域
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 p-4 min-h-0">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Bot className="w-12 h-12 text-emerald-400" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700">
                      欢迎使用智能助手
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      我是您的 AI 助手，可以为您提供各种问题的解答和建议。请输入您的问题开始对话。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="bg-emerald-50 px-3 py-2 rounded-lg">
                      💡 专业问题解答
                    </div>
                    <div className="bg-emerald-50 px-3 py-2 rounded-lg">
                      📚 知识咨询服务
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] min-w-0 rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-800 border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">
                            {message.role === 'assistant' ? (
                              <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:my-2">
                                <ReactMarkdown
                                  components={{
                                    p: ({children}) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                                    ul: ({children}) => <ul className="mb-2 ml-4 space-y-1">{children}</ul>,
                                    ol: ({children}) => <ol className="mb-2 ml-4 space-y-1">{children}</ol>,
                                    li: ({children}) => <li className="text-sm break-words">{children}</li>,
                                    h1: ({children}) => <h1 className="text-base font-bold mb-2 mt-3 first:mt-0 break-words">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0 break-words">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-sm font-medium mb-1 mt-2 first:mt-0 break-words">{children}</h3>,
                                    strong: ({children}) => <strong className="font-semibold break-words">{children}</strong>,
                                    em: ({children}) => <em className="italic break-words">{children}</em>,
                                    code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono break-all">{children}</code>,
                                    pre: ({children}) => <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto my-2 break-words">{children}</pre>
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap break-words">
                                {message.content}
                              </div>
                            )}
                          </div>
                          <div className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-emerald-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* 加载状态 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-emerald-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span className="text-sm text-gray-600">AI 正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="flex gap-2 flex-shrink-0 mt-auto">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="flex-1 resize-none min-h-[44px] max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSendDisabled}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px] px-4 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}