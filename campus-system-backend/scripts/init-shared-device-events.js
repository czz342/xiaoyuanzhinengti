const mysql = require('mysql2/promise');
const config = require('../config/config');

async function main() {
  const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password || '424266445Czz',
    database: 'campus_system',
    multipleStatements: true
  });

  try {
    console.log('🔧 开启 MySQL 事件调度器...');
    await pool.query('SET GLOBAL event_scheduler = ON');

    console.log('🗓️ 创建/更新 自动释放洗衣设备 与 完成订单 事件...');
    const sql = `
      CREATE EVENT IF NOT EXISTS ev_release_laundry_devices
      ON SCHEDULE EVERY 1 MINUTE
      DO
      BEGIN
        -- 将到期的进行中/已支付洗衣订单设置为已完成
        UPDATE laundry_orders 
        SET status = '已完成', completion_time = NOW(), updated_at = NOW()
        WHERE status IN ('进行中','已支付') AND end_time IS NOT NULL AND end_time <= NOW();

        -- 释放对应的设备使用状态
        UPDATE shared_devices sd
        JOIN laundry_orders lo ON lo.device_id = sd.id
        SET sd.usage_status = '空闲', sd.updated_at = NOW()
        WHERE lo.status = '已完成' AND lo.end_time IS NOT NULL AND lo.end_time <= NOW();
      END;
    `;
    await pool.query(sql);

    console.log('✅ 事件创建完成');
  } catch (e) {
    console.error('❌ 初始化事件失败:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };


