import { NextRequest, NextResponse } from 'next/server'
import { initJiaheInterviewSystem, getJiaheInterviewSystemStatus } from '@/scripts/init-jiahe-interview'

/**
 * 初始化嘉禾面试测试系统
 * POST /api/jiahe-interview/init
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[嘉禾面试] 开始系统初始化...')
    
    await initJiaheInterviewSystem()
    
    const status = await getJiaheInterviewSystemStatus()
    
    return NextResponse.json({
      success: true,
      message: '嘉禾面试测试系统初始化成功',
      data: {
        ...status,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 系统初始化失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '系统初始化失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取嘉禾面试测试系统状态
 * GET /api/jiahe-interview/init
 */
export async function GET(request: NextRequest) {
  try {
    const status = await getJiaheInterviewSystemStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        ...status,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 获取系统状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取系统状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}