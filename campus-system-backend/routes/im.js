const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

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
      // 无论用户是新创建还是已存在，都尝试更新其资料
      const user = await User.findById(req.user.id);
      if (user) {
        // 异步更新，不需要等待其完成
        updateIMUserProfile(userId, user.displayName, user.picture);
      }

      // 如果用户已存在，错误码为 414，这也是正常情况
      if (response.data.code === 414) {
        // 用户已存在，需要为他获取一个新的token
        const tokenResponse = await refreshToken(userId, req);
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
async function refreshToken(userId, req) {
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
            // 异步更新用户资料
            const user = await User.findById(req.user.id);
            if (user) {
                updateIMUserProfile(userId, user.displayName, user.picture);
            }

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

// 更新用户在网易云信上的资料
async function updateIMUserProfile(accid, name, icon) {
  // 如果没有昵称或头像，则不更新
  if (!name && !icon) {
    return;
  }

  const nonce = Math.random().toString(36).substring(2);
  const curTime = Math.floor(Date.now() / 1000).toString();

  const params = new URLSearchParams();
  params.append('accid', accid);
  if (name) {
    params.append('name', name);
  }
  if (icon) {
    let fullIconUrl = icon;
    // 如果icon不是一个完整的URL，就拼接成完整的URL
    if (!icon.startsWith('http')) {
      // 注意：这里的域名和端口需要根据您的实际部署情况修改
      fullIconUrl = `http://localhost:3000/uploads/${icon}`;
    }
    params.append('icon', fullIconUrl);
  }

  try {
    const response = await axios.post(
      'https://api.netease.im/nimserver/user/updateUinfo.action',
      params.toString(),
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
      console.log(`✅ Successfully updated IM profile for user ${accid}`);
    } else {
      console.error(`❌ Failed to update IM profile for user ${accid}:`, response.data.desc);
    }
  } catch (error) {
    console.error('IM updateUinfo error:', error.response ? error.response.data : error.message);
  }
}

module.exports = router;

