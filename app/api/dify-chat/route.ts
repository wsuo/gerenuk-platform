import { NextRequest, NextResponse } from 'next/server'

const DIFY_BASE_URL = process.env.DIFY_API_BASE_URL || 'http://100.101.144.72/v1'
const DIFY_API_KEY = process.env.DIFY_API_KEY || 'app-9hCMk701VitCoCEt6TVEU5rm'
const DIFY_APP_ID = process.env.DIFY_APP_ID || '124d7b23-8d4f-4bcb-bb09-28b3c0787d82'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需字段
    if (!body.query) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少必需参数: query' 
        },
        { status: 400 }
      )
    }

    // 准备请求数据
    const requestData = {
      inputs: body.inputs || {},
      query: body.query,
      response_mode: 'blocking', // 非流式返回
      conversation_id: body.conversation_id || '',
      user: body.user || 'guest_user_' + Date.now()
    }

    // 调用 dify API
    const difyResponse = await fetch(`${DIFY_BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text()
      console.error('Dify API error:', difyResponse.status, errorText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Dify API 调用失败: ${difyResponse.status}`,
          details: errorText
        },
        { status: difyResponse.status }
      )
    }

    const difyData = await difyResponse.json()
    
    return NextResponse.json({
      success: true,
      data: {
        answer: difyData.answer,
        conversation_id: difyData.conversation_id,
        message_id: difyData.message_id,
        created_at: difyData.created_at,
        metadata: difyData.metadata || {}
      }
    })
    
  } catch (error) {
    console.error('Failed to call Dify API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Dify 智能体调用失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// GET - 获取会话历史（如果需要的话）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')
  const user = searchParams.get('user') || 'guest_user_' + Date.now()
  
  if (!conversationId) {
    return NextResponse.json(
      { 
        success: false, 
        error: '缺少必需参数: conversation_id' 
      },
      { status: 400 }
    )
  }

  try {
    // 调用 dify API 获取会话历史
    const difyResponse = await fetch(`${DIFY_BASE_URL}/messages?conversation_id=${conversationId}&limit=20&user=${encodeURIComponent(user)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text()
      console.error('Dify API error:', difyResponse.status, errorText)
      
      return NextResponse.json(
        { 
          success: false, 
          error: `获取会话历史失败: ${difyResponse.status}`,
          details: errorText
        },
        { status: difyResponse.status }
      )
    }

    const difyData = await difyResponse.json()
    
    return NextResponse.json({
      success: true,
      data: difyData.data || []
    })
    
  } catch (error) {
    console.error('Failed to fetch conversation history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取会话历史失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}