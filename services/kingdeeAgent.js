console.warn("####### services/kingdeeAgent.js - NEW VERSION LOADED - " + new Date().toISOString() + " #######");
import { request } from '@/utils/request'

// 金蝶Agent平台API基础URL
const BASE_URL = '/kapi/v2/gai'  // 用于AI助手相关的API
const AUTH_BASE_URL = '/kapi/oauth2'  // 用于认证相关的API
const FULL_BASE_URL = 'http://127.0.0.1:8080/ierp'  // 完整的基础URL

// 配置信息
const CONFIG = {
  CLIENT_ID: 'xiaoyuanzhinengti',
  CLIENT_SECRET: '424266445Czz&424266445Czz&',
  USERNAME: 'chenzhizhang',
  ACCOUNT_ID: '1565321489509515264',
  LANGUAGE: 'zh_CN'
}

// 金蝶Agent API服务类
class KingdeeAgentService {
  // 检查并获取token
  static async ensureToken() {
    try {
      console.log('[ensureToken] 开始检查token...');
      
      let token = uni.getStorageSync('accessToken');
      let expiresAt = uni.getStorageSync('tokenExpiresAt');
      const now = Date.now();

      console.log('[ensureToken] 存储中的token状态:', {
        hasToken: !!token,
        expiresAt: expiresAt ? new Date(expiresAt).toLocaleString() : 'N/A',
        currentTime: new Date(now).toLocaleString(),
        isExpired: expiresAt ? now > expiresAt : true
      });

      if (!token || !expiresAt || now > expiresAt) {
        console.log('[ensureToken] Token无效或已过期，需要重新获取token');
        try {
          token = await this.getToken(); // getToken现在会抛出原始错误
          if (!token) {
            // 此情况理论上不应发生，因为getToken若无法获取有效token会reject
            console.error('[ensureToken] getToken返回了无效的token (null or undefined) 即使它没有抛出错误。');
            throw new Error('获取新token失败，getToken未返回有效token也未抛出错误');
          }
          console.log('[ensureToken] 成功获取新token');
        } catch (getTokenError) {
          console.error('[ensureToken] 调用getToken时发生错误:', getTokenError.message, getTokenError);
          // 直接抛出从getToken捕获的错误，以保留原始错误信息和类型
          throw getTokenError; 
        }
      }

      if (!token) {
        // 此处理论上不应该到达，因为上面getToken的错误会先抛出
        console.error('[ensureToken] 获取token流程结束后，token依然无效');
        throw new Error('无法获取有效token，流程异常');
      }
      
      console.log('[ensureToken] Token有效');
      return token;
    } catch (error) {
      console.error('[ensureToken] 最终错误:', error.message, error);
      // 确保抛出的是Error对象实例
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error.message || 'ensureToken发生未知错误');
      }
    }
  }

  // 获取token
  static async getToken() {
    console.log('[getToken] 方法启动');
    try {
      console.log('[getToken] 进入try块');
      
      const requestData = {
        client_id: CONFIG.CLIENT_ID,
        client_secret: CONFIG.CLIENT_SECRET,
        username: CONFIG.USERNAME,
        accountId: CONFIG.ACCOUNT_ID,
        language: CONFIG.LANGUAGE,
        nonce: this.generateNonce(),
        timestamp: this.generateTimestamp()
      };
      
      const loggableRequestData = { ...requestData, client_secret: '******' };
      console.log('[getToken] 请求数据已准备:', JSON.stringify(loggableRequestData));
      
      const url = `${FULL_BASE_URL}${AUTH_BASE_URL}/getToken`;
      console.log('[getToken] 请求URL:', url);

      console.log('[getToken] 返回新的Promise...');
      return new Promise((resolve, reject) => {
        console.log('[getToken] Promise执行器已启动，准备调用uni.request...');
        
        uni.request({
          url,
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          data: requestData,
          success: (res) => {
            console.log('[getToken] uni.request成功回调，状态码:', res.statusCode);
            console.log('[getToken] uni.request成功回调，原始响应头:', JSON.stringify(res.header || res.headers));
            console.log('[getToken] uni.request成功回调，原始响应数据:', JSON.stringify(res.data));
            
            if (res.statusCode === 200 && res.data && typeof res.data === 'object' && res.data.status === true && res.data.data && res.data.data.access_token) {
              const tokenData = res.data.data;
              console.log('[getToken] Token数据获取成功:', JSON.stringify(tokenData));
              
              try {
                uni.setStorageSync('accessToken', tokenData.access_token);
                
                // 假设 expires_in 是以秒为单位 (OAuth2标准常见做法)
                const expiresInSeconds = parseInt(tokenData.expires_in, 10);
                if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
                    console.warn(`[getToken] expires_in ("${tokenData.expires_in}") 不是一个有效的正数秒数, 使用默认过期时间7200秒`);
                    uni.setStorageSync('tokenExpiresAt', Date.now() + (7200 * 1000)); // 默认2小时
                } else {
                    // 提前5分钟过期作为缓冲
                    const bufferTimeMs = 5 * 60 * 1000; 
                    const expiryTime = Date.now() + (expiresInSeconds * 1000) - bufferTimeMs;
                    uni.setStorageSync('tokenExpiresAt', expiryTime);
                    console.log(`[getToken] Token过期时间已计算并设置: ${new Date(expiryTime).toLocaleString()} (基于expires_in: ${expiresInSeconds}s)`);
                }
                
                if (tokenData.refresh_token) {
                  uni.setStorageSync('refreshToken', tokenData.refresh_token);
                  console.log('[getToken] refreshToken已存储');
                } else {
                  console.log('[getToken] 未在响应中找到refreshToken');
                }
                console.log('[getToken] Token信息已成功存入Storage');
                resolve(tokenData.access_token);
              } catch (storageError) {
                console.error('[getToken] 保存token到Storage失败:', storageError.message, storageError);
                // 如果存储失败，这是一个严重问题，应阻止后续操作并通知错误
                reject(new Error(`存储token失败: ${storageError.message}`)); 
              }
            } else {
              let errorMsg = `无效的响应格式或服务端错误. Status: ${res.statusCode}`;
              if (res.data) {
                errorMsg += `, Kingdee Status: ${res.data.status}, ErrorCode: ${res.data.errorCode}, Message: ${res.data.message}`;
              }
              console.error('[getToken] 响应格式错误或业务失败:', errorMsg, '完整响应:', res.data);
              reject(new Error(errorMsg));
            }
          },
          fail: (err) => {
            console.error('[getToken] uni.request请求失败:', JSON.stringify(err));
            let errMsg = err.errMsg || '网络请求失败';
            if (err.data) { // uni.request的fail回调有时会在err.data中包含响应体
                errMsg += ` - ${JSON.stringify(err.data)}`;
            }
            reject(new Error(errMsg));
          }
        });
        console.log('[getToken] uni.request已调用 (异步)');
      });
    } catch (error) {
      console.error('[getToken] getToken方法内同步错误:', error.message, error.stack, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`获取token时发生同步错误: ${error.message || '未知错误'}`);
    }
  }

  // 生成UUID格式的nonce
  static generateNonce() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 生成格式化的时间戳
  static generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 验证token
  static async verifyToken(token) {
    try {
      if (!token) {
        console.warn('No token provided for verification');
        return false;
      }

      console.log('Verifying token:', token.substring(0, 10) + '...');
      const requestData = {
        "client_id": CONFIG.CLIENT_ID,
        "token_type_hint": "access_token",
        "token": token,
        "accountId": CONFIG.ACCOUNT_ID,
        "nonce": this.generateNonce(),
        "timestamp": this.generateTimestamp()
      };
      
      console.log('Token verification request:', {
        ...requestData,
        token: token.substring(0, 10) + '...' // 隐藏完整token
      });
      
      const response = await request({
        url: `${AUTH_BASE_URL}/verifyToken`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: requestData
      });

      console.log('Token verification response:', response);

      return response && response.status && response.data && response.data.active === true;
    } catch (error) {
      console.error('Error verifying token:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? {
          status: error.response.statusCode,
          data: error.response.data
        } : 'No response data'
      });
      return false;
    }
  }

  // 撤销token
  static async withdrawToken(token) {
    try {
      const response = await request({
        url: `${AUTH_BASE_URL}/withdrawToken`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "client_id": CONFIG.CLIENT_ID,
          "client_secret": CONFIG.CLIENT_SECRET,
          "token_type_hint": "access_token",
          "token": token,
          "accountId": CONFIG.ACCOUNT_ID,
          "nonce": this.generateNonce(),
          "timestamp": this.generateTimestamp()
        }
      });

      return response && response.status && response.data === true;
    } catch (error) {
      console.error('Error withdrawing token:', error);
      return false;
    }
  }

  // 获取助手列表
  static async getAssistants(attempt = 1) {
    try {
      const token = await this.ensureToken(); // ensureToken现在会抛出更具体的错误
      if (!token) {
        // ensureToken 应该已经抛出错误，但作为双重检查
        console.error('[getAssistants] ensureToken返回了无效的token');
        throw new Error('No valid token available for getAssistants');
      }
      
      console.log(`[getAssistants attempt ${attempt}] Fetching assistants list with token:`, token.substring(0,10) + '...');
      const requestId = Date.now().toString(); // 生成唯一的requestId
      
      const response = await request({
        url: `${BASE_URL}/assistants`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token,
          'Idempotency-Key': requestId
        }
      });
      
      console.log(`[getAssistants attempt ${attempt}] Assistants response:`, response);
      
      if (!response || response.status === false) { // 检查 response 是否存在
        const errorMsg = response?.message || '获取助手列表失败';
        console.error(`[getAssistants attempt ${attempt}] 获取助手列表失败:`, errorMsg, response);
        const err = new Error(errorMsg);
        err.data = response; 
        err.errorCode = response?.errorCode; 
        throw err;
      }
      
      return response;
    } catch (error) {
      const isKingdeeTokenExpiredError = (error.data && error.data.errorCode === '401') || (error.errorCode === '401');
      const messageIndicatesExpiry = /token已过期|AccessToken认证不通过/i.test(error.message || '');

      if (isKingdeeTokenExpiredError && messageIndicatesExpiry && attempt === 1) {
        console.warn('[getAssistants] Token expired or invalid. Clearing token and retrying ONCE.');
        try {
          uni.removeStorageSync('accessToken');
          uni.removeStorageSync('tokenExpiresAt');
          console.log('[getAssistants] Stored token cleared for retry.');
        } catch (e) {
          console.error('[getAssistants] Failed to remove token from storage during retry prep:', e);
        }
        return this.getAssistants(2); // Retry
      }
      
      console.error(`[getAssistants] Error getting assistants (attempt ${attempt}):`, error.message, error);
      if (error instanceof Error) throw error;
      throw new Error(`获取助手列表时发生错误 (attempt ${attempt}): ${error.message || '未知错误'}`);
    }
  }

  // 创建新会话
  static async createSession(assistantId, callbackUrl, attempt = 1) {
    try {
      const token = await this.ensureToken();
      if (!token) {
        console.error('[createSession] ensureToken返回了无效的token');
        throw new Error('No valid token available for createSession');
      }
      if (!assistantId) {
        console.error('[createSession] Assistant ID is required');
        throw new Error('Assistant ID is required for createSession');
      }
      if (!callbackUrl) {
        console.error('[createSession] Callback URL is required');
        throw new Error('Callback URL is required for createSession');
      }
      
      console.log(`[createSession attempt ${attempt}] Creating new session for assistant:`, assistantId, 'callbackUrl:', callbackUrl, 'with token:', token.substring(0,10) + '...');
      const requestId = this.generateNonce(); // 使用UUID作为requestId
      
      const response = await request({
        url: `${BASE_URL}/newsession`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token,
          'Idempotency-Key': requestId
        },
        data: {
          assistantId: assistantId,
          callbackUrl: callbackUrl
        }
      });
      
      console.log(`[createSession attempt ${attempt}] Session creation response:`, response);
      
      if (!response || response.status === false) {
        const errorMsg = response?.message || '创建会话失败';
        console.error(`[createSession attempt ${attempt}] 创建会话失败:`, errorMsg, response);
        const err = new Error(errorMsg);
        err.data = response;
        err.errorCode = response?.errorCode;
        throw err;
      }
      
      return response;
    } catch (error) {
      const isKingdeeTokenExpiredError = (error.data && error.data.errorCode === '401') || (error.errorCode === '401');
      const messageIndicatesExpiry = /token已过期|AccessToken认证不通过/i.test(error.message || '');

      if (isKingdeeTokenExpiredError && messageIndicatesExpiry && attempt === 1) {
        console.warn('[createSession] Token expired or invalid. Clearing token and retrying ONCE.');
        try {
          uni.removeStorageSync('accessToken');
          uni.removeStorageSync('tokenExpiresAt');
          console.log('[createSession] Stored token cleared for retry.');
        } catch (e) {
          console.error('[createSession] Failed to remove token from storage during retry prep:', e);
        }
        return this.createSession(assistantId, callbackUrl, 2); // Retry
      }

      console.error(`[createSession] Error creating session (attempt ${attempt}):`, error.message, error);
      if (error instanceof Error) throw error;
      throw new Error(`创建新会话时发生错误 (attempt ${attempt}): ${error.message || '未知错误'}`);
    }
  }

  // 发送聊天消息
  static async sendChatMessage({
    sessionId,
    userInput
    /* assistantId is not needed for this call per new docs */
  }) {
    console.log(`Initiating sendChatMessage with sessionId: ${sessionId}`);
    try {
      // 确保我们有有效的token
      await this.ensureToken();

      // 根据最新的API文档 (2.3 对话) 构建请求体
      const chatTraceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const requestBody = {
        sessionId: sessionId,
        chatTraceId: chatTraceId, // 新增：根据文档，此为必填项
        message: {
          query: userInput, // 修正：用户输入应在 message.query 中
        }
        // 根据新文档，此接口不需要 assistantId, callbackUrl, stream等参数
      };

      console.log(`Sending chat message with new request body:`, JSON.stringify(requestBody));

      // 使用通用的request工具发送请求
      const response = await request({
        url: `${BASE_URL}/chat`,
        method: 'POST',
        data: requestBody
        // token会由request拦截器自动添加
      });

      console.log(`Raw Chat response object (from request util):`, JSON.stringify(response));

      // 检查 Kingdee API 返回的业务状态
      if (response && response.status === true && response.data && response.data.traceId) {
        console.log(`Chat message sent successfully (Kingdee status:true, traceId present). Returning .data part:`, response.data);
        return response.data; // 返回包含traceId的 .data 对象
      } else {
        // 如果Kingdee API返回业务失败
        const errorMsg = `Kingdee chat API returned an error or unexpected format. Response: ${JSON.stringify(response)}`;
        console.error(errorMsg);
        throw new Error(response.message || '聊天接口返回失败');
      }

    } catch (error) {
      // 捕获请求或逻辑中的任何错误
      console.error(`Error in sendChatMessage service:`, error.message, error);
      // 重新抛出错误，以便上层可以捕获并处理
      throw error;
    }
  }

  // 停止对话
  static async stopChat(sessionId, taskId, attempt = 1) {
    try {
      const token = await this.ensureToken();
      if (!token) {
        console.error('[stopChat] ensureToken返回了无效的token');
        throw new Error('No valid token available for stopChat');
      }
      
      if (!sessionId || !taskId) {
        console.error('[stopChat] Session ID and Task ID are required');
        throw new Error('Session ID and Task ID are required');
      }
      
      console.log(`[stopChat attempt ${attempt}] Stopping chat:`, { sessionId, taskId }, 'with token:', token.substring(0,10) + '...');
      
      const requestId = Date.now().toString();
      
      const response = await request({
        url: `${BASE_URL}/chat/stop`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token,
          'Idempotency-Key': requestId
        },
        data: {
          sessionId,
          taskId
        }
      });
      
      console.log(`[stopChat attempt ${attempt}] Stop chat response:`, response);
      
      if (!response || response.status === false) {
        const errorMsg = response?.message || '停止对话失败';
        console.error(`[stopChat attempt ${attempt}] 停止对话失败:`, errorMsg, response);
        const err = new Error(errorMsg);
        err.data = response;
        err.errorCode = response?.errorCode;
        throw err;
      }
      
      return response;
    } catch (error) {
      const isKingdeeTokenExpiredError = (error.data && error.data.errorCode === '401') || (error.errorCode === '401');
      const messageIndicatesExpiry = /token已过期|AccessToken认证不通过/i.test(error.message || '');

      if (isKingdeeTokenExpiredError && messageIndicatesExpiry && attempt === 1) {
        console.warn('[stopChat] Token expired or invalid. Clearing token and retrying ONCE.');
        try {
          uni.removeStorageSync('accessToken');
          uni.removeStorageSync('tokenExpiresAt');
          console.log('[stopChat] Stored token cleared for retry.');
        } catch (e) {
          console.error('[stopChat] Failed to remove token from storage during retry prep:', e);
        }
        return this.stopChat(sessionId, taskId, 2); // Retry
      }
      
      console.error(`[stopChat] Error stopping chat (attempt ${attempt}):`, error.message, error);
      if (error instanceof Error) throw error;
      throw new Error(`停止对话时发生错误 (attempt ${attempt}): ${error.message || '未知错误'}`);
    }
  }
}

export default KingdeeAgentService 