const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// 测试用户注册
async function testUserRegister() {
  try {
    console.log('🧪 测试用户注册接口...');
    
    const registerData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: '123456',
      real_name: '测试用户',
      student_id: '2024001',
      phone: '13900000001'
    };

    const response = await axios.post(`${BASE_URL}/auth/register`, registerData);
    
    if (response.data.success) {
      console.log('✅ 用户注册成功');
      console.log('   用户ID:', response.data.data.user.id);
      console.log('   用户名:', response.data.data.user.userName);
      console.log('   令牌:', response.data.data.token.substring(0, 20) + '...');
      return response.data.data.token;
    } else {
      console.log('❌ 用户注册失败:', response.data.message);
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ 注册请求失败:', error.response.data.message);
    } else {
      console.log('❌ 网络错误:', error.message);
    }
    return null;
  }
}

// 测试用户登录
async function testUserLogin() {
  try {
    console.log('\n🧪 测试用户登录接口...');
    
    const loginData = {
      username: 'testuser',
      password: '123456'
    };

    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (response.data.success) {
      console.log('✅ 用户登录成功');
      console.log('   用户ID:', response.data.data.user.id);
      console.log('   用户名:', response.data.data.user.userName);
      console.log('   信誉评分:', response.data.data.user.creditScore);
      console.log('   完成订单数:', response.data.data.user.completedOrders);
      return response.data.data.token;
    } else {
      console.log('❌ 用户登录失败:', response.data.message);
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ 登录请求失败:', error.response.data.message);
    } else {
      console.log('❌ 网络错误:', error.message);
    }
    return null;
  }
}

// 测试获取用户信息
async function testGetUserInfo(token) {
  try {
    console.log('\n🧪 测试获取用户信息接口...');
    
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ 获取用户信息成功');
      console.log('   用户ID:', response.data.data.id);
      console.log('   用户名:', response.data.data.userName);
      console.log('   昵称:', response.data.data.displayName);
      console.log('   学号:', response.data.data.studentId);
      console.log('   信誉评分:', response.data.data.creditScore);
    } else {
      console.log('❌ 获取用户信息失败:', response.data.message);
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ 获取用户信息失败:', error.response.data.message);
    } else {
      console.log('❌ 网络错误:', error.message);
    }
  }
}

// 测试管理员登录
async function testAdminLogin() {
  try {
    console.log('\n🧪 测试管理员登录接口...');
    
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };

    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (response.data.success) {
      console.log('✅ 管理员登录成功');
      console.log('   用户ID:', response.data.data.user.id);
      console.log('   用户名:', response.data.data.user.userName);
      return response.data.data.token;
    } else {
      console.log('❌ 管理员登录失败:', response.data.message);
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ 管理员登录请求失败:', error.response.data.message);
    } else {
      console.log('❌ 网络错误:', error.message);
    }
    return null;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始API接口测试...\n');
  
  // 测试用户注册
  const userToken = await testUserRegister();
  
  // 测试用户登录
  const loginToken = await testUserLogin();
  
  // 测试获取用户信息
  if (loginToken) {
    await testGetUserInfo(loginToken);
  }
  
  // 测试管理员登录
  const adminToken = await testAdminLogin();
  
  console.log('\n🎉 API接口测试完成！');
}

// 运行测试
runTests().catch(console.error);
