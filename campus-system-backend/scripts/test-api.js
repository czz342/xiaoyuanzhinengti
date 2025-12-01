/**
 * 测试窗口API
 */
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 测试窗口API...\n');
    
    // 测试用token（可能需要替换为有效的）
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoidGVzdDFAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzE1NDU2NDEsImV4cCI6MTczMjE1MDQ0MX0.iiV5Ppqmzsw-1qJM1oCZaawgT4cqgqgFjIaWJ5dzTuc';
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 1. 测试获取窗口列表
    console.log('1. 测试获取ST001的窗口列表...');
    try {
      const windowResponse = await axios.get(
        'http://localhost:3000/api/canteen-windows/canteens/ST001/windows',
        { headers }
      );
      console.log('✅ 窗口列表获取成功:');
      console.log(`   数量: ${windowResponse.data.data?.length || 0}`);
      if (windowResponse.data.data?.length > 0) {
        console.table(windowResponse.data.data.map(w => ({
          id: w.id,
          window_number: w.window_number,
          window_type: w.window_type,
          food_count: w.food_count
        })));
      }
      
      // 2. 测试获取第一个窗口的菜品
      if (windowResponse.data.data?.length > 0) {
        const firstWindow = windowResponse.data.data[0];
        console.log(`\n2. 测试获取窗口${firstWindow.window_number}的菜品...`);
        
        const foodResponse = await axios.get(
          `http://localhost:3000/api/canteen-windows/windows/${firstWindow.id}/foods`,
          { headers }
        );
        
        console.log('✅ 窗口菜品获取成功:');
        console.log(`   数量: ${foodResponse.data.data?.length || 0}`);
        if (foodResponse.data.data?.length > 0) {
          console.table(foodResponse.data.data.slice(0, 5).map(f => ({
            id: f.id,
            name: f.name,
            price: f.price,
            window_type: f.window_type
          })));
        }
      }
      
    } catch (error) {
      if (error.response) {
        console.error('❌ API错误:', error.response.status, error.response.data);
      } else {
        console.error('❌ 请求错误:', error.message);
      }
    }
    
    console.log('\n🎯 API测试完成');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

if (require.main === module) {
  testAPI();
}
