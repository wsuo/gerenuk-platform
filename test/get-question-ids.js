const mysql = require('mysql2/promise');

async function getQuestionIds() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('获取面试测试的所有题目ID (set_id = 9):');
    
    const [questions] = await connection.execute(`
      SELECT id, question_number
      FROM questions 
      WHERE set_id = 9 
      ORDER BY question_number
    `);
    
    console.log(`总共 ${questions.length} 题:`);
    console.log('题目编号 -> 数据库ID 的映射:');
    
    questions.forEach(q => {
      console.log(`  题目 ${q.question_number}: ID = ${q.id}`);
    });
    
  } catch (error) {
    console.error('获取失败:', error);
  } finally {
    await connection.end();
  }
}

getQuestionIds();