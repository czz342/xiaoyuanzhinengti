/**
 * 测试口味分析功能
 */
const db = require('../config/database');

async function testTasteAnalysisAPI() {
  try {
    console.log('🍽️ 测试口味分析API功能...\n');
    
    // 1. 模拟API调用
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoidGVzdDFAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzE1NDU2NDEsImV4cCI6MTczMjE1MDQ0MX0.iiV5Ppqmzsw-1qJM1oCZaawgT4cqgqgFjIaWJ5dzTuc';
    
    const http = require('http');
    const url = 'http://localhost:3000/api/dining-analysis/recommendation';
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log('📡 调用推荐API...');
    console.log('URL:', url);
    console.log('Headers:', options.headers);
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(data)
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: data
            });
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
    
    console.log('\n📊 API响应结果:');
    console.log('状态码:', response.statusCode);
    
    if (response.statusCode === 200 && response.data.success) {
      const userPreference = response.data.data.userPreference;
      
      console.log('\n✅ API调用成功');
      console.log('📋 用户偏好基本信息:');
      console.log(`   - 有数据: ${userPreference.hasData}`);
      console.log(`   - 分析订单数: ${userPreference.analyzedOrderCount}`);
      console.log(`   - 分析菜品数: ${userPreference.analyzedItemCount}`);
      
      if (userPreference.recentTasteAnalysis) {
        console.log('\n🌶️ 近期口味偏好分析:');
        Object.entries(userPreference.recentTasteAnalysis).forEach(([taste, data]) => {
          console.log(`   - ${taste}: ${data.percentage}% (${data.trendText})`);
        });
      }
      
      if (userPreference.tasteComparison) {
        console.log('\n📈 口味对比分析:');
        Object.entries(userPreference.tasteComparison).forEach(([taste, data]) => {
          console.log(`   - ${taste}: 近期${data.recent}% vs 历史${data.overall}%`);
        });
      }
      
      console.log('\n🎯 推荐信息:');
      const recommendations = response.data.data.recommendations;
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.canteen} ${rec.window}(${rec.windowType}) - 评分:${rec.score}`);
      });
      
    } else {
      console.log('❌ API调用失败');
      console.log('错误信息:', response.data);
    }
    
    console.log('\n🎉 口味分析测试完成！');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testTasteAnalysisAPI();
}

module.exports = { testTasteAnalysisAPI };
