const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const CourseSchedule = require('../models/CourseSchedule');
const CourseTimeTemplate = require('../models/CourseTimeTemplate');
const User = require('../models/User');
const { query } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { success, error, paginated } = require('../utils/response');

// 课程管理路由

// 获取所有课程
router.get('/list', async (req, res) => {
  try {
    const { page = 1, limit = 20, department, keyword } = req.query;
    const offset = (page - 1) * limit;
    
    let courses;
    if (keyword) {
      courses = await Course.search(keyword);
    } else if (department) {
      courses = await Course.getByDepartment(department);
    } else {
      courses = await Course.getAll(parseInt(limit), offset);
    }
    
    res.json(success('获取课程列表成功', courses));
  } catch (err) {
    console.error('获取课程列表失败:', err);
    res.status(500).json(error('获取课程列表失败', err.message));
  }
});

// 时间模板管理路由

// 获取所有时间模板
router.get('/time-templates', async (req, res) => {
  try {
    const templates = await CourseTimeTemplate.getAll();
    res.json(success('获取时间模板成功', templates));
  } catch (err) {
    console.error('获取时间模板失败:', err);
    res.status(500).json(error('获取时间模板失败', err.message));
  }
});

// 注意：不要把 '/:id' 放在更具体路由之前，否则会拦截 '/schedules' 等

// 创建新课程 (需要管理员权限)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限 (这里简化处理，实际应该检查用户角色)
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const { courseCode, courseName, credits, courseType, department, description } = req.body;
    
    if (!courseCode || !courseName) {
      return res.status(400).json(error('课程代码和课程名称不能为空'));
    }
    
    // 检查课程代码是否已存在
    const existingCourse = await Course.findByCode(courseCode);
    if (existingCourse) {
      return res.status(400).json(error('课程代码已存在'));
    }
    
    const courseData = {
      courseCode,
      courseName,
      credits: parseFloat(credits) || 0,
      courseType: courseType || '必修',
      department,
      description
    };
    
    const newCourse = await Course.create(courseData);
    res.status(201).json(success('创建课程成功', newCourse));
  } catch (err) {
    console.error('创建课程失败:', err);
    res.status(500).json(error('创建课程失败', err.message));
  }
});

// 更新课程 (需要管理员权限)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const courseId = parseInt(req.params.id);
    const updateData = req.body;
    
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json(error('课程不存在'));
    }
    
    const success = await Course.update(courseId, updateData);
    if (success) {
      const updatedCourse = await Course.findById(courseId);
      res.json(success('更新课程成功', updatedCourse));
    } else {
      res.status(400).json(error('更新课程失败'));
    }
  } catch (err) {
    console.error('更新课程失败:', err);
    res.status(500).json(error('更新课程失败', err.message));
  }
});

// 删除课程 (需要管理员权限)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const courseId = parseInt(req.params.id);
    const success = await Course.delete(courseId);
    
    if (success) {
      res.json(success('删除课程成功'));
    } else {
      res.status(400).json(error('删除课程失败'));
    }
  } catch (err) {
    console.error('删除课程失败:', err);
    res.status(500).json(error('删除课程失败', err.message));
  }
});

// 课程安排管理路由

// 获取学生的课程表
router.get('/schedule/student/:studentId', optionalAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query;
    
    // 如果用户已登录，验证权限
    if (req.user) {
      // 解析当前登录用户的学号（支持旧token无studentId的情况）
      let currentStudentId = req.user.studentId || null;
      if (!currentStudentId && req.user.id) {
        try {
          const dbUser = await User.findById(req.user.id);
          currentStudentId = dbUser ? dbUser.studentId : null;
        } catch (e) {
          console.log('解析studentId失败:', e.message);
        }
      }

      // 添加调试信息
      console.log('权限检查调试信息:');
      console.log('req.user:', req.user);
      console.log('studentId from URL:', studentId);
      console.log('resolved currentStudentId:', currentStudentId);
      console.log('req.user.role:', req.user.role);
      
      // 检查用户是否有权限查看该学生的课程表
      const hasPermission = (currentStudentId && currentStudentId === studentId) || 
                           req.user.role === 'admin';
      
      console.log('hasPermission:', hasPermission);
      
      if (!hasPermission) {
        return res.status(403).json(error('权限不足，只能查看自己的课程表'));
      }
    }
    
    const schedule = await CourseSchedule.getStudentSchedule(studentId, semester);
    res.json(success('获取课程表成功', schedule));
  } catch (err) {
    console.error('获取课程表失败:', err);
    res.status(500).json(error('获取课程表失败', err.message));
  }
});

