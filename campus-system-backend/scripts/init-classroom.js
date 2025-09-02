const Classroom = require('../models/Classroom');
const ClassroomReservation = require('../models/ClassroomReservation');
const { ensureDatabase } = require('../config/database');

async function initClassroomTables() {
  try {
    console.log('🚀 开始初始化教室预约模块...');
    
    // 确保数据库存在
    await ensureDatabase();
    
    // 创建教室表
    console.log('📋 创建教室表...');
    await Classroom.createTable();
    
    // 创建教室预约表
    console.log('📋 创建教室预约表...');
    await ClassroomReservation.createTable();
    
    console.log('✅ 教室预约模块初始化完成！');
    
    // 插入示例教室数据
    console.log('📝 插入示例教室数据...');
    await insertSampleClassrooms();
    
    console.log('🎉 教室预约模块完全初始化完成！');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

async function insertSampleClassrooms() {
  const sampleClassrooms = [
    // 教学楼A - 理论教学楼
    // 1层
    {
      code: 'A101',
      name: 'A101多媒体教室',
      building: '教学楼A',
      floor: '1',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 150,
      description: '多媒体教室，适合理论课程教学'
    },
    {
      code: 'A102',
      name: 'A102智慧教室',
      building: '教学楼A',
      floor: '1',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '智慧黑板', '音响']),
      position_x: 200,
      position_y: 150,
      description: '智慧教室，配备先进教学设备'
    },
    {
      code: 'A103',
      name: 'A103普通教室',
      building: '教学楼A',
      floor: '1',
      capacity: 50,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 150,
      description: '标准教室，适合小班教学'
    },
    {
      code: 'A104',
      name: 'A104多媒体教室',
      building: '教学楼A',
      floor: '1',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 150,
      description: '多媒体教室，适合理论课程'
    },
    {
      code: 'A105',
      name: 'A105普通教室',
      building: '教学楼A',
      floor: '1',
      capacity: 45,
      status: 'maintenance',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 150,
      description: '标准教室，设备维护中'
    },
    
    // 2层
    {
      code: 'A201',
      name: 'A201多媒体教室',
      building: '教学楼A',
      floor: '2',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 250,
      description: '多媒体教室，适合理论课程教学'
    },
    {
      code: 'A202',
      name: 'A202智慧教室',
      building: '教学楼A',
      floor: '2',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '智慧黑板', '音响']),
      position_x: 200,
      position_y: 250,
      description: '智慧教室，配备先进教学设备'
    },
    {
      code: 'A203',
      name: 'A203普通教室',
      building: '教学楼A',
      floor: '2',
      capacity: 55,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 250,
      description: '标准教室，适合小班教学'
    },
    {
      code: 'A204',
      name: 'A204多媒体教室',
      building: '教学楼A',
      floor: '2',
      capacity: 75,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 250,
      description: '多媒体教室，适合理论课程'
    },
    {
      code: 'A205',
      name: 'A205普通教室',
      building: '教学楼A',
      floor: '2',
      capacity: 50,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 250,
      description: '标准教室，适合小班教学'
    },
    
    // 3层
    {
      code: 'A301',
      name: 'A301多媒体教室',
      building: '教学楼A',
      floor: '3',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 350,
      description: '多媒体教室，适合理论课程教学'
    },
    {
      code: 'A302',
      name: 'A302智慧教室',
      building: '教学楼A',
      floor: '3',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '智慧黑板', '音响']),
      position_x: 200,
      position_y: 350,
      description: '智慧教室，配备先进教学设备'
    },
    {
      code: 'A303',
      name: 'A303普通教室',
      building: '教学楼A',
      floor: '3',
      capacity: 50,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 350,
      description: '标准教室，适合小班教学'
    },
    {
      code: 'A304',
      name: 'A304多媒体教室',
      building: '教学楼A',
      floor: '3',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 350,
      description: '多媒体教室，适合理论课程'
    },
    {
      code: 'A305',
      name: 'A305普通教室',
      building: '教学楼A',
      floor: '3',
      capacity: 45,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 350,
      description: '标准教室，适合小班教学'
    },
    
    // 4层
    {
      code: 'A401',
      name: 'A401多媒体教室',
      building: '教学楼A',
      floor: '4',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 450,
      description: '多媒体教室，适合理论课程教学'
    },
    {
      code: 'A402',
      name: 'A402智慧教室',
      building: '教学楼A',
      floor: '4',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '智慧黑板', '音响']),
      position_x: 200,
      position_y: 450,
      description: '智慧教室，配备先进教学设备'
    },
    {
      code: 'A403',
      name: 'A403普通教室',
      building: '教学楼A',
      floor: '4',
      capacity: 55,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 450,
      description: '标准教室，适合小班教学'
    },
    {
      code: 'A404',
      name: 'A404多媒体教室',
      building: '教学楼A',
      floor: '4',
      capacity: 75,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 450,
      description: '多媒体教室，适合理论课程'
    },
    {
      code: 'A405',
      name: 'A405普通教室',
      building: '教学楼A',
      floor: '4',
      capacity: 50,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 450,
      description: '标准教室，适合小班教学'
    },
    
    // 教学楼B - 实验教学楼
    // 1层
    {
      code: 'B101',
      name: 'B101计算机实验室',
      building: '教学楼B',
      floor: '1',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '投影仪', '实验设备']),
      position_x: 100,
      position_y: 150,
      description: '计算机实验室，配备专业设备'
    },
    {
      code: 'B102',
      name: 'B102物理实验室',
      building: '教学楼B',
      floor: '1',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['空调', '实验设备', '投影仪']),
      position_x: 200,
      position_y: 150,
      description: '物理实验室，适合物理实验课程'
    },
    {
      code: 'B103',
      name: 'B103化学实验室',
      building: '教学楼B',
      floor: '1',
      capacity: 20,
      status: 'available',
      equipment: JSON.stringify(['空调', '实验设备', '通风设备']),
      position_x: 300,
      position_y: 150,
      description: '化学实验室，配备通风设备'
    },
    {
      code: 'B104',
      name: 'B104生物实验室',
      building: '教学楼B',
      floor: '1',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['空调', '实验设备', '显微镜']),
      position_x: 400,
      position_y: 150,
      description: '生物实验室，配备显微镜等设备'
    },
    {
      code: 'B105',
      name: 'B105电子实验室',
      building: '教学楼B',
      floor: '1',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '实验设备', '示波器']),
      position_x: 500,
      position_y: 150,
      description: '电子实验室，配备电子测试设备'
    },
    
    // 2层
    {
      code: 'B201',
      name: 'B201网络实验室',
      building: '教学楼B',
      floor: '2',
      capacity: 35,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '网络设备', '投影仪']),
      position_x: 100,
      position_y: 250,
      description: '网络实验室，配备网络设备'
    },
    {
      code: 'B202',
      name: 'B202软件实验室',
      building: '教学楼B',
      floor: '2',
      capacity: 40,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '投影仪', '开发工具']),
      position_x: 200,
      position_y: 250,
      description: '软件实验室，适合编程课程'
    },
    {
      code: 'B203',
      name: 'B203机械实验室',
      building: '教学楼B',
      floor: '2',
      capacity: 20,
      status: 'available',
      equipment: JSON.stringify(['空调', '机械设备', '工具']),
      position_x: 300,
      position_y: 250,
      description: '机械实验室，配备机械设备'
    },
    {
      code: 'B204',
      name: 'B204材料实验室',
      building: '教学楼B',
      floor: '2',
      capacity: 15,
      status: 'available',
      equipment: JSON.stringify(['空调', '实验设备', '显微镜']),
      position_x: 400,
      position_y: 250,
      description: '材料实验室，适合材料分析'
    },
    {
      code: 'B205',
      name: 'B205自动化实验室',
      building: '教学楼B',
      floor: '2',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '自动化设备', 'PLC']),
      position_x: 500,
      position_y: 250,
      description: '自动化实验室，配备PLC等设备'
    },
    
    // 3层
    {
      code: 'B301',
      name: 'B301多媒体实验室',
      building: '教学楼B',
      floor: '3',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '多媒体设备', '投影仪']),
      position_x: 100,
      position_y: 350,
      description: '多媒体实验室，适合多媒体制作'
    },
    {
      code: 'B302',
      name: 'B302通信实验室',
      building: '教学楼B',
      floor: '3',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '通信设备', '示波器']),
      position_x: 200,
      position_y: 350,
      description: '通信实验室，配备通信测试设备'
    },
    {
      code: 'B303',
      name: 'B303控制实验室',
      building: '教学楼B',
      floor: '3',
      capacity: 20,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '控制设备', '传感器']),
      position_x: 300,
      position_y: 350,
      description: '控制实验室，配备控制系统'
    },
    {
      code: 'B304',
      name: 'B304信号实验室',
      building: '教学楼B',
      floor: '3',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '信号设备', '分析仪']),
      position_x: 400,
      position_y: 350,
      description: '信号实验室，适合信号处理实验'
    },
    {
      code: 'B305',
      name: 'B305嵌入式实验室',
      building: '教学楼B',
      floor: '3',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '嵌入式设备', '开发板']),
      position_x: 500,
      position_y: 350,
      description: '嵌入式实验室，配备开发板等设备'
    },
    
    // 4层
    {
      code: 'B401',
      name: 'B401人工智能实验室',
      building: '教学楼B',
      floor: '4',
      capacity: 35,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', 'AI设备', 'GPU服务器']),
      position_x: 100,
      position_y: 450,
      description: '人工智能实验室，配备GPU服务器'
    },
    {
      code: 'B402',
      name: 'B402数据科学实验室',
      building: '教学楼B',
      floor: '4',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '数据分析工具', '投影仪']),
      position_x: 200,
      position_y: 450,
      description: '数据科学实验室，适合数据分析课程'
    },
    {
      code: 'B403',
      name: 'B403虚拟现实实验室',
      building: '教学楼B',
      floor: '4',
      capacity: 20,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', 'VR设备', '投影仪']),
      position_x: 300,
      position_y: 450,
      description: '虚拟现实实验室，配备VR设备'
    },
    {
      code: 'B404',
      name: 'B404机器人实验室',
      building: '教学楼B',
      floor: '4',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', '机器人设备', '传感器']),
      position_x: 400,
      position_y: 450,
      description: '机器人实验室，配备机器人设备'
    },
    {
      code: 'B405',
      name: 'B405物联网实验室',
      building: '教学楼B',
      floor: '4',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['电脑', '空调', 'IoT设备', '传感器']),
      position_x: 500,
      position_y: 450,
      description: '物联网实验室，配备IoT设备'
    },
    
    // 教学楼C - 专业教学楼
    // 1层
    {
      code: 'C101',
      name: 'C101报告厅',
      building: '教学楼C',
      floor: '1',
      capacity: 200,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响系统', '麦克风']),
      position_x: 100,
      position_y: 150,
      description: '大型报告厅，适合讲座和会议'
    },
    {
      code: 'C102',
      name: 'C102会议室',
      building: '教学楼C',
      floor: '1',
      capacity: 50,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '会议设备']),
      position_x: 200,
      position_y: 150,
      description: '中型会议室，适合学术会议'
    },
    {
      code: 'C103',
      name: 'C103研讨室',
      building: '教学楼C',
      floor: '1',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调', '白板', '会议桌']),
      position_x: 300,
      position_y: 150,
      description: '研讨室，适合小组讨论'
    },
    {
      code: 'C104',
      name: 'C104多媒体教室',
      building: '教学楼C',
      floor: '1',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 150,
      description: '多媒体教室，适合专业课程'
    },
    {
      code: 'C105',
      name: 'C105普通教室',
      building: '教学楼C',
      floor: '1',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 150,
      description: '标准教室，适合专业课程'
    },
    
    // 2层
    {
      code: 'C201',
      name: 'C201专业教室',
      building: '教学楼C',
      floor: '2',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '专业设备']),
      position_x: 100,
      position_y: 250,
      description: '专业教室，适合特定专业课程'
    },
    {
      code: 'C202',
      name: 'C202多媒体教室',
      building: '教学楼C',
      floor: '2',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 200,
      position_y: 250,
      description: '多媒体教室，适合专业课程'
    },
    {
      code: 'C203',
      name: 'C203研讨室',
      building: '教学楼C',
      floor: '2',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调', '白板', '会议桌']),
      position_x: 300,
      position_y: 250,
      description: '研讨室，适合小组讨论'
    },
    {
      code: 'C204',
      name: 'C204普通教室',
      building: '教学楼C',
      floor: '2',
      capacity: 55,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 400,
      position_y: 250,
      description: '标准教室，适合专业课程'
    },
    {
      code: 'C205',
      name: 'C205专业教室',
      building: '教学楼C',
      floor: '2',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '专业设备']),
      position_x: 500,
      position_y: 250,
      description: '专业教室，适合特定专业课程'
    },
    
    // 3层
    {
      code: 'C301',
      name: 'C301多媒体教室',
      building: '教学楼C',
      floor: '3',
      capacity: 75,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 350,
      description: '多媒体教室，适合专业课程'
    },
    {
      code: 'C302',
      name: 'C302普通教室',
      building: '教学楼C',
      floor: '3',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 200,
      position_y: 350,
      description: '标准教室，适合专业课程'
    },
    {
      code: 'C303',
      name: 'C303专业教室',
      building: '教学楼C',
      floor: '3',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '专业设备']),
      position_x: 300,
      position_y: 350,
      description: '专业教室，适合特定专业课程'
    },
    {
      code: 'C304',
      name: 'C304研讨室',
      building: '教学楼C',
      floor: '3',
      capacity: 30,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调', '白板', '会议桌']),
      position_x: 400,
      position_y: 350,
      description: '研讨室，适合小组讨论'
    },
    {
      code: 'C305',
      name: 'C305多媒体教室',
      building: '教学楼C',
      floor: '3',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 500,
      position_y: 350,
      description: '多媒体教室，适合专业课程'
    },
    
    // 4层
    {
      code: 'C401',
      name: 'C401普通教室',
      building: '教学楼C',
      floor: '4',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 100,
      position_y: 450,
      description: '标准教室，适合专业课程'
    },
    {
      code: 'C402',
      name: 'C402专业教室',
      building: '教学楼C',
      floor: '4',
      capacity: 75,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '专业设备']),
      position_x: 200,
      position_y: 450,
      description: '专业教室，适合特定专业课程'
    },
    {
      code: 'C403',
      name: 'C403多媒体教室',
      building: '教学楼C',
      floor: '4',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 300,
      position_y: 450,
      description: '多媒体教室，适合专业课程'
    },
    {
      code: 'C404',
      name: 'C404研讨室',
      building: '教学楼C',
      floor: '4',
      capacity: 25,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调', '白板', '会议桌']),
      position_x: 400,
      position_y: 450,
      description: '研讨室，适合小组讨论'
    },
    {
      code: 'C405',
      name: 'C405普通教室',
      building: '教学楼C',
      floor: '4',
      capacity: 55,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 450,
      description: '标准教室，适合专业课程'
    },
    
    // 教学楼D - 综合教学楼
    // 1层
    {
      code: 'D101',
      name: 'D101大教室',
      building: '教学楼D',
      floor: '1',
      capacity: 120,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响', '麦克风']),
      position_x: 100,
      position_y: 150,
      description: '大型教室，适合大班教学'
    },
    {
      code: 'D102',
      name: 'D102多媒体教室',
      building: '教学楼D',
      floor: '1',
      capacity: 90,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 200,
      position_y: 150,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D103',
      name: 'D103普通教室',
      building: '教学楼D',
      floor: '1',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 150,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D104',
      name: 'D104多媒体教室',
      building: '教学楼D',
      floor: '1',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 150,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D105',
      name: 'D105普通教室',
      building: '教学楼D',
      floor: '1',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 150,
      description: '标准教室，适合综合课程'
    },
    
    // 2层
    {
      code: 'D201',
      name: 'D201多媒体教室',
      building: '教学楼D',
      floor: '2',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 250,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D202',
      name: 'D202普通教室',
      building: '教学楼D',
      floor: '2',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 200,
      position_y: 250,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D203',
      name: 'D203多媒体教室',
      building: '教学楼D',
      floor: '2',
      capacity: 90,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 300,
      position_y: 250,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D204',
      name: 'D204普通教室',
      building: '教学楼D',
      floor: '2',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 400,
      position_y: 250,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D205',
      name: 'D205多媒体教室',
      building: '教学楼D',
      floor: '2',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 500,
      position_y: 250,
      description: '多媒体教室，适合综合课程'
    },
    
    // 3层
    {
      code: 'D301',
      name: 'D301普通教室',
      building: '教学楼D',
      floor: '3',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 100,
      position_y: 350,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D302',
      name: 'D302多媒体教室',
      building: '教学楼D',
      floor: '3',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 200,
      position_y: 350,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D303',
      name: 'D303普通教室',
      building: '教学楼D',
      floor: '3',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 300,
      position_y: 350,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D304',
      name: 'D304多媒体教室',
      building: '教学楼D',
      floor: '3',
      capacity: 90,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 400,
      position_y: 350,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D305',
      name: 'D305普通教室',
      building: '教学楼D',
      floor: '3',
      capacity: 60,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 500,
      position_y: 350,
      description: '标准教室，适合综合课程'
    },
    
    // 4层
    {
      code: 'D401',
      name: 'D401多媒体教室',
      building: '教学楼D',
      floor: '4',
      capacity: 85,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 100,
      position_y: 450,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D402',
      name: 'D402普通教室',
      building: '教学楼D',
      floor: '4',
      capacity: 70,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 200,
      position_y: 450,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D403',
      name: 'D403多媒体教室',
      building: '教学楼D',
      floor: '4',
      capacity: 80,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 300,
      position_y: 450,
      description: '多媒体教室，适合综合课程'
    },
    {
      code: 'D404',
      name: 'D404普通教室',
      building: '教学楼D',
      floor: '4',
      capacity: 65,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '空调']),
      position_x: 400,
      position_y: 450,
      description: '标准教室，适合综合课程'
    },
    {
      code: 'D405',
      name: 'D405多媒体教室',
      building: '教学楼D',
      floor: '4',
      capacity: 90,
      status: 'available',
      equipment: JSON.stringify(['投影仪', '电脑', '空调', '音响']),
      position_x: 500,
      position_y: 450,
      description: '多媒体教室，适合综合课程'
    }
  ];

  for (const classroomData of sampleClassrooms) {
    try {
      await Classroom.create(classroomData);
      console.log(`✅ 创建教室: ${classroomData.name}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️  教室已存在: ${classroomData.name}`);
      } else {
        console.error(`❌ 创建教室失败 ${classroomData.name}:`, error.message);
      }
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initClassroomTables();
}

module.exports = { initClassroomTables, insertSampleClassrooms };
