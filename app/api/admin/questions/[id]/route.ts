import { NextRequest, NextResponse } from 'next/server'
import { normalizeChoiceAnswer } from '@/lib/choice-answer'

// 获取单个题目详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const questionId = parseInt(id)
    
    // 直接查询数据库
    const { executeCompatibleSingle } = await import('@/lib/platform-database')
    const question = await executeCompatibleSingle(
      'SELECT * FROM questions WHERE id = ?', 
      [questionId]
    )
    
    if (!question) {
      return NextResponse.json({ success: false, error: '题目不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: question })
    
  } catch (error) {
    console.error('获取题目详情失败:', error)
    return NextResponse.json({ 
      success: false, 
      error: '获取失败: ' + (error instanceof Error ? error.message : '未知错误')
    }, { status: 500 })
  }
}

// 更新题目
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const questionId = parseInt(id)
    const updates = await request.json()
    
    const questionType: 'single' | 'multiple' = updates.question_type === 'multiple' ? 'multiple' : 'single'

    // 验证必填字段
    const requiredFields = ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
    for (const field of requiredFields) {
      if (!updates[field] || updates[field].trim() === '') {
        return NextResponse.json({ 
          success: false, 
          error: `字段 ${field} 不能为空` 
        }, { status: 400 })
      }
    }
    
    // 验证正确答案格式
    const normalizedCorrect = normalizeChoiceAnswer(updates.correct_answer)
    if (questionType === 'single') {
      if (normalizedCorrect.length !== 1) {
        return NextResponse.json({ 
          success: false, 
          error: '单选题正确答案必须是 A、B、C、D 中的一个' 
        }, { status: 400 })
      }
    } else {
      if (normalizedCorrect.length < 2) {
        return NextResponse.json({ 
          success: false, 
          error: '多选题正确答案至少需要选择 2 个选项（A-D）' 
        }, { status: 400 })
      }
    }
    
    // 执行更新
    const { executeCompatibleRun } = await import('@/lib/platform-database')
    await executeCompatibleRun(
      `UPDATE questions SET 
        question_text = ?, 
        option_a = ?, 
        option_b = ?, 
        option_c = ?, 
        option_d = ?, 
        question_type = ?,
        correct_answer = ?, 
        explanation = ?,
        section = ?
       WHERE id = ?`,
      [
        updates.question_text,
        updates.option_a,
        updates.option_b,
        updates.option_c,
        updates.option_d,
        questionType,
        normalizedCorrect,
        updates.explanation || null,
        updates.section || null,
        questionId
      ]
    )
    
    return NextResponse.json({ success: true, message: '题目更新成功' })
    
  } catch (error) {
    console.error('更新题目失败:', error)
    return NextResponse.json({ 
      success: false, 
      error: '更新失败: ' + (error instanceof Error ? error.message : '未知错误')
    }, { status: 500 })
  }
}

// 删除题目
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const questionId = parseInt(id)
    
    const { executeCompatibleRun } = await import('@/lib/platform-database')
    await executeCompatibleRun('DELETE FROM questions WHERE id = ?', [questionId])
    
    return NextResponse.json({ success: true, message: '题目删除成功' })
    
  } catch (error) {
    console.error('删除题目失败:', error)
    return NextResponse.json({ 
      success: false, 
      error: '删除失败: ' + (error instanceof Error ? error.message : '未知错误')
    }, { status: 500 })
  }
}
