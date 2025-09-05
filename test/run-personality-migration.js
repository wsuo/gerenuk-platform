const mysql = require('mysql2/promise');
const fs = require('fs');

async function runPersonalityTestMigration() {
  const connection = await mysql.createConnection({
    host: '100.72.60.117',
    port: 23306,
    user: 'remote_user',
    password: '!QAZxsw2',
    database: 'gerenuk_platform'
  });

  try {
    console.log('连接到数据库成功');

    // 读取迁移脚本
    const sqlScript = fs.readFileSync('../scripts/add-personality-test-storage.sql', 'utf8');
    
    // 按分号分割SQL语句
    const statements = sqlScript.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement && !trimmedStatement.startsWith('--')) {
        console.log(`执行: ${trimmedStatement.substring(0, 100)}...`);
        try {
          await connection.execute(trimmedStatement);
          console.log('✓ 执行成功');
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
            console.log('⚠ 字段或索引已存在，跳过');
          } else {
            console.error('❌ 执行失败:', error.message);
          }
        }
      }
    }

    console.log('面试测试数据库迁移完成！');

    // 验证迁移结果
    const [result] = await connection.execute('DESCRIBE training_records');
    const personalityFields = result.filter(field => 
      field.Field.includes('personality') || 
      field.Field.includes('tendency') || 
      field.Field.includes('occupation') ||
      field.Field.includes('test_report')
    );

    console.log('新增字段:', personalityFields.map(f => f.Field));

  } catch (error) {
    console.error('迁移失败:', error);
  } finally {
    await connection.end();
  }
}

runPersonalityTestMigration();