// 获取指定日期的课程
router.get('/schedule/date/:studentId', optionalAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, semester } = req.query;
    
    if (!date) {
      return res.status(400).json(error('日期参数不能为空'));
    }
    
    // 如果用户已登录，验证权限
    if (req.user) {
      let currentStudentId = req.user.studentId || null;
      if (!currentStudentId && req.user.id) {
        try {
          const dbUser = await User.findById(req.user.id);
          currentStudentId = dbUser ? dbUser.studentId : null;
        } catch {}
      }
      if (((!currentStudentId) || currentStudentId !== studentId) && req.user.role !== 'admin') {
        return res.status(403).json(error('权限不足'));
      }
    }
    
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json(error('日期格式无效'));
    }
    
    const courses = await CourseSchedule.getCoursesByDate(studentId, targetDate, semester);
    res.json(success('获取日期课程成功', courses));
  } catch (err) {
    console.error('获取日期课程失败:', err);
    res.status(500).json(error('获取日期课程失败', err.message));
  }
});

// 获取指定周次的课程
router.get('/schedule/week/:studentId', optionalAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { week, semester } = req.query;
    
    if (!week) {
      return res.status(400).json(error('周次参数不能为空'));
    }
    
    // 如果用户已登录，验证权限
    if (req.user) {
      let currentStudentId = req.user.studentId || null;
      if (!currentStudentId && req.user.id) {
        try {
          const dbUser = await User.findById(req.user.id);
          currentStudentId = dbUser ? dbUser.studentId : null;
        } catch {}
      }
      if (((!currentStudentId) || currentStudentId !== studentId) && req.user.role !== 'admin') {
        return res.status(403).json(error('权限不足'));
      }
    }
    
    const weekNum = parseInt(week);
    if (isNaN(weekNum) || weekNum < 1) {
      return res.status(400).json(error('周次格式无效'));
    }
    
    const courses = await CourseSchedule.getCoursesByWeek(studentId, weekNum, semester);
    res.json(success('获取周次课程成功', courses));
  } catch (err) {
    console.error('获取周次课程失败:', err);
    res.status(500).json(error('获取周次课程失败', err.message));
  }
});

// 创建课程安排 (需要管理员权限)
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const scheduleData = req.body;
    
    // 验证必填字段
    const requiredFields = ['courseId', 'studentId', 'weekday', 'startTime', 'endTime', 'startWeek', 'endWeek', 'semester', 'academicYear'];
    for (const field of requiredFields) {
      if (!scheduleData[field]) {
        return res.status(400).json(error(`${field} 字段不能为空`));
      }
    }
    
    // 检查课程冲突
    const conflicts = await CourseSchedule.getConflicts(
      scheduleData.studentId,
      scheduleData.semester,
      scheduleData.weekday,
      scheduleData.startTime,
      scheduleData.endTime
    );
    
    if (conflicts.length > 0) {
      return res.status(400).json(error('课程时间冲突', {
        conflicts: conflicts.map(c => ({ courseName: c.courseName, startTime: c.startTime, endTime: c.endTime }))
      }));
    }
    
    const newSchedule = await CourseSchedule.create(scheduleData);
    res.status(201).json(success('创建课程安排成功', newSchedule));
  } catch (err) {
    console.error('创建课程安排失败:', err);
    res.status(500).json(error('创建课程安排失败', err.message));
  }
});

