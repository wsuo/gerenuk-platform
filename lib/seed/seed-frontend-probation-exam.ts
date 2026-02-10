import { executeCompatibleRun, executeCompatibleSingle } from '../platform-database'
import { examCategoryDB, questionDB, questionSetDB } from '../database'
import { normalizeChoiceAnswer } from '../choice-answer'
import { frontendProbationExamSeed } from '../exams/frontend-probation-2026-02'
import { pathToFileURL } from 'url'

async function ensureSchema() {
  const steps = [
    {
      desc: '确保 exam_categories 表存在',
      sql: `CREATE TABLE IF NOT EXISTS exam_categories (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '类别ID',
        name VARCHAR(100) NOT NULL COMMENT '类别名称',
        description TEXT COMMENT '类别描述',
        icon VARCHAR(50) DEFAULT 'BookOpen' COMMENT '图标名称',
        color VARCHAR(20) DEFAULT '#3b82f6' COMMENT '主题色',
        sort_order INT DEFAULT 0 COMMENT '排序',
        is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
        is_exam_enabled BOOLEAN DEFAULT TRUE COMMENT '考试是否允许员工参加',
        allow_view_score BOOLEAN DEFAULT TRUE COMMENT '是否允许查看成绩',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        UNIQUE KEY unique_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='考核类别表'`
    },
    {
      desc: '确保 question_sets.category_id 字段存在',
      sql: `ALTER TABLE question_sets ADD COLUMN category_id INT DEFAULT NULL COMMENT '所属考核类别ID'`
    },
    {
      desc: '确保 question_sets.is_active 字段存在',
      sql: `ALTER TABLE question_sets ADD COLUMN is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用'`
    },
    {
      desc: '确保 question_sets.allow_view_score 字段存在',
      sql: `ALTER TABLE question_sets ADD COLUMN allow_view_score BOOLEAN DEFAULT TRUE COMMENT '是否允许查看成绩'`
    },
    {
      desc: '确保 question_sets.category_id 索引存在',
      sql: `CREATE INDEX idx_question_sets_category_id ON question_sets (category_id)`
    },
    {
      desc: '扩容 questions.correct_answer 以支持多选',
      sql: `ALTER TABLE questions MODIFY COLUMN correct_answer VARCHAR(10) NOT NULL COMMENT '正确答案：单选A-D；多选为去重排序后的字母串如ACD'`
    },
    {
      desc: '为 questions 添加 question_type 字段',
      sql: `ALTER TABLE questions ADD COLUMN question_type VARCHAR(10) NOT NULL DEFAULT 'single' COMMENT '题型：single/multiple'`
    },
    {
      desc: '为 questions.question_type 添加索引',
      sql: `CREATE INDEX idx_questions_type ON questions (question_type)`
    },
    {
      desc: '确保 exam_categories.allow_view_score 字段存在',
      sql: `ALTER TABLE exam_categories ADD COLUMN allow_view_score BOOLEAN DEFAULT TRUE COMMENT '是否允许查看成绩'`
    },
    {
      desc: '确保 exam_categories.is_exam_enabled 字段存在',
      sql: `ALTER TABLE exam_categories ADD COLUMN is_exam_enabled BOOLEAN DEFAULT TRUE COMMENT '考试是否允许员工参加'`
    }
  ]

  for (const step of steps) {
    try {
      await executeCompatibleRun(step.sql, [])
      // eslint-disable-next-line no-console
      console.log(`✓ ${step.desc}`)
    } catch (e: any) {
      // MySQL/SQLite 兼容性与“已存在”的错误都允许跳过
      // eslint-disable-next-line no-console
      console.log(`- 跳过 ${step.desc}: ${e?.message || e}`)
    }
  }
}

