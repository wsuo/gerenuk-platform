import { getDatabase } from './database'
import { executeCompatibleQuery, executeCompatibleSingle, executeCompatibleRun } from './platform-database'

// 嘉禾面试题目接口
export interface JiaheInterviewQuestion {
  id?: number
  section: 'logic' | 'personality' // 逻辑测试 | 性格测试
  question_number: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer?: string // 逻辑测试的正确答案
  personality_type?: string // 性格测试的类型标识
  created_at?: string
  updated_at?: string
}

// 嘉禾面试记录接口
export interface JiaheInterviewRecord {
  id?: number
  employee_name: string
  logic_answers: string // JSON格式的逻辑测试答案
  personality_answers: string // JSON格式的性格测试答案
  logic_results: string // JSON格式的逻辑测试结果（对错标注）
  personality_scores: string // JSON格式的性格测试得分
  main_characteristics: string // 主要性格特征
  session_duration: number // 答题时长（秒）
  completed_at: string
  ip_address?: string
  created_at?: string
}

// 嘉禾性格特征映射接口
export interface JiahePersonalityMapping {
  id?: number
  personality_type: string
  characteristic_name: string
  description: string
  created_at?: string
}

class JiaheInterviewQuestionDB {
  // 创建表
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS jiahe_interview_questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        section ENUM('logic', 'personality') NOT NULL COMMENT '题目类型：逻辑测试或性格测试',
        question_number INT NOT NULL COMMENT '题目序号',
        question_text TEXT NOT NULL COMMENT '题目内容',
        option_a TEXT NOT NULL COMMENT '选项A',
        option_b TEXT NOT NULL COMMENT '选项B', 
        option_c TEXT NOT NULL COMMENT '选项C',
        option_d TEXT NOT NULL COMMENT '选项D',
        correct_answer CHAR(1) COMMENT '正确答案（逻辑测试用）',
        personality_type VARCHAR(10) COMMENT '性格类型标识（性格测试用）',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section (section),
        INDEX idx_question_number (question_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='嘉禾面试测试题目表'
    `
    
    await executeCompatibleRun(sql)
  }

  // 批量插入题目
  async insertQuestions(questions: JiaheInterviewQuestion[]): Promise<void> {
    if (questions.length === 0) return

    const sql = `
      INSERT INTO jiahe_interview_questions 
      (section, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, personality_type)
      VALUES ?
    `
    
    const values = questions.map(q => [
      q.section,
      q.question_number,
      q.question_text,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_answer || null,
      q.personality_type || null
    ])

    await executeCompatibleQuery(sql, [values])
  }

  // 获取所有题目
  async findAll(): Promise<JiaheInterviewQuestion[]> {
    const sql = `
      SELECT * FROM jiahe_interview_questions 
      ORDER BY section, question_number
    `
    return await executeCompatibleQuery(sql)
  }

  // 按类型获取题目
  async findBySection(section: 'logic' | 'personality'): Promise<JiaheInterviewQuestion[]> {
    const sql = `
      SELECT * FROM jiahe_interview_questions 
      WHERE section = ? 
      ORDER BY question_number
    `
    return await executeCompatibleQuery(sql, [section])
  }

  // 获取题目总数
  async getCount(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM jiahe_interview_questions`
    const result = await executeCompatibleSingle(sql)
    return result?.count || 0
  }

