const mysql = require('mysql2/promise');

async function checkQuestionFormat() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('检查面试测试题目格式 (set_id = 9):');
    
    const [questions] = await connection.execute(`
      SELECT id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer
      FROM questions 
      WHERE set_id = 9 
      ORDER BY question_number 
      LIMIT 5
    `);
    
    console.log(`找到 ${questions.length} 题，前5题的格式:`);
    questions.forEach(q => {
      console.log(`\n题目 ${q.question_number} (ID: ${q.id}):`);
      console.log(`  问题: ${q.question_text.substring(0, 50)}...`);
      console.log(`  选项A: ${q.option_a}`);
      console.log(`  选项B: ${q.option_b}`);
      console.log(`  选项C: ${q.option_c || '无'}`);
      console.log(`  选项D: ${q.option_d || '无'}`);
      console.log(`  正确答案: ${q.correct_answer}`);
    });
    
  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    await connection.end();
  }
}

checkQuestionFormat();