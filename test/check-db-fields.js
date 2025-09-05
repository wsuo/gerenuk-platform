const mysql = require('mysql2/promise');

async function checkFields() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('检查 training_records 表的所有字段:');
    const [fields] = await connection.execute('DESCRIBE training_records');
    console.log('字段列表:');
    fields.forEach(field => {
      console.log(`  - ${field.Field} (${field.Type})`);
    });
    
    console.log('\n面试测试相关字段:');
    const personalityFields = fields.filter(f => 
      f.Field.includes('personality') || 
      f.Field.includes('tendency') || 
      f.Field.includes('occupation') ||
      f.Field.includes('test_report')
    );
    
    if (personalityFields.length > 0) {
      personalityFields.forEach(field => {
        console.log(`  ✓ ${field.Field} (${field.Type})`);
      });
    } else {
      console.log('  ❌ 未找到面试测试相关字段');
    }
    
  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    await connection.end();
  }
}

checkFields();