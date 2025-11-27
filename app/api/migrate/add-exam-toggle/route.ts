import { NextRequest, NextResponse } from 'next/server'
import { executeCompatibleRun } from '@/lib/platform-database'

export async function POST(request: NextRequest) {
  try {
    let steps = 0

    try {
      await executeCompatibleRun(
        `ALTER TABLE exam_categories ADD COLUMN is_exam_enabled BOOLEAN DEFAULT TRUE`,
        []
      )
      steps++
    } catch (error: any) {
      if (!error?.message?.includes('Duplicate column name')) {
        throw error
      }
    }

    await executeCompatibleRun(
      `UPDATE exam_categories SET is_exam_enabled = TRUE WHERE is_exam_enabled IS NULL`,
      []
    )
    steps++

    return NextResponse.json({
      success: true,
      message: `考核类别开关字段迁移完成，执行 ${steps} 个步骤`,
      data: { steps }
    })
  } catch (error) {
    console.error('执行 iOS 考试开关迁移失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '执行迁移失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
