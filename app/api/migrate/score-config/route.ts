import { NextRequest, NextResponse } from 'next/server'
import { executeCompatibleRun } from '@/lib/platform-database'

export async function POST(request: NextRequest) {
  try {
    console.log('开始数据库迁移...')

    // 1. 为 exam_categories 表添加成绩查看配置字段
    try {
      await executeCompatibleRun(`
        ALTER TABLE exam_categories 
        ADD COLUMN allow_view_score BOOLEAN DEFAULT TRUE
      `, [])
      console.log('已为 exam_categories 表添加 allow_view_score 字段')
    } catch (error) {
      if (!error.message?.includes('duplicate column name')) {
        console.error('添加 exam_categories.allow_view_score 字段失败:', error)
      } else {
        console.log('exam_categories.allow_view_score 字段已存在')
      }
    }

    // 2. 为 question_sets 表添加成绩查看配置字段
    try {
      await executeCompatibleRun(`
        ALTER TABLE question_sets 
        ADD COLUMN allow_view_score BOOLEAN DEFAULT TRUE
      `, [])
      console.log('已为 question_sets 表添加 allow_view_score 字段')
    } catch (error) {
      if (!error.message?.includes('duplicate column name')) {
        console.error('添加 question_sets.allow_view_score 字段失败:', error)
      } else {
        console.log('question_sets.allow_view_score 字段已存在')
      }
    }

    // 3. 插入"面试测试"考核类别
    try {
      await executeCompatibleRun(`
        INSERT OR IGNORE INTO exam_categories (id, name, description, icon, color, sort_order, allow_view_score) 
        VALUES (6, '面试测试', '面试过程中的职业性格测验和能力评估', 'Users', '#9333ea', 6, 0)
      `, [])
      console.log('已插入"面试测试"考核类别')
    } catch (error) {
      console.error('插入面试测试类别失败:', error)
    }

    // 4. 更新现有考核类别，默认允许查看成绩
    try {
      const result = await executeCompatibleRun(`
        UPDATE exam_categories 
        SET allow_view_score = TRUE 
        WHERE allow_view_score IS NULL
      `, [])
      console.log(`已更新 ${result.changes} 个考核类别的成绩查看配置`)
    } catch (error) {
      console.error('更新现有考核类别配置失败:', error)
    }

    // 5. 更新现有题库，默认允许查看成绩
    try {
      const result = await executeCompatibleRun(`
        UPDATE question_sets 
        SET allow_view_score = TRUE 
        WHERE allow_view_score IS NULL
      `, [])
      console.log(`已更新 ${result.changes} 个题库的成绩查看配置`)
    } catch (error) {
      console.error('更新现有题库配置失败:', error)
    }

    return NextResponse.json({
      success: true,
      message: '数据库迁移完成',
      details: {
        categoriesUpdated: '已添加考核类别成绩查看配置',
        questionSetsUpdated: '已添加题库成绩查看配置',
        interviewCategoryAdded: '已添加面试测试类别'
      }
    })

  } catch (error) {
    console.error('数据库迁移失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '数据库迁移失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}