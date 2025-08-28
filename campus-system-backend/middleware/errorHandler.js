// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('❌ 错误详情:', err);

  // 默认错误状态码和消息
  let statusCode = err.statusCode || 500;
  let message = err.message || '服务器内部错误';

  // 数据库相关错误
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = '数据已存在，请检查输入信息';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = '关联数据不存在，请检查输入信息';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = '该数据正在被使用，无法删除';
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败：' + err.message;
  }

  // JWT相关错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的访问令牌';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '访问令牌已过期';
  }

  // 发送错误响应
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404错误处理
const notFound = (req, res, next) => {
  const error = new Error(`路由 ${req.originalUrl} 不存在`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
