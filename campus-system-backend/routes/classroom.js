const express = require('express');
const Classroom = require('../models/Classroom');
const ClassroomReservation = require('../models/ClassroomReservation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { success, error, paginated, list } = require('../utils/response');

const router = express.Router();

// 获取所有教室列表
router.get('/list', async (req, res) => {
  try {
    const { building, floor, equipment } = req.query;
    let classrooms;

    if (building && floor) {
      classrooms = await Classroom.getByBuildingAndFloor(building, floor);
    } else if (equipment) {
      const equipmentList = equipment.split(',').map(e => e.trim());
      classrooms = await Classroom.getByEquipment(equipmentList);
    } else {
      classrooms = await Classroom.getAll();
    }

    res.json(success('获取教室列表成功', classrooms));
  } catch (err) {
    console.error('获取教室列表错误:', err);
    res.status(500).json(error('获取教室列表失败', 500));
  }
});

// 获取所有教学楼
router.get('/buildings', async (req, res) => {
  try {
    const buildings = await Classroom.getBuildings();
    res.json(success('获取教学楼列表成功', buildings));
  } catch (err) {
    console.error('获取教学楼列表错误:', err);
    res.status(500).json(error('获取教学楼列表失败', 500));
  }
});

// 获取指定教学楼的所有楼层
router.get('/floors/:building', async (req, res) => {
  try {
    const { building } = req.params;
    const floors = await Classroom.getFloors(building);
    res.json(success('获取楼层列表成功', floors));
  } catch (err) {
    console.error('获取楼层列表错误:', err);
    res.status(500).json(error('获取楼层列表失败', 500));
  }
});

// 获取指定教室详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id);
    
    if (!classroom) {
      return res.status(404).json(error('教室不存在', 404));
    }

    res.json(success('获取教室详情成功', classroom));
  } catch (err) {
    console.error('获取教室详情错误:', err);
    res.status(500).json(error('获取教室详情失败', 500));
  }
});

// 创建教室（管理员功能）
router.post('/', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }

    const classroomData = req.body;
    const classroomId = await Classroom.create(classroomData);
    const classroom = await Classroom.findById(classroomId);

    res.json(success('教室创建成功', classroom));
  } catch (err) {
    console.error('创建教室错误:', err);
    res.status(500).json(error('创建教室失败', 500));
  }
});

// 更新教室信息（管理员功能）
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }

    const { id } = req.params;
    const updateData = req.body;
    
    const updated = await Classroom.update(id, updateData);
    if (!updated) {
      return res.status(404).json(error('教室不存在', 404));
    }

    const classroom = await Classroom.findById(id);
    res.json(success('教室信息更新成功', classroom));
  } catch (err) {
    console.error('更新教室错误:', err);
    res.status(500).json(error('更新教室失败', 500));
  }
});

// 删除教室（管理员功能）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }

    const { id } = req.params;
    const deleted = await Classroom.delete(id);
    
    if (!deleted) {
      return res.status(404).json(error('教室不存在', 404));
    }

    res.json(success('教室删除成功'));
  } catch (err) {
    console.error('删除教室错误:', err);
    res.status(500).json(error('删除教室失败', 500));
  }
});

// 预约相关路由
// 创建预约
router.post('/reservations', authenticateToken, async (req, res) => {
  try {
    const {
      classroomId,
      reservationDate,
      startTime,
      endTime,
      purpose = '',
      notes = ''
    } = req.body;

    // 验证必填字段
    if (!classroomId || !reservationDate || !startTime || !endTime) {
      return res.status(400).json(error('缺少必要参数', 400));
    }

    // 检查教室是否存在
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json(error('教室不存在', 404));
    }

    // 检查教室状态
    if (classroom.status !== 'available') {
      return res.status(400).json(error('教室不可用', 400));
    }

    // 检查时间冲突
    const hasConflict = await ClassroomReservation.checkTimeConflict(
      classroomId, reservationDate, startTime, endTime
    );
    if (hasConflict) {
      return res.status(400).json(error('该时间段已被预约', 400));
    }

    // 创建预约
    const reservationNumber = ClassroomReservation.generateReservationNumber();
    const reservationData = {
      reservationNumber,
      userId: req.user.id,
      classroomId,
      reservationDate,
      startTime,
      endTime,
      purpose,
      notes,
      status: 'confirmed' // 直接设置为确认状态
    };

    const reservationId = await ClassroomReservation.create(reservationData);
    const reservation = await ClassroomReservation.findById(reservationId);

    res.json(success('预约创建成功', reservation));
  } catch (err) {
    console.error('创建预约错误:', err);
    res.status(500).json(error('创建预约失败', 500));
  }
});

