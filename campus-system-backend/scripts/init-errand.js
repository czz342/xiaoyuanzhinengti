const { db } = require('../config/database');
const ErrandOrder = require('../models/ErrandOrder');
const OrderStatusLog = require('../models/OrderStatusLog');

(async () => {
  try {
    await ErrandOrder.createTable();
    await OrderStatusLog.createTable();

    console.log('✅ 跑腿代办表已就绪');

    // 基础示例数据（若无数据时插入）
    const [rows] = await db.execute('SELECT COUNT(*) as c FROM errand_orders');
    if ((rows[0] && rows[0].c === 0)) {
      const demo = await ErrandOrder.create({
        title: '快递代取-菜鸟驿站A',
        description: '帮忙取下我的快递，轻一点谢谢',
        service_type: '快递代取',
        price: 5,
        publisher_id: 1,
        pickup_location: '菜鸟驿站A',
        delivery_location: '宿舍 3-214',
        expected_time: new Date(Date.now() + 60 * 60 * 1000),
        phone: '13700000000'
      });
      await OrderStatusLog.create({ order_id: demo.id, status: '待接单', operator_id: 1, remark: '初始化示例' });
      console.log('🆗 已插入示例订单');
    }

    process.exit(0);
  } catch (e) {
    console.error('❌ 初始化跑腿代办失败:', e);
    process.exit(1);
  }
})();


