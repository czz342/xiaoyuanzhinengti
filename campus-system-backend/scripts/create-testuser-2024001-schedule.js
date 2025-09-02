const Course = require('../models/Course');
const CourseSchedule = require('../models/CourseSchedule');
const { testConnection } = require('../config/database');

async function ensureCourse(courseData) {
  const existing = await Course.findByCode(courseData.courseCode);
  if (existing) return existing;
  return await Course.create(courseData);
}

async function createScheduleIfNotExists(studentId, scheduleData) {
  // 幂等：避免同学号、同学期、同weekday、同起止时间的重复
  const existing = await CourseSchedule.getStudentSchedule(studentId, scheduleData.semester);
  const conflict = existing.find(
    (c) => String(c.weekday) === String(scheduleData.weekday)
      && String(c.startTime).slice(0,5) === String(scheduleData.startTime).slice(0,5)
      && String(c.endTime).slice(0,5) === String(scheduleData.endTime).slice(0,5)
  );
  if (conflict) {
    return { created: false, reason: 'duplicate' };
  }
  await CourseSchedule.create(scheduleData);
  return { created: true };
}

async function main() {
  try {
    console.log('开始为 studentId=2024001 生成14节课程表...');
    await testConnection();
    console.log('数据库连接正常');

    // 1) 确保课程存在
    const courseSeeds = [
      { courseCode: 'CS201', courseName: '数据结构', credits: 4.0, courseType: '必修', department: '计算机学院' },
      { courseCode: 'CS202', courseName: '操作系统', credits: 4.0, courseType: '必修', department: '计算机学院' },
      { courseCode: 'CS203', courseName: '计算机网络', credits: 3.5, courseType: '必修', department: '计算机学院' },
      { courseCode: 'CS204', courseName: '数据库系统', credits: 3.0, courseType: '必修', department: '计算机学院' },
      { courseCode: 'MATH201', courseName: '线性代数', credits: 3.0, courseType: '必修', department: '数学学院' },
      { courseCode: 'MATH101', courseName: '高等数学', credits: 4.0, courseType: '必修', department: '数学学院' },
      { courseCode: 'ENG101', courseName: '大学英语', credits: 2.0, courseType: '公共课', department: '外国语学院' },
      { courseCode: 'PE101', courseName: '体育', credits: 1.0, courseType: '公共课', department: '体育部' }
    ];

    const courses = [];
    for (const seed of courseSeeds) {
      const c = await ensureCourse(seed);
      courses.push(c);
    }

    // 2) 生成14节分布（周一至周五，避免重叠），同一课程可多次上
    const studentId = '2024001';
    const semester = '2024-2025-1';
    const academicYear = '2024-2025';

    // 预设14个时段（与前端时间轴匹配，均不重叠）
    const slots = [
      { weekday: 1, start: '08:00:00', end: '09:40:00', course: 'CS201', teacher: '李老师', location: 'A201' },
      { weekday: 1, start: '10:00:00', end: '11:40:00', course: 'CS203', teacher: '王老师', location: 'B101' },
      { weekday: 1, start: '14:00:00', end: '15:40:00', course: 'ENG101', teacher: '刘老师', location: 'D101' },

      { weekday: 2, start: '08:00:00', end: '09:40:00', course: 'CS202', teacher: '张老师', location: 'A301' },
      { weekday: 2, start: '10:00:00', end: '11:40:00', course: 'MATH201', teacher: '陈老师', location: 'C201' },
      { weekday: 2, start: '16:00:00', end: '17:40:00', course: 'PE101', teacher: '黄老师', location: '体育馆' },

      { weekday: 3, start: '08:00:00', end: '09:40:00', course: 'CS201', teacher: '李老师', location: 'A202' },
      { weekday: 3, start: '14:00:00', end: '15:40:00', course: 'CS204', teacher: '周老师', location: 'C301' },
      { weekday: 3, start: '19:00:00', end: '20:40:00', course: 'CS203', teacher: '王老师', location: 'B102' },

      { weekday: 4, start: '08:00:00', end: '09:40:00', course: 'CS202', teacher: '张老师', location: 'A302' },
      { weekday: 4, start: '10:00:00', end: '11:40:00', course: 'MATH101', teacher: '徐老师', location: 'C101' },
      { weekday: 4, start: '14:00:00', end: '15:40:00', course: 'CS204', teacher: '周老师', location: 'C302' },

      { weekday: 5, start: '10:00:00', end: '11:40:00', course: 'MATH201', teacher: '陈老师', location: 'C202' },
      { weekday: 5, start: '16:00:00', end: '17:40:00', course: 'CS203', teacher: '王老师', location: 'B201' }
    ];

    // 课程代码到课程ID映射
    const codeToId = Object.fromEntries(courses.map((c) => [c.courseCode, c.id]));

    let createdCount = 0;
    for (const s of slots) {
      const schedule = {
        courseId: codeToId[s.course],
        studentId,
        teacherName: s.teacher,
        location: `教学楼${s.location}`,
        weekday: s.weekday,
        startTime: s.start,
        endTime: s.end,
        startWeek: 1,
        endWeek: 16,
        semester,
        academicYear
      };
      const res = await createScheduleIfNotExists(studentId, schedule);
      if (res.created) createdCount += 1;
    }

    console.log(`🎉 完成：为 ${studentId} 共生成/保留 14 节课程，其中新增 ${createdCount} 条。`);
  } catch (err) {
    console.error('❌ 生成课程表失败:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;


