import { NextRequest, NextResponse } from 'next/server'
import { questionSetDB, questionDB, examCategoryDB } from '@/lib/database'
import { executeCompatibleSingle } from '@/lib/platform-database'

// Fisher-Yates洗牌算法 - 真正的随机排序
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 开始答题 - 支持按类别随机分配试卷
export async function POST(request: NextRequest) {
  try {
    const { employeeName, categoryId } = await request.json()
    
    if (!employeeName || !employeeName.trim()) {
      return NextResponse.json(
        { success: false, message: '请输入员工姓名' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: '请选择考核类别' },
        { status: 400 }
      )
    }
    
    // 验证考核类别是否存在
    const category = await examCategoryDB.findById(categoryId)
    if (!category) {
      return NextResponse.json(
        { success: false, message: '考核类别不存在' },
        { status: 400 }
      )
    }
    
    // 根据类别随机获取一套试卷
    const questionSet = await questionSetDB.getRandomSetByCategory(categoryId)
    
    if (!questionSet) {
      return NextResponse.json(
        { 
          success: false, 
          message: `暂无 "${category.name}" 类别的可用题库，请联系管理员` 
        },
        { status: 404 }
      )
    }
    
    // 获取试卷的所有题目
    const questions = await questionDB.findBySetId(questionSet.id!)
    
    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, message: '试卷题目为空，请联系管理员' },
        { status: 404 }
      )
    }
    
    // 对题目进行随机排序
    const shuffledQuestions = shuffleArray(questions)
    
    // 返回题目信息（不包含正确答案），并清理题目文本中的编号
    const questionsForExam = shuffledQuestions.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1, // 使用新的序号，不再依赖原始的questionNumber
      section: q.section,
      questionText: q.question_text.replace(/^\d+\.\s*/, ''), // 移除题目文本开头的编号
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      explanation: q.explanation
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 生成会话ID
        employeeName: employeeName.trim(),
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon
        },
        questionSet: {
          id: questionSet.id,
          name: questionSet.name,
          description: questionSet.description,
          totalQuestions: questions.length
        },
        questions: questionsForExam,
        startedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('开始答题失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '开始答题失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// 获取试卷信息 - 支持按类别筛选
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const setId = searchParams.get('setId')
    const categoryId = searchParams.get('categoryId')
    
    if (setId) {
      // 获取指定试卷信息
      const questionSet = await questionSetDB.findById(parseInt(setId))
      
      if (!questionSet) {
        return NextResponse.json(
          { success: false, message: '试卷不存在' },
          { status: 404 }
        )
      }
      
      const questionsCount = await questionDB.countBySetId(questionSet.id!)
      const category = questionSet.category_id ? await examCategoryDB.findById(questionSet.category_id) : null
      
      return NextResponse.json({
        success: true,
        data: {
          questionSet: {
            ...questionSet,
            category: category ? {
              id: category.id,
              name: category.name,
              color: category.color,
              icon: category.icon
            } : null
          },
          questionsCount
        }
      })
    } else {
      // 获取题库列表，支持按类别筛选
      const categories = await examCategoryDB.getActiveCategories()
      let questionSets
      
      if (categoryId && categoryId !== 'all') {
        questionSets = await questionSetDB.findByCategory(parseInt(categoryId))
      } else {
        questionSets = await questionSetDB.findAll()
      }
      
      const setsWithCount = await Promise.all(questionSets.map(async (set) => {
        const questionsCount = await questionDB.countBySetId(set.id!)
        const category = categories.find(c => c.id === set.category_id)
        
        return {
          ...set,
          questionsCount,
          category: category ? {
            id: category.id,
            name: category.name,
            color: category.color,
            icon: category.icon
          } : null
        }
      }))

      // 为每个类别计算统计信息以便排序
      const categoriesWithStats = await Promise.all(categories.map(async (category) => {
        const categorySets = setsWithCount.filter(set => set.category?.id === category.id)
        const totalQuestions = categorySets.reduce((sum, set) => sum + set.questionsCount, 0)
        
        // 获取该类别的最新考核记录
        let latestExamDate = null
        try {
          const latestRecord = await executeCompatibleSingle(
            'SELECT MAX(started_at) as latest_date FROM training_records WHERE category_id = ?',
            [category.id]
          )
          latestExamDate = latestRecord?.latest_date || null
        } catch (error) {
          console.error('获取最新考核记录失败:', error)
        }
        
        return {
          ...category,
          question_sets_count: categorySets.length,
          total_questions: totalQuestions,
          latest_exam_date: latestExamDate
        }
      }))

      // 智能排序：有数据的类别优先，然后按最新考核记录排序
      const sortedCategories = categoriesWithStats.sort((a, b) => {
        // 1. 有题库数据的优先
        const aHasData = a.total_questions > 0
        const bHasData = b.total_questions > 0
        if (aHasData !== bHasData) {
          return bHasData ? 1 : -1
        }
        
        // 2. 都有数据或都没有数据时，按最新考核记录排序
        const aLatest = a.latest_exam_date ? new Date(a.latest_exam_date).getTime() : 0
        const bLatest = b.latest_exam_date ? new Date(b.latest_exam_date).getTime() : 0
        if (aLatest !== bLatest) {
          return bLatest - aLatest // 最新的在前面
        }
        
        // 3. 最后按sort_order排序
        return (a.sort_order || 999) - (b.sort_order || 999)
      })
      
      return NextResponse.json({
        success: true,
        data: {
          categories: sortedCategories,
          questionSets: setsWithCount,
          totalSets: questionSets.length
        }
      })
    }
    
  } catch (error) {
    console.error('获取试卷信息失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '获取试卷信息失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}