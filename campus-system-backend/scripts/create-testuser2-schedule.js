const Course = require('../models/Course');
const CourseSchedule = require('../models/CourseSchedule');
const { testConnection } = require('../config/database');

async function createTestUser2Schedule() {
  try {
    console.log('开始为testuser2创建测试课程表...');
    await testConnection();
    console.log('数据库连接正常');

    // 获取现有课程
    const allCourses = await Course.getAll();
    console.log(`获取到 ${allCourses.length} 门课程`);

    // 为testuser2创建课程表
    const testUser2Schedules = [
      // 周一
      {
        courseId: allCourses[0].id, // 数据结构与算法
        studentId: 'testuser2',
        teacherName: '李教授',
        location: '教学楼A201',
        weekday: 1,
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周二
      {
        courseId: allCourses[1].id, // 计算机网络
        studentId: 'testuser2',
        teacherName: '王教授',
        location: '教学楼B101',
        weekday: 2,
        startTime: '10:00:00',
        endTime: '11:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周三
      {
        courseId: allCourses[2].id, // 操作系统
        studentId: 'testuser2',
        teacherName: '张教授',
        location: '教学楼A301',
        weekday: 3,
        startTime: '14:00:00',
        endTime: '15:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周四
      {
        courseId: allCourses[3].id, // 线性代数
        studentId: 'testuser2',
        teacherName: '陈教授',
        location: '教学楼C201',
        weekday: 4,
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周五
      {
        courseId: allCourses[4].id, // 大学英语
        studentId: 'testuser2',
        teacherName: '刘老师',
        location: '教学楼D101',
        weekday: 5,
        startTime: '14:00:00',
        endTime: '15:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      }
    ];

    console.log('创建testuser2的课程表...');
    for (const scheduleData of testUser2Schedules) {
      try {
        await CourseSchedule.create(scheduleData);
        console.log(`✅ 课程安排创建成功: ${scheduleData.weekday} ${scheduleData.startTime}-${scheduleData.endTime}`);
      } catch (error) {
        console.error(`❌ 创建课程安排失败:`, error.message);
      }
    }

    console.log('🎉 testuser2课程表创建完成！');
    console.log('📚 课程表包含:');
    console.log('   - 周一: 数据结构与算法');
    console.log('   - 周二: 计算机网络');
    console.log('   - 周三: 操作系统');
    console.log('   - 周四: 线性代数');
    console.log('   - 周五: 大学英语');

  } catch (err) {
    console.error('❌ 创建testuser2课程表失败:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  createTestUser2Schedule();
}

module.exports = createTestUser2Schedule;
