const express = require('express');
const router = express.Router();
const CourseSchedule = require('../models/CourseSchedule');
const Canteen = require('../models/Canteen');
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');
const StudySeatBooking = require('../models/StudySeatBooking');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 获取即将上课信息
router.get('/upcoming-class', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.studentId || req.user.userId || String(req.user.id || '');
        const now = new Date();
        const currentWeekday = now.getDay() || 7; // 转换为1-7
        const currentTime = now.toTimeString().slice(0, 8);
        
        // 获取今天的课程安排
        const todaySchedule = await CourseSchedule.getStudentSchedule(userId, '2024-2025-1');
        
        // 过滤出今天的课程并按时间排序
        const todayClasses = todaySchedule
            .filter(schedule => schedule.weekday === currentWeekday)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        // 找到下一节课
        let nextClass = null;
        let timeUntilClass = 0;
        
        for (const classInfo of todayClasses) {
            if (classInfo.startTime > currentTime) {
                const [hours, minutes] = classInfo.startTime.split(':');
                const classTime = new Date();
                classTime.setHours(parseInt(hours), parseInt(minutes), 0);
                
                timeUntilClass = Math.floor((classTime - now) / (1000 * 60)); // 转换为分钟
                nextClass = {
                    name: classInfo.course?.courseName || '未知课程',
                    location: classInfo.location || '未知地点',
                    teacher: classInfo.teacherName || '未知教师',
                    startTime: classInfo.startTime,
                    endTime: classInfo.endTime
                };
                break;
            }
        }
        
        if (!nextClass) {
            return res.json(success('ok', {
                hasUpcomingClass: false,
                message: '今天没有更多课程了'
            }));
        }
        
        return res.json(success('ok', {
            hasUpcomingClass: true,
            nextClass,
            timeUntilClass,
            currentTime: now.toTimeString().slice(0, 8)
        }));
        
    } catch (err) {
        console.error('GET /api/smart-recommendation/upcoming-class', err);
        return res.status(500).json(error('获取即将上课信息失败'));
    }
});

// 获取食堂人流量信息
router.get('/canteen-traffic', async (req, res) => {
    try {
        // 获取所有食堂信息
        const canteens = await Canteen.list();
        
        // 演示用固定人流量数据（展示最佳效果）
        const demoTrafficData = [
            { name: '一食堂', traffic: 85, level: 'busy' },
            { name: '二食堂', traffic: 42, level: 'moderate' },
            { name: '三食堂', traffic: 98, level: 'crowded' },
            { name: '风味餐厅', traffic: 28, level: 'idle' },
            { name: '清真食堂', traffic: 65, level: 'busy' }
        ];
        
        const trafficData = canteens.map((canteen, index) => {
            // 使用预设的演示数据，如果没有匹配的就用默认值
            const demoData = demoTrafficData.find(demo => 
                canteen.name.includes(demo.name.replace('食堂', '').replace('餐厅', ''))
            ) || demoTrafficData[index % demoTrafficData.length];
            
            const finalTrafficCount = demoData.traffic;
            let trafficLevel = demoData.level;
            
            return {
                id: canteen.id,
                name: canteen.name,
                location: canteen.location,
                trafficLevel,
                trafficCount: finalTrafficCount,
                status: canteen.status,
                openTime: canteen.open_time,
                closeTime: canteen.close_time
            };
        });
        
        return res.json(success('ok', {
            canteens: trafficData,
            updateTime: new Date().toTimeString().slice(0, 5)
        }));
        
    } catch (err) {
        console.error('GET /api/smart-recommendation/canteen-traffic', err);
        return res.status(500).json(error('获取食堂人流量信息失败'));
    }
});

// 获取自习室空位信息
router.get('/study-room-availability', async (req, res) => {
    try {
        // 获取所有自习室
        const studyRooms = await StudyRoom.list();
        
        // 获取今天的日期
        const today = new Date().toISOString().split('T')[0];
        
        // 获取每个自习室的座位和预约信息
        const availabilityData = await Promise.all(studyRooms.map(async (room) => {
            try {
                // 获取该自习室的座位
                const seats = await StudySeat.listByRoom(room.id);
                const totalSeats = seats.length;
                
                // 获取今天的预约
                const todayBookings = await StudySeatBooking.listByRoomAndDate(room.id, today);
                
                // 计算已预约的座位数
                const bookedSeats = todayBookings.filter(booking => 
                    booking.status === 'reserved' || booking.status === 'active'
                ).length;
                
                const availableSeats = Math.max(0, totalSeats - bookedSeats);
                const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
                
                // 根据占用率确定状态
                let statusText, statusClass, statusColor;
                if (occupancyRate <= 30) {
                    statusText = '空位较多';
                    statusClass = 'status-good';
                    statusColor = '#00B578';
                } else if (occupancyRate <= 70) {
                    statusText = '空位适中';
                    statusClass = 'status-moderate';
                    statusColor = '#4cd964';
                } else if (occupancyRate <= 90) {
                    statusText = '即将满座';
                    statusClass = 'status-warning';
                    statusColor = '#FF9500';
                } else {
                    statusText = '已满座';
                    statusClass = 'status-full';
                    statusColor = '#FF3B30';
                }
                
                return {
                    id: room.id,
                    name: room.name,
                    location: room.location,
                    totalSeats,
                    availableSeats,
                    bookedSeats,
                    occupancyRate,
                    statusText,
                    statusClass,
                    statusColor,
                    openTime: room.open_time,
                    closeTime: room.close_time
                };
            } catch (err) {
                console.error(`获取自习室 ${room.id} 信息失败:`, err);
                return {
                    id: room.id,
                    name: room.name,
                    location: room.location,
                    totalSeats: 0,
                    availableSeats: 0,
                    bookedSeats: 0,
                    occupancyRate: 0,
                    statusText: '数据异常',
                    statusClass: 'status-error',
                    statusColor: '#999999',
                    openTime: null,
                    closeTime: null
                };
            }
        }));
        
        return res.json(success('ok', {
            studyRooms: availabilityData,
            updateTime: new Date().toTimeString().slice(0, 5)
        }));
        
    } catch (err) {
        console.error('GET /api/smart-recommendation/study-room-availability', err);
        return res.status(500).json(error('获取自习室空位信息失败'));
    }
});

module.exports = router;
