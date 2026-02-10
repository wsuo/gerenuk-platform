import { NextRequest, NextResponse } from 'next/server'
import { executeCompatibleRun } from '@/lib/platform-database'

// 手动修复数据库字段
export async function POST(request: NextRequest) {
  try {
    console.log('开始手动添加数据库字段...')

    const fixes = [
      // 为 questions 表支持多选题
      {
        sql: `ALTER TABLE questions MODIFY COLUMN correct_answer VARCHAR(10) NOT NULL COMMENT '正确答案：单选A-D；多选为去重排序后的字母串如ACD'`,
        desc: '扩容 questions.correct_answer 以支持多选'
      },
      {
        sql: `ALTER TABLE questions ADD COLUMN question_type VARCHAR(10) NOT NULL DEFAULT 'single' COMMENT '题型：single/multiple'`,
        desc: '为 questions 添加 question_type 字段'
      },
      {
        sql: `CREATE INDEX idx_questions_type ON questions (question_type)`,
        desc: '为 questions.question_type 添加索引'
      },
      // 为question_sets表添加字段
      {
        sql: `ALTER TABLE question_sets ADD COLUMN category_id INT DEFAULT NULL COMMENT '所属考核类别ID'`,
        desc: '为question_sets添加category_id字段'
      },
      {
        sql: `ALTER TABLE question_sets ADD COLUMN is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用'`,
        desc: '为question_sets添加is_active字段'
      },
      {
        sql: `ALTER TABLE question_sets ADD INDEX idx_category_id (category_id)`,
        desc: '为question_sets添加category_id索引'
      },
      // 为training_records表添加字段
      {
        sql: `ALTER TABLE training_records ADD COLUMN category_id INT DEFAULT NULL COMMENT '考核类别ID'`,
        desc: '为training_records添加category_id字段'
      },
      {
        sql: `ALTER TABLE training_records ADD INDEX idx_category_id (category_id)`,
        desc: '为training_records添加category_id索引'
      },
      // 更新现有数据
      {
        sql: `UPDATE question_sets SET category_id = 1 WHERE category_id IS NULL`,
        desc: '更新现有题库的类别'
      },
      {
        sql: `UPDATE training_records tr JOIN question_sets qs ON tr.set_id = qs.id SET tr.category_id = qs.category_id WHERE tr.category_id IS NULL`,
        desc: '更新现有记录的类别'
      }
    ]

    let success = 0
    const results = []

    for (const fix of fixes) {
      try {
        console.log(`执行: ${fix.desc}`)
        await executeCompatibleRun(fix.sql, [])
        success++
        results.push({ success: true, desc: fix.desc })
        console.log(`✓ 成功: ${fix.desc}`)
      } catch (error: any) {
        console.log(`- 跳过: ${fix.desc} (${error.message})`)
        results.push({ success: false, desc: fix.desc, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `数据库字段修复完成，成功 ${success}/${fixes.length} 个操作`,
      results
    })

  } catch (error) {
    console.error('数据库修复失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '数据库修复失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