  // 插入单个题目
  async insertQuestion(question: JiaheInterviewQuestion): Promise<number> {
    const sql = `
      INSERT INTO jiahe_interview_questions 
      (section, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, personality_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const result = await executeCompatibleRun(sql, [
      question.section,
      question.question_number,
      question.question_text,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
      question.correct_answer || null,
      question.personality_type || null
    ])

    return result?.insertId || 0
  }

  // 更新题目
  async updateQuestion(id: number, question: Partial<JiaheInterviewQuestion>): Promise<void> {
    const fields = []
    const values = []

    if (question.section !== undefined) {
      fields.push('section = ?')
      values.push(question.section)
    }
    if (question.question_number !== undefined) {
      fields.push('question_number = ?')
      values.push(question.question_number)
    }
    if (question.question_text !== undefined) {
      fields.push('question_text = ?')
      values.push(question.question_text)
    }
    if (question.option_a !== undefined) {
      fields.push('option_a = ?')
      values.push(question.option_a)
    }
    if (question.option_b !== undefined) {
      fields.push('option_b = ?')
      values.push(question.option_b)
    }
    if (question.option_c !== undefined) {
      fields.push('option_c = ?')
      values.push(question.option_c)
    }
    if (question.option_d !== undefined) {
      fields.push('option_d = ?')
      values.push(question.option_d)
    }
    if (question.correct_answer !== undefined) {
      fields.push('correct_answer = ?')
      values.push(question.correct_answer)
    }
    if (question.personality_type !== undefined) {
      fields.push('personality_type = ?')
      values.push(question.personality_type)
    }

    if (fields.length === 0) {
      throw new Error('没有提供要更新的字段')
    }

    fields.push('updated_at = NOW()')
    values.push(id)

    const sql = `UPDATE jiahe_interview_questions SET ${fields.join(', ')} WHERE id = ?`
    await executeCompatibleRun(sql, values)
  }

  // 根据ID查找题目
  async findById(id: number): Promise<JiaheInterviewQuestion | null> {
    const sql = `SELECT * FROM jiahe_interview_questions WHERE id = ?`
    return await executeCompatibleSingle(sql, [id])
  }

  // 根据section和question_number查找题目  
  async findByQuestionNumber(section: 'logic' | 'personality', questionNumber: number): Promise<JiaheInterviewQuestion | null> {
    const sql = `
      SELECT * FROM jiahe_interview_questions 
      WHERE section = ? AND question_number = ?
    `
    return await executeCompatibleSingle(sql, [section, questionNumber])
  }

  // 清空所有题目
  async deleteAll(): Promise<void> {
    const sql = `DELETE FROM jiahe_interview_questions`
    await executeCompatibleRun(sql)
  }

  // 清空所有题目
  async truncate(): Promise<void> {
    const sql = `TRUNCATE TABLE jiahe_interview_questions`
    await executeCompatibleRun(sql)
  }
}

class JiaheInterviewRecordDB {
  // 创建表
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS jiahe_interview_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_name VARCHAR(100) NOT NULL COMMENT '员工姓名',
        logic_answers TEXT NOT NULL COMMENT '逻辑测试答案(JSON)',
        personality_answers TEXT NOT NULL COMMENT '性格测试答案(JSON)',
        logic_results TEXT NOT NULL COMMENT '逻辑测试结果(JSON)',
        personality_scores TEXT NOT NULL COMMENT '性格测试得分(JSON)',
        main_characteristics TEXT COMMENT '主要性格特征',
        session_duration INT DEFAULT 0 COMMENT '答题时长(秒)',
        completed_at TIMESTAMP NOT NULL COMMENT '完成时间',
        ip_address VARCHAR(45) COMMENT 'IP地址',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_employee_name (employee_name),
        INDEX idx_completed_at (completed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='嘉禾面试测试记录表'
    `
    
    await executeCompatibleRun(sql)
  }

  // 插入记录
  async insertRecord(record: Omit<JiaheInterviewRecord, 'id' | 'created_at'>): Promise<number> {
    const sql = `
      INSERT INTO jiahe_interview_records 
      (employee_name, logic_answers, personality_answers, logic_results, 
       personality_scores, main_characteristics, session_duration, completed_at, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const result = await executeCompatibleRun(sql, [
      record.employee_name,
      record.logic_answers,
      record.personality_answers,
      record.logic_results,
      record.personality_scores,
      record.main_characteristics,
      record.session_duration,
      record.completed_at,
      record.ip_address
    ])

    return result?.insertId || 0
  }

  // 根据员工姓名查找记录
  async findByEmployeeName(employeeName: string): Promise<JiaheInterviewRecord[]> {
    const sql = `
      SELECT * FROM jiahe_interview_records 
      WHERE employee_name = ? 
      ORDER BY completed_at DESC
    `
    return await executeCompatibleQuery(sql, [employeeName])
  }

  // 获取最新的记录
  async findLatest(limit: number = 10): Promise<JiaheInterviewRecord[]> {
    const sql = `
      SELECT * FROM jiahe_interview_records 
      ORDER BY completed_at DESC 
      LIMIT ?
    `
    return await executeCompatibleQuery(sql, [limit])
  }

  // 根据ID查找记录
  async findById(id: number): Promise<JiaheInterviewRecord | null> {
    const sql = `SELECT * FROM jiahe_interview_records WHERE id = ?`
    return await executeCompatibleSingle(sql, [id])
  }

  // 获取总记录数
  async getCount(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM jiahe_interview_records`
    const result = await executeCompatibleSingle(sql)
    return result?.count || 0
  }
}