// 批量创建课程安排 (需要管理员权限)
router.post('/schedule/batch', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const { schedules } = req.body;
    
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json(error('课程安排数据不能为空'));
    }
    
    // 验证每个安排的数据
    for (const schedule of schedules) {
      const requiredFields = ['courseId', 'studentId', 'weekday', 'startTime', 'endTime', 'startWeek', 'endWeek', 'semester', 'academicYear'];
      for (const field of requiredFields) {
        if (!schedule[field]) {
          return res.status(400).json(error(`安排数据中 ${field} 字段不能为空`));
        }
      }
    }
    
    const count = await CourseSchedule.batchCreate(schedules);
    res.status(201).json(success(`批量创建课程安排成功，共创建 ${count} 条记录`));
  } catch (err) {
    console.error('批量创建课程安排失败:', err);
    res.status(500).json(error('批量创建课程安排失败', err.message));
  }
});

// 更新课程安排 (需要管理员权限)
router.put('/schedule/:id', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const scheduleId = parseInt(req.params.id);
    const updateData = req.body;
    
    const existingSchedule = await CourseSchedule.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json(error('课程安排不存在'));
    }
    
    // 如果更新时间，检查冲突
    if (updateData.startTime || updateData.endTime || updateData.weekday) {
      const conflicts = await CourseSchedule.getConflicts(
        existingSchedule.studentId,
        existingSchedule.semester,
        updateData.weekday || existingSchedule.weekday,
        updateData.startTime || existingSchedule.startTime,
        updateData.endTime || existingSchedule.endTime,
        scheduleId
      );
      
      if (conflicts.length > 0) {
        return res.status(400).json(error('课程时间冲突', {
          conflicts: conflicts.map(c => ({ courseName: c.courseName, startTime: c.startTime, endTime: c.endTime }))
        }));
      }
    }
    
    const success = await CourseSchedule.update(scheduleId, updateData);
    if (success) {
      const updatedSchedule = await CourseSchedule.findById(scheduleId);
      res.json(success('更新课程安排成功', updatedSchedule));
    } else {
      res.status(400).json(error('更新课程安排失败'));
    }
  } catch (err) {
    console.error('更新课程安排失败:', err);
    res.status(500).json(error('更新课程安排失败', err.message));
  }
});

// 删除课程安排 (需要管理员权限)
router.delete('/schedule/:id', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const scheduleId = parseInt(req.params.id);
    const success = await CourseSchedule.delete(scheduleId);
    
    if (success) {
      res.json(success('删除课程安排成功'));
    } else {
      res.status(400).json(error('删除课程安排失败'));
    }
  } catch (err) {
    console.error('删除课程安排失败:', err);
    res.status(500).json(error('删除课程安排失败', err.message));
  }
});

// 获取学生课程统计
router.get('/schedule/stats/:studentId', optionalAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query;
    
    if (!semester) {
      return res.status(400).json(error('学期参数不能为空'));
    }
    
    // 如果用户已登录，验证权限
    if (req.user) {
      let currentStudentId = req.user.studentId || null;
      if (!currentStudentId && req.user.id) {
        try {
          const dbUser = await User.findById(req.user.id);
          currentStudentId = dbUser ? dbUser.studentId : null;
        } catch {}
      }
      if (((!currentStudentId) || currentStudentId !== studentId) && req.user.role !== 'admin') {
        return res.status(403).json(error('权限不足'));
      }
    }
    
    const stats = await CourseSchedule.getStudentStats(studentId, semester);
    res.json(success('获取课程统计成功', stats));
  } catch (err) {
    console.error('获取课程统计失败:', err);
    res.status(500).json(error('获取课程统计失败', err.message));
  }
});

