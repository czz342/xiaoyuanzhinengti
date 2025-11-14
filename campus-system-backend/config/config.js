const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
let dotenvResult = require('dotenv').config({ path: envPath, override: true });
console.log('[DEBUG] dotenv path:', envPath, 'exists:', fs.existsSync(envPath));
let parsedKeys = dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : [];
console.log('[DEBUG] dotenv parsed keys:', parsedKeys);

if (parsedKeys.length === 0 && fs.existsSync(envPath)) {
  try {
    const raw = fs.readFileSync(envPath);
    const hasNullByte = typeof raw.includes === 'function' ? raw.includes(0) : raw.some((b) => b === 0);
    if (hasNullByte) {
      const content = raw.toString('utf16le').replace(/^\uFEFF/, '');
      const lines = content.split(/\r?\n/);
      const parsed = {};
      for (const line of lines) {
        const l = line.trim();
        if (!l || l.startsWith('#')) continue;
        const idx = l.indexOf('=');
        if (idx === -1) continue;
        const key = l.slice(0, idx).trim();
        const value = l.slice(idx + 1).trim();
        if (!key) continue;
        if (process.env[key] === undefined || process.env[key] === '') {
          process.env[key] = value;
        }
        parsed[key] = value;
      }
      dotenvResult = { parsed };
      parsedKeys = Object.keys(parsed);
      console.log('[DEBUG] dotenv fallback used: utf16le manual parse');
      console.log('[DEBUG] dotenv parsed keys (fallback):', parsedKeys);
    }
  } catch (e) {
    console.log('[DEBUG] dotenv fallback error:', e && e.message);
  }
}

const maskedKey = process.env.SILICONFLOW_API_KEY
  ? `${process.env.SILICONFLOW_API_KEY.slice(0, 8)}...${process.env.SILICONFLOW_API_KEY.slice(-4)}`
  : undefined;
console.log('[DEBUG] SILICONFLOW_API_KEY:', maskedKey);

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_life_system',
    port: process.env.DB_PORT || 3306
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // 跨域配置
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE === 'true'
  },

  // 文件上传配置
  upload: {
    maxSize: process.env.UPLOAD_MAX_SIZE || '10mb',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  }
};
