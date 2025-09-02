const Course = require('../models/Course');
const CourseSchedule = require('../models/CourseSchedule');
const CourseTimeTemplate = require('../models/CourseTimeTemplate');
const { testConnection } = require('../config/database');

async function createTestUserSchedule() {
  try {
    console.log('开始为testuser创建测试课程表...');
    await testConnection();
    console.log('数据库连接正常');

    // 创建测试课程（如果不存在）
    const testCourses = [
      {
        courseCode: 'CS201',
        courseName: '数据结构与算法',
        credits: 4.0,
        courseType: '必修',
        department: '计算机科学与技术学院',
        description: '学习基本数据结构和算法设计'
      },
      {
        courseCode: 'CS202',
        courseName: '计算机网络',
        credits: 3.5,
        courseType: '必修',
        department: '计算机科学与技术学院',
        description: '计算机网络基础理论和实践'
      },
      {
        courseCode: 'CS203',
        courseName: '操作系统',
        credits: 4.0,
        courseType: '必修',
        department: '计算机科学与技术学院',
        description: '操作系统原理和设计'
      },
      {
        courseCode: 'MATH201',
        courseName: '线性代数',
        credits: 3.0,
        courseType: '必修',
        department: '数学学院',
        description: '线性代数基础理论'
      },
      {
        courseCode: 'ENG201',
        courseName: '大学英语',
        credits: 2.0,
        courseType: '公共课',
        department: '外国语学院',
        description: '大学英语基础课程'
      }
    ];

    console.log('创建测试课程...');
    for (const courseData of testCourses) {
      try {
        const existingCourse = await Course.findByCode(courseData.courseCode);
        if (!existingCourse) {
          await Course.create(courseData);
          console.log(`✅ 课程 ${courseData.courseName} 创建成功`);
        } else {
          console.log(`⚠️ 课程 ${courseData.courseName} 已存在`);
        }
      } catch (error) {
        console.error(`❌ 创建课程 ${courseData.courseName} 失败:`, error.message);
      }
    }

    // 获取所有课程ID
    const allCourses = await Course.getAll();
    console.log(`获取到 ${allCourses.length} 门课程`);

    // 为testuser创建课程表
    const testUserSchedules = [
      // 周一
      {
        courseId: allCourses[0].id, // 数据结构与算法
        studentId: 'testuser',
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
      {
        courseId: allCourses[1].id, // 计算机网络
        studentId: 'testuser',
        teacherName: '王教授',
        location: '教学楼B101',
        weekday: 1,
        startTime: '10:00:00',
        endTime: '11:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周二
      {
        courseId: allCourses[2].id, // 操作系统
        studentId: 'testuser',
        teacherName: '张教授',
        location: '教学楼A301',
        weekday: 2,
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: allCourses[3].id, // 线性代数
        studentId: 'testuser',
        teacherName: '陈教授',
        location: '教学楼C201',
        weekday: 2,
        startTime: '14:00:00',
        endTime: '15:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周三
      {
        courseId: allCourses[0].id, // 数据结构与算法（实验）
        studentId: 'testuser',
        teacherName: '李教授',
        location: '实验楼A101',
        weekday: 3,
        startTime: '08:00:00',
        endTime: '11:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周四
      {
        courseId: allCourses[2].id, // 操作系统（实验）
        studentId: 'testuser',
        teacherName: '张教授',
        location: '实验楼B201',
        weekday: 4,
        startTime: '14:00:00',
        endTime: '17:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      // 周五
      {
        courseId: allCourses[4].id, // 大学英语
        studentId: 'testuser',
        teacherName: '刘老师',
        location: '教学楼D101',
        weekday: 5,
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: allCourses[1].id, // 计算机网络（实验）
        studentId: 'testuser',
        teacherName: '王教授',
        location: '实验楼C101',
        weekday: 5,
        startTime: '14:00:00',
        endTime: '17:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      }
    ];

    console.log('创建testuser的课程表...');
    for (const scheduleData of testUserSchedules) {
      try {
        await CourseSchedule.create(scheduleData);
        console.log(`✅ 课程安排创建成功: ${scheduleData.weekday} ${scheduleData.startTime}-${scheduleData.endTime}`);
      } catch (error) {
        console.error(`❌ 创建课程安排失败:`, error.message);
      }
    }

    console.log('🎉 testuser课程表创建完成！');
    console.log('📚 课程表包含:');
    console.log('   - 周一: 数据结构与算法、计算机网络');
    console.log('   - 周二: 操作系统、线性代数');
    console.log('   - 周三: 数据结构与算法实验');
    console.log('   - 周四: 操作系统实验');
    console.log('   - 周五: 大学英语、计算机网络实验');

  } catch (err) {
    console.error('❌ 创建testuser课程表失败:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  createTestUserSchedule();
}

module.exports = createTestUserSchedule;
