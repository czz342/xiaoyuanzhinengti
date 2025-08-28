const Course = require('../models/Course');
const CourseSchedule = require('../models/CourseSchedule');
const CourseTimeTemplate = require('../models/CourseTimeTemplate');
const { testConnection } = require('../config/database');

async function initCourseTables() {
  try {
    console.log('开始初始化课程相关表...');
    
    // 测试数据库连接
    await testConnection();
    console.log('数据库连接正常');
    
    // 创建课程表
    console.log('创建课程表...');
    await Course.createTable();
    
    // 创建课程安排表
    console.log('创建课程安排表...');
    await CourseSchedule.createTable();
    
    // 创建时间模板表
    console.log('创建时间模板表...');
    await CourseTimeTemplate.createTable();
    
    // 初始化默认时间模板
    console.log('初始化默认时间模板...');
    await CourseTimeTemplate.initializeDefaultTemplates();
    
    // 创建示例课程数据
    console.log('创建示例课程数据...');
    const sampleCourses = [
      {
        courseCode: 'CS101',
        courseName: '计算机科学导论',
        credits: 3.0,
        courseType: '必修',
        department: '计算机科学与技术学院',
        description: '计算机科学基础课程，介绍计算机科学的基本概念和原理'
      },
      {
        courseCode: 'MATH101',
        courseName: '高等数学',
        credits: 4.0,
        courseType: '必修',
        department: '数学学院',
        description: '大学数学基础课程，包括微积分、线性代数等'
      },
      {
        courseCode: 'ENG101',
        courseName: '大学英语',
        credits: 2.0,
        courseType: '必修',
        department: '外国语学院',
        description: '大学英语基础课程，提高英语听说读写能力'
      },
      {
        courseCode: 'PHY101',
        courseName: '大学物理',
        credits: 3.5,
        courseType: '必修',
        department: '物理学院',
        description: '大学物理基础课程，包括力学、电磁学等'
      },
      {
        courseCode: 'CS201',
        courseName: '数据结构与算法',
        credits: 4.0,
        courseType: '必修',
        department: '计算机科学与技术学院',
        description: '计算机科学核心课程，学习数据结构和算法设计'
      }
    ];
    
    for (const courseData of sampleCourses) {
      try {
        await Course.create(courseData);
        console.log(`创建课程: ${courseData.courseName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`课程 ${courseData.courseName} 已存在，跳过`);
        } else {
          console.error(`创建课程 ${courseData.courseName} 失败:`, err.message);
        }
      }
    }
    
    // 创建示例课程安排
    console.log('创建示例课程安排...');
    const sampleSchedules = [
      {
        courseId: 1, // 计算机科学导论
        studentId: '645730151', // 使用你的学号
        teacherName: '张教授',
        location: '教学楼A101',
        weekday: 1, // 周一
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 1, // 计算机科学导论
        studentId: '645730151',
        teacherName: '张教授',
        location: '教学楼A101',
        weekday: 3, // 周三
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 2, // 高等数学
        studentId: '645730151',
        teacherName: '李教授',
        location: '教学楼B201',
        weekday: 1, // 周一
        startTime: '10:00:00',
        endTime: '11:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 2, // 高等数学
        studentId: '645730151',
        teacherName: '李教授',
        location: '教学楼B201',
        weekday: 3, // 周三
        startTime: '10:00:00',
        endTime: '11:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 3, // 大学英语
        studentId: '645730151',
        teacherName: '王教授',
        location: '教学楼C301',
        weekday: 2, // 周二
        startTime: '14:00:00',
        endTime: '15:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 4, // 大学物理
        studentId: '645730151',
        teacherName: '陈教授',
        location: '教学楼D401',
        weekday: 4, // 周四
        startTime: '14:00:00',
        endTime: '15:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      },
      {
        courseId: 5, // 数据结构与算法
        studentId: '645730151',
        teacherName: '刘教授',
        location: '教学楼A101',
        weekday: 5, // 周五
        startTime: '08:00:00',
        endTime: '09:40:00',
        startWeek: 1,
        endWeek: 16,
        semester: '2024-2025-1',
        academicYear: '2024-2025'
      }
    ];
    
    for (const scheduleData of sampleSchedules) {
      try {
        await CourseSchedule.create(scheduleData);
        console.log(`创建课程安排: ${scheduleData.courseId} - ${scheduleData.weekday} ${scheduleData.startTime}`);
      } catch (err) {
        console.error(`创建课程安排失败:`, err.message);
      }
    }
    
    console.log('课程相关表初始化完成！');
    console.log('\n可用的API接口:');
    console.log('- GET /api/course/list - 获取课程列表');
    console.log('- GET /api/course/1 - 获取课程详情');
    console.log('- GET /api/course/schedule/student/645730151 - 获取学生课程表');
    console.log('- GET /api/course/schedule/date/645730151?date=2024-09-16 - 获取指定日期课程');
    console.log('- GET /api/course/schedule/week/645730151?week=1 - 获取指定周次课程');
    console.log('- GET /api/course/time-templates - 获取时间模板');
    
  } catch (err) {
    console.error('初始化课程表失败:', err);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initCourseTables();
}

module.exports = initCourseTables;
