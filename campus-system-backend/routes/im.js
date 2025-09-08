const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Canteen = require('../models/Canteen');

const appKey = '60e5b67bad1f7f081b25961628b0a325';
const appSecret = 'a38fcdf31663';

// 生成网易云信服务器API请求所需的 CheckSum
function getCheckSum(nonce, curTime) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(appSecret + nonce + curTime);
  return sha1.digest('hex');
}

// 更新用户在网易云信上的资料
async function updateIMUserProfile(accid, name, icon) {
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
    if (!icon.startsWith('http')) {
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
            // 异步更新用户资料，不等待结果
            const user = await User.findById(req.user.id);
            if (user) {
                updateIMUserProfile(userId, user.displayName, user.picture).catch(err => {
                    console.error('Failed to update IM user profile:', err);
                });
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

// 注册或获取IM用户凭证
router.post('/register', authenticateToken, async (req, res) => {
  const userId = req.user.id.toString();
  console.log('🔍 收到IM注册请求，用户ID:', userId);

  try {
    // 先尝试创建用户
    console.log('📡 正在调用网易云信API创建用户...');
    
    // 生成统一的nonce和curTime
    const nonce = Math.random().toString(36).substring(2);
    const curTime = Math.floor(Date.now() / 1000).toString();
    const checkSum = getCheckSum(nonce, curTime);
    
    console.log('🔐 签名参数:', { nonce, curTime, checkSum: checkSum.substring(0, 8) + '...' });
    
    const createResponse = await axios.post(
      'https://api.netease.im/nimserver/user/create.action',
      `accid=${userId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'AppKey': appKey,
          'Nonce': nonce,
          'CurTime': curTime,
          'CheckSum': checkSum,
        },
      }
    );

    console.log('📡 网易云信API响应:', createResponse.data);

    if (createResponse.data.code === 200) {
      console.log('✅ 用户创建成功，正在更新用户资料...');
      // 用户创建成功，更新用户资料
      const user = await User.findById(req.user.id);
      if (user) {
        await updateIMUserProfile(userId, user.displayName, user.picture);
      }
      
      const response = {
        success: true,
        appKey: appKey,
        account: createResponse.data.info.accid,
        imToken: createResponse.data.info.token,
      };
      console.log('📤 发送成功响应:', response);
      res.json(response);
    } else if (createResponse.data.code === 414) {
      console.log('⚠️ 用户已存在，正在刷新token...');
      // 用户已存在，直接刷新token
      const tokenResponse = await refreshToken(userId, req);
      console.log('📤 发送刷新token响应:', tokenResponse);
      res.json(tokenResponse);
    } else {
      console.log('❌ 创建用户失败:', createResponse.data);
      res.status(500).json({ success: false, message: createResponse.data.desc });
    }
  } catch (error) {
    console.error('❌ IM register error:', error.response ? error.response.data : error.message);
    console.error('❌ 错误详情:', error);
    
    // 如果是网络错误或其他错误，尝试刷新token
    if (error.response && error.response.data && error.response.data.code === 414) {
      console.log('⚠️ 检测到414错误，尝试刷新token...');
      try {
        const tokenResponse = await refreshToken(userId, req);
        console.log('📤 发送刷新token响应:', tokenResponse);
        res.json(tokenResponse);
      } catch (refreshError) {
        console.error('❌ Refresh token also failed:', refreshError);
        res.status(500).json({ success: false, message: 'Failed to register or refresh IM user.' });
      }
    } else {
      console.log('❌ 发送错误响应');
      res.status(500).json({ success: false, message: 'Failed to register IM user.' });
    }
  }
});

// 根据食堂ID获取其对应的用户ID (accid)
router.get('/get-canteen-accid/:canteenId', authenticateToken, async (req, res) => {
  const { canteenId } = req.params;
  const userName = `canteen_${canteenId}`;

  try {
    const canteenUser = await User.findByUsername(userName);
    if (canteenUser) {
      await updateIMUserProfile(canteenUser.id.toString(), canteenUser.displayName, canteenUser.picture);
      res.json({
        success: true,
        accid: canteenUser.id.toString(),
        uinfo: {
          account: canteenUser.id.toString(),
          nick: canteenUser.displayName,
          avatar: canteenUser.picture
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Canteen user not found' });
    }
  } catch (error) {
    console.error('Error fetching canteen user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 根据用户名获取其对应的用户ID (accid)
router.get('/get-user-accid/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findByUsername(username);
    if (user) {
      await updateIMUserProfile(user.id.toString(), user.displayName, user.picture);
      res.json({
        success: true,
        accid: user.id.toString(),
        uinfo: {
          account: user.id.toString(),
          nick: user.displayName,
          avatar: user.picture
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user accid by username:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.expor// 根据用户ID获取其IM accid和uinfo
router.get('/get-user-info/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      // 确保IM资料是最新的
      await updateIMUserProfile(user.id.toString(), user.displayName, user.picture);
      res.json({
        success: true,
        accid: user.id.toString(),
        uinfo: {
          account: user.id.toString(),
          nick: user.displayName,
          avatar: user.picture
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user info by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
