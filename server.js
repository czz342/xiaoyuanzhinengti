const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: '校园生活管理系统后端服务运行正常',
        timestamp: new Date().toISOString()
    });
});

// API版本路由
app.get('/api', (req, res) => {
    res.json({
        message: '校园生活管理系统 API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api',
            test: '/api/test',
            users: '/api/users'
        }
    });
});

// 测试路由
app.use('/api/test', require('./routes/test'));

// 用户管理路由 - 暂时注释掉来排查问题
// app.use('/api/users', require('./routes/user'));

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `路由 ${req.originalUrl} 不存在`
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🚀 校园生活管理系统后端服务启动成功！');
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
    console.log(`📚 API文档: http://localhost:${PORT}/api`);
    console.log(`🧪 测试路由: http://localhost:${PORT}/api/test`);
    console.log(`👥 用户管理: http://localhost:${PORT}/api/users (暂时禁用)`);
});
