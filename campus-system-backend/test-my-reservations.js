const axios = require('axios');

async function testMyReservations() {
  try {
    // 1. 先登录获取token
    console.log('🔐 正在登录...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      userName: 'testuser2',
      password: '123456'
    });

    if (!loginResponse.data.success) {
      console.error('❌ 登录失败:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获取到token');

    // 2. 测试我的预约API
    console.log('📋 正在获取我的预约...');
    const reservationsResponse = await axios.get('http://localhost:3000/api/classroom/reservations/my', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (reservationsResponse.data.success) {
      console.log('✅ 获取预约成功');
      console.log('📊 预约数据:', JSON.stringify(reservationsResponse.data.data, null, 2));
    } else {
      console.error('❌ 获取预约失败:', reservationsResponse.data.message);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

testMyReservations();
