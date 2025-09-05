const mysql = require('mysql2/promise');

async function addInterviewCategory() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('连接到数据库成功');

    // 检查分类是否已存在
    const [existing] = await connection.execute(
      'SELECT id FROM exam_categories WHERE name = ?',
      ['面试测试']
    );

    let categoryId;
    
    if (existing.length > 0) {
      categoryId = existing[0].id;
      console.log(`面试测试分类已存在，ID: ${categoryId}`);
    } else {
      // 插入新分类
      const [result] = await connection.execute(
        `INSERT INTO exam_categories (name, description, icon, color, sort_order, is_active, allow_view_score, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        ['面试测试', '面试过程中的性格和能力测评', 'Users', '#f97316', 10, true, false]
      );
      categoryId = result.insertId;
      console.log(`面试测试分类创建成功，ID: ${categoryId}`);
    }

    // 将"职业性格测验"题库移到"面试测试"分类
    const [updateResult] = await connection.execute(
      'UPDATE question_sets SET category_id = ?, updated_at = NOW() WHERE name = ?',
      [categoryId, '职业性格测验']
    );

    if (updateResult.affectedRows > 0) {
      console.log('职业性格测验题库已成功移到面试测试分类');
    } else {
      console.log('未找到职业性格测验题库');
    }

    // 验证结果
    const [verification] = await connection.execute(
      `SELECT qs.id, qs.name, ec.name as category_name 
       FROM question_sets qs 
       LEFT JOIN exam_categories ec ON qs.category_id = ec.id 
       WHERE qs.name = ?`,
      ['职业性格测验']
    );

    console.log('验证结果:', verification[0]);

  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await connection.end();
  }
}

addInterviewCategory();