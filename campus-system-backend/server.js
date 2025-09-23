const express = require("express");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const config = require('./config/config');

const app = express();
const PORT = config.server.port;

// 中间件配置
app.use(cors(config.cors));
app.use(bodyParser.json({ limit: config.upload.maxSize }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.upload.maxSize }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// 静态资源：上传目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 静态资源：静态文件目录
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

// 健康检查
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "服务器运行正常",
        timestamp: new Date().toISOString()
    });
});

// API信息接口
app.get("/api", (req, res) => {
    res.json({
        message: "校园生活管理系统 API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            health: "/health",
            api: "/api",
            auth: "/api/auth",
            user: "/api/user"
        }
    });
});

// 路由配置
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/course', require('./routes/course'));
app.use('/api/classroom', require('./routes/classroom'));
app.use('/api/book', require('./routes/book'));
app.use('/api/studyroom', require('./routes/studyroom'));
app.use('/api/food', require('./routes/food'));
app.use('/api/express', require('./routes/express'));
app.use('/api/shared-devices', require('./routes/shared-devices'));
app.use('/api/psych', require('./routes/psych'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/im', require('./routes/im'));
app.use('/api/errand', require('./routes/errand'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/community', require('./routes/community'));
app.use('/api/library', require('./routes/library'));
app.use('/api/smart-recommendation', require('./routes/smart-recommendation'));

// 404处理
app.use(notFound);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('⚠️  数据库连接失败，但服务器仍会启动');
    }

    app.listen(PORT, () => {
      console.log("🚀 服务器启动成功");
      console.log(`📍 地址: http://${config.server.host}:${PORT}`);
      console.log(`🔍 健康检查: http://${config.server.host}:${PORT}/health`);
      console.log(`📚 API文档: http://${config.server.host}:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error.message);
    process.exit(1);
  }
};

startServer();