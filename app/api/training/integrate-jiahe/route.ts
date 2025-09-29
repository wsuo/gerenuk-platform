import { NextRequest, NextResponse } from 'next/server'
import { integrateJiaheToTrainingSystem } from '@/scripts/integrate-jiahe-to-training'

/**
 * 将嘉禾面试测试集成到现有考试系统
 * POST /api/training/integrate-jiahe
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[嘉禾面试] 开始集成到现有考试系统...')
    
    const result = await integrateJiaheToTrainingSystem()
    
    return NextResponse.json({
      success: true,
      message: '嘉禾面试测试集成成功',
      data: {
        ...result,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 集成失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '集成失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取嘉禾面试集成状态
 * GET /api/training/integrate-jiahe
 */
export async function GET(request: NextRequest) {
  try {
    const { getJiaheInterviewIds } = await import('@/scripts/integrate-jiahe-to-training')
    const ids = await getJiaheInterviewIds()
    
    return NextResponse.json({
      success: true,
      data: {
        isIntegrated: Boolean(ids.categoryId && ids.setId),
        ...ids,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[嘉禾面试] 获取集成状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取集成状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}