// 配置信息
const config = {
  baseUrl: 'http://127.0.0.1:8080/ierp', // 金蝶基础域名
  timeout: 10000 // 超时时间，单位：毫秒
}

// 请求拦截器
const requestInterceptor = (options) => {
  // 获取token
  const token = uni.getStorageSync('accessToken')
  
  // 合并请求头
  options.header = {
    ...options.header,
    'Authorization': token ? `Bearer ${token}` : '',
    'accesstoken': token
  }
  
  // 处理URL - 如果url已经包含baseUrl，则不再添加
  if (!options.url.startsWith('http')) {
    options.url = config.baseUrl + options.url
  }
  
  console.log('Request details:', {
    url: options.url,
    method: options.method,
    headers: options.header,
    data: options.data,
    timeout: options.timeout
  });
  
  return options
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data, header } = response
  
  console.log('Response details:', {
    statusCode,
    headers: header,
    data
  });
  
  // 处理成功响应
  if (statusCode >= 200 && statusCode < 300) {
    // 如果响应是标准的金蝶格式
    if (data && typeof data === 'object') {
      // 检查是否有错误码
      if (data.errorCode !== undefined && data.errorCode !== '0') {
        const error = new Error(data.message || '请求失败')
        error.response = response
        error.statusCode = statusCode
        error.errorCode = data.errorCode
        error.data = data
        throw error
      }
      return data
    }
    
    // 如果响应格式不符合预期，包装一下
    return {
      status: true,
      data: data,
      errorCode: '0'
    }
  }
  
  // 处理错误
  const error = new Error(data?.message || '请求失败')
  error.response = response
  error.statusCode = statusCode
  error.data = data
  throw error
}

// 请求函数
export const request = (options) => {
  // 应用请求拦截器
  options = requestInterceptor(options)
  
  // 设置超时时间
  options.timeout = config.timeout
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (response) => {
        try {
          const result = responseInterceptor(response)
          resolve(result)
        } catch (error) {
          console.error('Response processing error:', {
            error: error.message,
            statusCode: error.statusCode,
            errorCode: error.errorCode,
            data: error.data,
            stack: error.stack
          })
          reject(error)
        }
      },
      fail: (error) => {
        console.error('Request failed:', {
          error: error.errMsg,
          options: options
        })
        reject(new Error(error.errMsg || '网络请求失败'))
      }
    })
  })
}

// 导出配置，方便其他地方使用
export const apiConfig = config 