// 获取用户的预约列表
router.get('/reservations/my', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const reservations = await ClassroomReservation.getByUserId(req.user.id, date);
    res.json(success('获取预约列表成功', reservations));
  } catch (err) {
    console.error('获取预约列表错误:', err);
    res.status(500).json(error('获取预约列表失败', 500));
  }
});

// 获取指定日期的所有预约
router.get('/reservations/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const reservations = await ClassroomReservation.getByDate(date);
    res.json(success('获取日期预约成功', reservations));
  } catch (err) {
    console.error('获取日期预约错误:', err);
    res.status(500).json(error('获取日期预约失败', 500));
  }
});

// 获取指定教室的预约
router.get('/reservations/classroom/:classroomId', async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { date } = req.query;
    const reservations = await ClassroomReservation.getByClassroomId(classroomId, date);
    res.json(success('获取教室预约成功', reservations));
  } catch (err) {
    console.error('获取教室预约错误:', err);
    res.status(500).json(error('获取教室预约失败', 500));
  }
});

// 获取预约详情
router.get('/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await ClassroomReservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json(error('预约不存在', 404));
    }

    // 检查权限：只能查看自己的预约或管理员可以查看所有
    if (req.user.role !== 'admin' && reservation.userId !== req.user.id) {
      return res.status(403).json(error('权限不足', 403));
    }

    res.json(success('获取预约详情成功', reservation));
  } catch (err) {
    console.error('获取预约详情错误:', err);
    res.status(500).json(error('获取预约详情失败', 500));
  }
});

// 根据预约编号获取预约详情
router.get('/reservations/number/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const reservation = await ClassroomReservation.findByNumber(number);
    
    if (!reservation) {
      return res.status(404).json(error('预约不存在', 404));
    }

    res.json(success('获取预约详情成功', reservation));
  } catch (err) {
    console.error('获取预约详情错误:', err);
    res.status(500).json(error('获取预约详情失败', 500));
  }
});

// 取消预约
router.put('/reservations/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await ClassroomReservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json(error('预约不存在', 404));
    }

    // 检查权限：只能取消自己的预约
    if (reservation.userId !== req.user.id) {
      return res.status(403).json(error('权限不足', 403));
    }

    // 检查预约状态
    if (reservation.status === 'cancelled') {
      return res.status(400).json(error('预约已取消', 400));
    }

    if (reservation.status === 'completed') {
      return res.status(400).json(error('预约已完成，无法取消', 400));
    }

    const cancelled = await ClassroomReservation.cancel(id, req.user.id);
    if (!cancelled) {
      return res.status(500).json(error('取消预约失败', 500));
    }

    const updatedReservation = await ClassroomReservation.findById(id);
    res.json(success('预约取消成功', updatedReservation));
  } catch (err) {
    console.error('取消预约错误:', err);
    res.status(500).json(error('取消预约失败', 500));
  }
});

// 更新预约信息
router.put('/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const reservation = await ClassroomReservation.findById(id);
    if (!reservation) {
      return res.status(404).json(error('预约不存在', 404));
    }

    // 检查权限：只能更新自己的预约
    if (reservation.userId !== req.user.id) {
      return res.status(403).json(error('权限不足', 403));
    }

    // 检查预约状态
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json(error('预约状态不允许修改', 400));
    }

    // 如果修改了时间，需要检查冲突
    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime || reservation.startTime;
      const endTime = updateData.endTime || reservation.endTime;
      
      const hasConflict = await ClassroomReservation.checkTimeConflict(
        reservation.classroomId, 
        reservation.reservationDate, 
        startTime, 
        endTime, 
        id
      );
      
      if (hasConflict) {
        return res.status(400).json(error('该时间段已被预约', 400));
      }
    }

    const updated = await ClassroomReservation.update(id, updateData);
    if (!updated) {
      return res.status(500).json(error('更新预约失败', 500));
    }

    const updatedReservation = await ClassroomReservation.findById(id);
    res.json(success('预约更新成功', updatedReservation));
  } catch (err) {
    console.error('更新预约错误:', err);
    res.status(500).json(error('更新预约失败', 500));
  }
});

// 获取预约统计
router.get('/reservations/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await ClassroomReservation.getStats(req.user.id);
    res.json(success('获取预约统计成功', stats));
  } catch (err) {
    console.error('获取预约统计错误:', err);
    res.status(500).json(error('获取预约统计失败', 500));
  }
});

// 获取即将到期的预约
router.get('/reservations/upcoming', authenticateToken, async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const reservations = await ClassroomReservation.getUpcomingReservations(req.user.id, parseInt(hours));
    res.json(success('获取即将到期预约成功', reservations));
  } catch (err) {
    console.error('获取即将到期预约错误:', err);
    res.status(500).json(error('获取即将到期预约失败', 500));
  }
});

module.exports = router;
