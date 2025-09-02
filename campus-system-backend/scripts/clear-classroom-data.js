const { query } = require('../config/database');

async function clearClassroomData() {
  try {
    console.log('🧹 开始清空教室数据...');
    
    // 先删除预约数据（因为有外键约束）
    console.log('🗑️  删除教室预约数据...');
    await query('DELETE FROM classroom_reservations');
    console.log('✅ 教室预约数据已清空');
    
    // 删除教室数据
    console.log('🗑️  删除教室数据...');
    await query('DELETE FROM classrooms');
    console.log('✅ 教室数据已清空');
    
    // 重置自增ID
    console.log('🔄 重置自增ID...');
    await query('ALTER TABLE classroom_reservations AUTO_INCREMENT = 1');
    await query('ALTER TABLE classrooms AUTO_INCREMENT = 1');
    console.log('✅ 自增ID已重置');
    
    console.log('🎉 教室数据清空完成！');
    
  } catch (error) {
    console.error('❌ 清空数据失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  clearClassroomData();
}

module.exports = { clearClassroomData };