// 更新时间模板 (需要管理员权限)
router.put('/time-templates/:timeSlot', authenticateToken, async (req, res) => {
  try {
    // 检查用户权限
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json(error('权限不足'));
    }
    
    const timeSlot = parseInt(req.params.id);
    const updateData = req.body;
    
    // 验证时间模板
    if (updateData.startTime || updateData.endTime) {
      const isValid = await CourseTimeTemplate.validateTimeTemplate(
        updateData.startTime || '00:00:00',
        updateData.endTime || '23:59:59',
        timeSlot
      );
      
      if (!isValid) {
        return res.status(400).json(error('时间模板冲突'));
      }
    }
    
    const success = await CourseTimeTemplate.update(timeSlot, updateData);
    if (success) {
      const updatedTemplate = await CourseTimeTemplate.findByTimeSlot(timeSlot);
      res.json(success('更新时间模板成功', updatedTemplate));
    } else {
      res.status(400).json(error('更新时间模板失败'));
    }
  } catch (err) {
    console.error('更新时间模板失败:', err);
    res.status(500).json(error('更新时间模板失败', err.message));
  }
});

// 获取所有用户的课程表（管理员视图）
router.get('/schedules', authenticateToken, async (req, res) => {
  try {
    // 检查权限（只有管理员可以查看所有课程表）
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }

    const { page = 1, limit = 10, userId, semester, academicYear, dayOfWeek } = req.query;
    
    // 构建查询条件
    let whereConditions = ['cs.status = ?'];
    let params = ['active'];
    
    if (userId) {
      whereConditions.push('cs.studentId = ?');
      params.push(userId);
    }
    
    if (semester) {
      whereConditions.push('cs.semester = ?');
      params.push(semester);
    }
    
    if (academicYear) {
      whereConditions.push('cs.academicYear = ?');
      params.push(academicYear);
    }
    
    if (dayOfWeek) {
      whereConditions.push('cs.weekday = ?');
      params.push(dayOfWeek);
    }
    
    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;
    
    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE ${whereClause}
    `;
    
    // 查询数据
    const dataSql = `
      SELECT cs.*, c.courseCode, c.courseName, c.credits, c.courseType, c.department
      FROM course_schedules cs
      JOIN courses c ON cs.courseId = c.id
      WHERE ${whereClause}
      ORDER BY cs.studentId, cs.weekday, cs.startTime
      LIMIT ? OFFSET ?
    `;
    
    const [countResult, schedules] = await Promise.all([
      query(countSql, params),
      query(dataSql, [...params, parseInt(limit), offset])
    ]);
    
    const total = countResult[0].total;
    
    // 格式化数据
    const formattedSchedules = schedules.map(row => ({
      id: row.id,
      userId: row.studentId,
      courseId: row.courseId,
      courseCode: row.courseCode,
      courseName: row.courseName,
      teacher: row.teacherName,
      classroom: row.location,
      dayOfWeek: row.weekday,
      startTime: row.startTime,
      endTime: row.endTime,
      semester: row.semester,
      academicYear: row.academicYear,
      createdTime: row.createdTime
    }));
    
    res.json({
      success: true,
      message: '获取课程表成功',
      data: {
        list: formattedSchedules,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
    
  } catch (err) {
    console.error('获取课程表失败:', err);
    res.status(500).json(error('获取课程表失败', err.message));
  }
});

// 获取用户的个人课程表
router.get('/schedule/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { semester, academicYear } = req.query;
    
    // 检查权限（只能查看自己的课程表，或者管理员可以查看所有）
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const schedules = await CourseSchedule.getStudentSchedule(userId, semester);
    
    // 格式化数据
    const formattedSchedules = schedules.map(row => ({
      id: row.id,
      userId: row.studentId,
      courseId: row.courseId,
      courseCode: row.course.courseCode,
      courseName: row.course.courseName,
      teacher: row.teacherName,
      classroom: row.location,
      dayOfWeek: row.weekday,
      startTime: row.startTime,
      endTime: row.endTime,
      semester: row.semester,
      academicYear: row.academicYear,
      createdTime: row.createdTime
    }));
    
    res.json({
      success: true,
      message: '获取个人课程表成功',
      data: formattedSchedules
    });
    
  } catch (err) {
    console.error('获取个人课程表失败:', err);
    res.status(500).json(error('获取个人课程表失败', err.message));
  }
});

// 添加到课程表
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    // 检查权限（只有管理员可以添加课程表）
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const { userId, courseId, teacher, classroom, dayOfWeek, startTime, endTime, semester, academicYear } = req.body;
    
    // 验证必填字段
    if (!userId || !courseId || !teacher || !classroom || !dayOfWeek || !startTime || !endTime || !semester || !academicYear) {
      return res.status(400).json(error('所有字段都是必填的', 400));
    }
    
    // 创建课程表项
    const scheduleData = {
      courseId: parseInt(courseId),
      studentId: userId,
      teacherName: teacher,
      location: classroom,
      weekday: parseInt(dayOfWeek),
      startTime: startTime,
      endTime: endTime,
      startWeek: 1,
      endWeek: 20,
      semester: semester,
      academicYear: academicYear,
      status: 'active'
    };
    
    const newSchedule = await CourseSchedule.create(scheduleData);
    
    // 获取课程信息
    const course = await Course.findById(courseId);
    
    const formattedSchedule = {
      id: newSchedule.id,
      userId: newSchedule.studentId,
      courseId: newSchedule.courseId,
      courseCode: course.courseCode,
      courseName: course.courseName,
      teacher: newSchedule.teacherName,
      classroom: newSchedule.location,
      dayOfWeek: newSchedule.weekday,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      semester: newSchedule.semester,
      academicYear: newSchedule.academicYear,
      createdTime: newSchedule.createdTime
    };
    
    res.json({
      success: true,
      message: '添加到课程表成功',
      data: formattedSchedule
    });
    
  } catch (err) {
    console.error('添加到课程表失败:', err);
    res.status(500).json(error('添加到课程表失败', err.message));
  }
});

// 更新课程表项
router.put('/schedule/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限（只有管理员可以更新课程表）
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const scheduleId = parseInt(req.params.id);
    const updateData = req.body;
    
    // 更新课程表项
    const updatedSchedule = await CourseSchedule.update(scheduleId, updateData);
    
    if (!updatedSchedule) {
      return res.status(404).json(error('课程表项不存在', 404));
    }
    
    // 获取课程信息
    const course = await Course.findById(updatedSchedule.courseId);
    
    const formattedSchedule = {
      id: updatedSchedule.id,
      userId: updatedSchedule.studentId,
      courseId: updatedSchedule.courseId,
      courseCode: course.courseCode,
      courseName: course.courseName,
      teacher: updatedSchedule.teacherName,
      classroom: updatedSchedule.location,
      dayOfWeek: updatedSchedule.weekday,
      startTime: updatedSchedule.startTime,
      endTime: updatedSchedule.endTime,
      semester: updatedSchedule.semester,
      academicYear: updatedSchedule.academicYear,
      createdTime: updatedSchedule.createdTime
    };
    
    res.json({
      success: true,
      message: '更新课程表成功',
      data: formattedSchedule
    });
    
  } catch (err) {
    console.error('更新课程表失败:', err);
    res.status(500).json(error('更新课程表失败', err.message));
  }
});

// 从课程表删除课程
router.delete('/schedule/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限（只有管理员可以删除课程表）
    if (req.user.role !== 'admin') {
      return res.status(403).json(error('权限不足', 403));
    }
    
    const scheduleId = parseInt(req.params.id);
    
    // 删除课程表项
    const deleted = await CourseSchedule.delete(scheduleId);
    
    if (!deleted) {
      return res.status(404).json(error('课程表项不存在', 404));
    }
    
    res.json({
      success: true,
      message: '删除课程表成功',
      data: null
    });
    
  } catch (err) {
    console.error('删除课程表失败:', err);
    res.status(500).json(error('删除课程表失败', err.message));
  }
});

module.exports = router;
