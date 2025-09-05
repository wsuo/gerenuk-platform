const mysql = require('mysql2/promise');

async function addMissingField() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('连接到数据库成功');

    // 检查当前字段
    const [fields] = await connection.execute('DESCRIBE training_records');
    console.log('当前字段:', fields.map(f => f.Field));
    
    // 添加缺失的 personality_test_result 字段
    try {
      await connection.execute(`
        ALTER TABLE training_records 
        ADD COLUMN personality_test_result JSON COMMENT '面试测试结果数据(JSON格式)'
      `);
      console.log('✓ 成功添加 personality_test_result 字段');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠ personality_test_result 字段已存在');
      } else {
        console.error('❌ 添加字段失败:', error.message);
      }
    }

    // 再次检查字段
    const [newFields] = await connection.execute('DESCRIBE training_records');
    const personalityFields = newFields.filter(field => 
      field.Field.includes('personality') || 
      field.Field.includes('tendency') || 
      field.Field.includes('occupation') ||
      field.Field.includes('test_report')
    );

    console.log('面试测试相关字段:', personalityFields.map(f => f.Field));

  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await connection.end();
  }
}

addMissingField();