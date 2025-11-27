"use client"

import { useEffect } from "react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">系统出现错误</h1>
          <p className="text-sm text-gray-500">
            我们已记录错误信息（{error.digest || '未知'}），请尝试重新加载或稍后再试。
          </p>
          <button
            className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={reset}
          >
            重新加载页面
          </button>
        </div>
      </body>
    </html>
  )
}
