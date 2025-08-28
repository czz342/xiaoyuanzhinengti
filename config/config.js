module.exports = {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },
    
    // 数据库配置
    database: {
        host: 'localhost',
        user: 'root',
        password: '123456', // 请替换为你的实际MySQL密码
        database: 'campus_system'
    },
    
    // JWT配置
    jwt: {
        secret: 'campus-system-secret-key-2024',
        expiresIn: '24h'
    },
    
    // 跨域配置
    cors: {
        origin: ['http://localhost:8080', 'http://localhost:3000'],
        credentials: true
    }
};
