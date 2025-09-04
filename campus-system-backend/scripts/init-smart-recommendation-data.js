const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');
const Canteen = require('../models/Canteen');
const CourseSchedule = require('../models/CourseSchedule');
const Course = require('../models/Course');
const { query } = require('../config/database');

async function initSmartRecommendationData() {
    try {
        console.log('开始初始化智能推荐数据...');
        
        // 1. 初始化自习室数据
        console.log('初始化自习室数据...');
        await StudyRoom.createTable();
        
        const studyRooms = [
            {
                number: 'LIB-3F',
                name: '中央图书馆 3F',
                location: '图书馆3楼',
                open_time: '08:00:00',
                close_time: '22:00:00',
                total_seats: 105,
                status: 'active'
            },
            {
                number: 'SCI-101',
                name: '理科楼 自习室',
                location: '理科楼101',
                open_time: '07:00:00',
                close_time: '23:00:00',
                total_seats: 100,
                status: 'active'
            },
            {
                number: 'ENG-201',
                name: '工科楼 自习室',
                location: '工科楼201',
                open_time: '07:00:00',
                close_time: '23:00:00',
                total_seats: 80,
                status: 'active'
            }
        ];
        
        for (const room of studyRooms) {
            await StudyRoom.insert(room);
        }
        
        // 2. 初始化自习室座位数据
        console.log('初始化自习室座位数据...');
        await StudySeat.createTable();
        
        for (const room of studyRooms) {
            const roomInfo = await StudyRoom.findByNumber(room.number);
            if (roomInfo) {
                for (let i = 1; i <= room.total_seats; i++) {
                    await StudySeat.insert({
                        room_id: roomInfo.id,
                        seat_number: `${room.number}-${String(i).padStart(3, '0')}`,
                        status: 'available'
                    });
                }
            }
        }
        
        // 3. 初始化食堂数据
        console.log('初始化食堂数据...');
        await Canteen.createTable();
        
        const canteens = [
            {
                number: 'CANTEEN-001',
                name: '第一食堂',
                location: '学生生活区A栋',
                description: '提供早餐、午餐、晚餐服务',
                open_time: '06:00:00',
                close_time: '22:00:00',
                status: 'open',
                phone: '010-12345678'
            },
            {
                number: 'CANTEEN-002',
                name: '第二食堂',
                location: '学生生活区B栋',
                description: '特色餐厅，提供多样化菜品',
                open_time: '06:30:00',
                close_time: '21:30:00',
                status: 'open',
                phone: '010-12345679'
            },
            {
                number: 'CANTEEN-003',
                name: '教工食堂',
                location: '教师办公区',
                description: '教工专用食堂',
                open_time: '07:00:00',
                close_time: '20:00:00',
                status: 'open',
                phone: '010-12345680'
            }
        ];
        
        for (const canteen of canteens) {
            await Canteen.insert(canteen);
        }
        
        // 4. 初始化课程数据
        console.log('初始化课程数据...');
        await Course.createTable();
        
        const courses = [
            {
                courseCode: 'MATH101',
                courseName: '高等数学（II）',
                credits: 4,
                courseType: '必修',
                department: '数学系',
                description: '高等数学进阶课程'
            },
            {
                courseCode: 'PHYS101',
                courseName: '大学物理',
                credits: 3,
                courseType: '必修',
                department: '物理系',
                description: '大学物理基础课程'
            }
        ];
        
        for (const course of courses) {
            await Course.create(course);
        }
        
        // 5. 初始化课程安排数据
        console.log('初始化课程安排数据...');
        await CourseSchedule.createTable();
        
        const courseSchedules = [
            {
                courseId: 1, // 高等数学
                studentId: '2024001', // 测试学生ID
                teacherName: '张教授',
                location: '理科楼 A306',
                weekday: 1, // 周一
                startTime: '08:00:00',
                endTime: '09:40:00',
                startWeek: 1,
                endWeek: 16,
                semester: '2024-2025-1',
                academicYear: '2024-2025'
            },
            {
                courseId: 2, // 大学物理
                studentId: '2024001', // 测试学生ID
                teacherName: '李教授',
                location: '理科楼 B201',
                weekday: 2, // 周二
                startTime: '10:00:00',
                endTime: '11:40:00',
                startWeek: 1,
                endWeek: 16,
                semester: '2024-2025-1',
                academicYear: '2024-2025'
            }
        ];
        
        for (const schedule of courseSchedules) {
            await CourseSchedule.create(schedule);
        }
        
        console.log('智能推荐数据初始化完成！');
        
    } catch (error) {
        console.error('初始化智能推荐数据失败:', error);
        throw error;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    initSmartRecommendationData()
        .then(() => {
            console.log('✅ 智能推荐数据初始化成功');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ 智能推荐数据初始化失败:', error);
            process.exit(1);
        });
}

module.exports = { initSmartRecommendationData };
