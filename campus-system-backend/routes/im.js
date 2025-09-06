const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');

const appKey = '60e5b67bad1f7f081b25961628b0a325';
const appSecret = 'a38fcdf31663';

// 生成网易云信服务器API请求所需的 CheckSum
function getCheckSum(nonce, curTime) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(appSecret + nonce + curTime);
  return sha1.digest('hex');
}

// 注册或获取IM用户凭证
router.post('/register', authenticateToken, async (req, res) => {
  const userId = req.user.id.toString(); // 从认证中间件获取用户ID

  const nonce = Math.random().toString(36).substring(2);
  const curTime = Math.floor(Date.now() / 1000).toString();

  try {
    const response = await axios.post(
      'https://api.netease.im/nimserver/user/create.action',
      `accid=${userId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'AppKey': appKey,
          'Nonce': nonce,
          'CurTime': curTime,
          'CheckSum': getCheckSum(nonce, curTime),
        },
      }
    );

    if (response.data.code === 200) {
      res.json({
        success: true,
        appKey: appKey,
        account: response.data.info.accid,
        imToken: response.data.info.token,
      });
    } else {
      // 如果用户已存在，错误码为 414，这也是正常情况
      if (response.data.code === 414) {
        // 用户已存在，需要为他获取一个新的token
        const tokenResponse = await refreshToken(userId);
        res.json(tokenResponse);
      } else {
        res.status(500).json({ success: false, message: response.data.desc });
      }
    }
  } catch (error) {
    console.error('IM register error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Failed to register IM user.' });
  }
});

// 刷新（获取）用户 token
async function refreshToken(userId) {
    const nonce = Math.random().toString(36).substring(2);
    const curTime = Math.floor(Date.now() / 1000).toString();

    try {
        const response = await axios.post(
            'https://api.netease.im/nimserver/user/refreshToken.action',
            `accid=${userId}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'AppKey': appKey,
                    'Nonce': nonce,
                    'CurTime': curTime,
                    'CheckSum': getCheckSum(nonce, curTime),
                },
            }
        );

        if (response.data.code === 200) {
            return { 
                success: true, 
                appKey: appKey,
                account: response.data.info.accid, 
                imToken: response.data.info.token 
            };
        } else {
            return { success: false, message: response.data.desc };
        }
    } catch (error) {
        console.error('IM refresh token error:', error.response ? error.response.data : error.message);
        return { success: false, message: 'Failed to refresh IM token.' };
    }
}

module.exports = router;

