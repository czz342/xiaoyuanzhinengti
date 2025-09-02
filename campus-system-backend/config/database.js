const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '424266445Czz',
  database: process.env.DB_NAME || 'campus_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    console.log(`📍 连接信息: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('💡 请检查以下配置:');
    console.log(`   - 数据库主机: ${dbConfig.host}`);
    console.log(`   - 端口: ${dbConfig.port}`);
    console.log(`   - 用户名: ${dbConfig.user}`);
    console.log(`   - 数据库名: ${dbConfig.database}`);
    console.log(`   - 密码: ${dbConfig.password ? '已设置' : '未设置'}`);
    return false;
  }
}

// 执行查询的通用函数
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ 查询执行失败:', error.message);
    throw error;
  }
}

// 检查数据库是否存在，如果不存在则创建
async function ensureDatabase() {
  try {
    // 先连接到MySQL服务器（不指定数据库）
    const tempPool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    // 创建数据库（如果不存在）
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`✅ 数据库 ${dbConfig.database} 已确保存在`);
    
    await tempPool.end();
    return true;
  } catch (error) {
    console.error('❌ 数据库创建失败:', error.message);
    return false;
  }
}

// 为了兼容现有代码，导出execute方法
const db = {
  execute: async (sql, params = []) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return [rows];
    } catch (error) {
      console.error('❌ 查询执行失败:', error.message);
      throw error;
    }
  }
};

module.exports = {
  pool,
  db,
  testConnection,
  query,
  ensureDatabase
};