async function upsertCategory(): Promise<number> {
  const category = frontendProbationExamSeed.category
  const existing = await executeCompatibleSingle<{ id: number }>(
    'SELECT id FROM exam_categories WHERE name = ?',
    [category.name]
  )

  if (existing?.id) {
    await executeCompatibleRun(
      `UPDATE exam_categories
       SET description = ?,
           icon = ?,
           color = ?,
           sort_order = ?,
           is_active = ?,
           allow_view_score = ?,
           is_exam_enabled = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        category.description || null,
        category.icon || 'Award',
        category.color || '#0ea5e9',
        category.sort_order ?? 10,
        category.is_active ?? true,
        category.allow_view_score ?? true,
        category.is_exam_enabled ?? true,
        existing.id
      ]
    )
    return existing.id
  }

  const inserted = await executeCompatibleRun(
    `INSERT INTO exam_categories (name, description, icon, color, sort_order, is_active, allow_view_score, is_exam_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category.name,
      category.description || null,
      category.icon || 'Award',
      category.color || '#0ea5e9',
      category.sort_order ?? 10,
      category.is_active ?? true,
      category.allow_view_score ?? true,
      category.is_exam_enabled ?? true
    ]
  )
  return inserted.lastInsertId || inserted.lastInsertRowid
}

async function upsertQuestionSet(categoryId: number): Promise<number> {
  const set = frontendProbationExamSeed.questionSet
  const totalQuestions = frontendProbationExamSeed.questions.length

  const existing = await executeCompatibleSingle<{ id: number }>(
    'SELECT id FROM question_sets WHERE name = ? AND category_id = ? LIMIT 1',
    [set.name, categoryId]
  )

  if (existing?.id) {
    await questionDB.deleteBySetId(existing.id)
    await questionSetDB.updateQuestionSet(existing.id, {
      name: set.name,
      description: set.description || null,
      category_id: categoryId,
      total_questions: totalQuestions,
      is_active: set.is_active ?? true,
      allow_view_score: set.allow_view_score ?? true
    })
    return existing.id
  }

  return await questionSetDB.insertQuestionSet({
    name: set.name,
    description: set.description || null,
    category_id: categoryId,
    total_questions: totalQuestions,
    is_active: set.is_active ?? true,
    allow_view_score: set.allow_view_score ?? true
  })
}

export async function seedFrontendProbationExam() {
  await ensureSchema()

  const categoryId = await upsertCategory()
  // eslint-disable-next-line no-console
  console.log(`类别已准备: ${frontendProbationExamSeed.category.name} (id=${categoryId})`)

  const setId = await upsertQuestionSet(categoryId)
  // eslint-disable-next-line no-console
  console.log(`题库已准备: ${frontendProbationExamSeed.questionSet.name} (id=${setId})`)

  let inserted = 0
  for (let i = 0; i < frontendProbationExamSeed.questions.length; i++) {
    const q = frontendProbationExamSeed.questions[i]
    await questionDB.insertQuestion({
      set_id: setId,
      question_number: i + 1,
      section: q.section || '通用知识',
      question_type: q.questionType,
      question_text: q.questionText,
      option_a: q.optionA,
      option_b: q.optionB,
      option_c: q.optionC,
      option_d: q.optionD,
      correct_answer: normalizeChoiceAnswer(q.correctAnswer),
      explanation: q.explanation || null
    })
    inserted++
  }

  // eslint-disable-next-line no-console
  console.log(`✓ 导入完成：${inserted}/${frontendProbationExamSeed.questions.length} 题`)

  const categories = await examCategoryDB.getActiveCategories()
  const found = categories.find((c) => c.id === categoryId)
  if (!found) {
    throw new Error('导入后未能在 active categories 中找到该类别，请检查 is_active 字段')
  }
}

const isExecutedDirectly = (() => {
  const argvPath = process.argv[1]
  if (!argvPath) return false
  try {
    return pathToFileURL(argvPath).href === import.meta.url
  } catch {
    return false
  }
})()

if (isExecutedDirectly) {
  seedFrontendProbationExam().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
}
