const jwt = require('jsonwebtoken');
const config = require('../config/config');

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失，请先登录'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: '访问令牌无效或已过期，请重新登录'
    });
  }
};

// 可选认证中间件（不强制要求登录）
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
    } catch (error) {
      // 令牌无效但不阻止请求继续
      console.log('可选认证失败:', error.message);
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
