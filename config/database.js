const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '424266445Czz', // 你的MySQL密码
    database: 'campus_system',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 测试数据库连接
pool.getConnection()
    .then(connection => {
        console.log('✅ 数据库连接成功');
        connection.release();
    })
    .catch(err => {
        console.error('❌ 数据库连接失败:', err.message);
    });

module.exports = pool;