class JiahePersonalityMappingDB {
  // 创建表
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS jiahe_personality_mapping (
        id INT PRIMARY KEY AUTO_INCREMENT,
        personality_type VARCHAR(10) NOT NULL COMMENT '性格类型标识',
        characteristic_name VARCHAR(100) NOT NULL COMMENT '特征名称',
        description TEXT COMMENT '特征描述',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_personality_type (personality_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='嘉禾性格特征映射表'
    `
    
    await executeCompatibleRun(sql)
  }

  // 批量插入映射
  async insertMappings(mappings: JiahePersonalityMapping[]): Promise<void> {
    if (mappings.length === 0) return

    const sql = `
      INSERT INTO jiahe_personality_mapping 
      (personality_type, characteristic_name, description)
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
      characteristic_name = VALUES(characteristic_name),
      description = VALUES(description)
    `
    
    const values = mappings.map(m => [
      m.personality_type,
      m.characteristic_name,
      m.description
    ])

    await executeCompatibleQuery(sql, [values])
  }

  // 获取所有映射
  async findAll(): Promise<JiahePersonalityMapping[]> {
    const sql = `SELECT * FROM jiahe_personality_mapping ORDER BY personality_type`
    return await executeCompatibleQuery(sql)
  }

  // 插入单个映射
  async insertMapping(mapping: JiahePersonalityMapping): Promise<number> {
    const sql = `
      INSERT INTO jiahe_personality_mapping 
      (personality_type, characteristic_name, description)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      characteristic_name = VALUES(characteristic_name),
      description = VALUES(description)
    `
    
    const result = await executeCompatibleRun(sql, [
      mapping.personality_type,
      mapping.characteristic_name,
      mapping.description
    ])

    return result?.insertId || 0
  }

  // 清空所有映射
  async deleteAll(): Promise<void> {
    const sql = `DELETE FROM jiahe_personality_mapping`
    await executeCompatibleRun(sql)
  }

  // 根据类型获取映射
  async findByType(personalityType: string): Promise<JiahePersonalityMapping | null> {
    const sql = `SELECT * FROM jiahe_personality_mapping WHERE personality_type = ?`
    return await executeCompatibleSingle(sql, [personalityType])
  }
}

// 导出数据库操作实例
export const jiaheInterviewQuestionDB = new JiaheInterviewQuestionDB()
export const jiaheInterviewRecordDB = new JiaheInterviewRecordDB()
export const jiahePersonalityMappingDB = new JiahePersonalityMappingDB()

// 初始化所有表
export async function initJiaheInterviewTables(): Promise<void> {
  console.log('开始初始化嘉禾面试测试数据表...')
  
  try {
    await jiaheInterviewQuestionDB.createTable()
    console.log('✓ 嘉禾面试题目表创建成功')
    
    await jiaheInterviewRecordDB.createTable()
    console.log('✓ 嘉禾面试记录表创建成功')
    
    await jiahePersonalityMappingDB.createTable()
    console.log('✓ 嘉禾性格映射表创建成功')
    
    console.log('嘉禾面试测试数据表初始化完成')
  } catch (error) {
    console.error('初始化嘉禾面试测试数据表失败:', error)
    throw error
  }
}