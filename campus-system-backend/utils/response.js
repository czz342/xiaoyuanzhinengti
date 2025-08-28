// 统一API响应格式工具

// 成功响应
const success = (message = '操作成功', data = null, statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// 错误响应
const error = (message = '操作失败', statusCode = 400, data = null) => {
  return {
    success: false,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// 分页响应
const paginated = (data, page, limit, total, message = '查询成功') => {
  return {
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  };
};

// 列表响应
const list = (data, message = '查询成功') => {
  return {
    success: true,
    message,
    data,
    count: Array.isArray(data) ? data.length : 0,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  success,
  error,
  paginated,
  list
};
