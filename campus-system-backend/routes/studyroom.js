const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');
const StudySeatBooking = require('../models/StudySeatBooking');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

// 列出自习室
router.get('/list', async (req, res) => {
    try {
        const rooms = await StudyRoom.list();
        return res.json(success('ok', rooms));
    } catch (err) {
        console.error('GET /api/studyroom/list', err);
        return res.status(500).json(error('获取自习室列表失败'));
    }
});

// 创建自习室
router.post('/', authenticateToken, async (req, res) => {
    try {
        const room = req.body || {};
        if (!room.number || !room.name) {
            return res.status(400).json(error('number 和 name 必填'));
        }
        await StudyRoom.insert(room);
        return res.json(success('创建成功'));
    } catch (err) {
        console.error('POST /api/studyroom', err);
        return res.status(500).json(error('创建失败'));
    }
});

// 更新自习室
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await StudyRoom.update(id, req.body || {});
        return res.json(success('更新成功'));
    } catch (err) {
        console.error('PUT /api/studyroom/:id', err);
        return res.status(500).json(error('更新失败'));
    }
});

// 删除自习室
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await StudyRoom.remove(id);
        return res.json(success('删除成功'));
    } catch (err) {
        console.error('DELETE /api/studyroom/:id', err);
        return res.status(500).json(error('删除失败'));
    }
});

// 某房间座位
router.get('/:roomId/seats', async (req, res) => {
    try {
        const roomId = parseInt(req.params.roomId, 10);
        const seats = await StudySeat.listByRoom(roomId);
        return res.json(success('ok', seats));
    } catch (err) {
        console.error('GET /api/studyroom/:roomId/seats', err);
        return res.status(500).json(error('获取座位列表失败'));
    }
});

// 批量/单个创建座位
router.post('/:roomId/seats', authenticateToken, async (req, res) => {
    try {
        const roomId = parseInt(req.params.roomId, 10);
        const payload = req.body;
        const seats = Array.isArray(payload) ? payload : [payload];
        for (const seat of seats) {
            await StudySeat.insert({ ...seat, room_id: roomId });
        }
        return res.json(success('保存座位成功'));
    } catch (err) {
        console.error('POST /api/studyroom/:roomId/seats', err);
        return res.status(500).json(error('保存座位失败'));
    }
});

// 更新座位
router.put('/seat/:seatId', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.seatId, 10);
        await StudySeat.update(id, req.body || {});
        return res.json(success('更新座位成功'));
    } catch (err) {
        console.error('PUT /api/studyroom/seat/:seatId', err);
        return res.status(500).json(error('更新座位失败'));
    }
});

// 删除座位
router.delete('/seat/:seatId', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.seatId, 10);
        await StudySeat.remove(id);
        return res.json(success('删除座位成功'));
    } catch (err) {
        console.error('DELETE /api/studyroom/seat/:seatId', err);
        return res.status(500).json(error('删除座位失败'));
    }
});

// 指定日期该房间的预约
router.get('/:roomId/bookings/date/:date', async (req, res) => {
    try {
        const roomId = parseInt(req.params.roomId, 10);
        const date = req.params.date;
        const rows = await StudySeatBooking.listByRoomAndDate(roomId, date);
        return res.json(success('ok', rows));
    } catch (err) {
        console.error('GET /api/studyroom/:roomId/bookings/date/:date', err);
        return res.status(500).json(error('获取预约失败'));
    }
});

// 指定日期全局预约（用于概览）
router.get('/bookings/date/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const rows = await StudySeatBooking.listByDate(date);
        return res.json(success('ok', rows));
    } catch (err) {
        console.error('GET /api/studyroom/bookings/date/:date', err);
        return res.status(500).json(error('获取预约失败'));
    }
});

// 预约座位
router.post('/book', authenticateToken, async (req, res) => {
    try {
        console.log('预约请求体:', req.body);
        console.log('用户信息:', req.user);
        const { roomId, seatId, date, startTimeSec, endTimeSec } = req.body || {};
        console.log('解析后的参数:', { roomId, seatId, date, startTimeSec, endTimeSec });
        if (!roomId || !seatId || !date || !Number.isInteger(startTimeSec) || !Number.isInteger(endTimeSec)) {
            console.log('参数验证失败:', { roomId, seatId, date, startTimeSec, endTimeSec });
            return res.status(400).json(error('参数不完整'));
        }
        if (startTimeSec >= endTimeSec) {
            return res.status(400).json(error('时间范围非法'));
        }
        const hasConflict = await StudySeatBooking.hasTimeConflict(seatId, date, startTimeSec, endTimeSec);
        if (hasConflict) {
            return res.status(409).json(error('该时段已被预约'));
        }
        await StudySeatBooking.insert({
            room_id: roomId,
            seat_id: seatId,
            student_id: req.user.studentId || req.user.userId || String(req.user.id || ''),
            booking_date: date,
            start_time_sec: startTimeSec,
            end_time_sec: endTimeSec,
            status: 'reserved'
        });
        return res.json(success('预约成功'));
    } catch (err) {
        console.error('POST /api/studyroom/book', err);
        return res.status(500).json(error('预约失败'));
    }
});

// 取消预约
router.put('/cancel/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await StudySeatBooking.cancel(id, req.user.studentId || req.user.userId || String(req.user.id || ''));
        return res.json(success('已取消预约'));
    } catch (err) {
        console.error('PUT /api/studyroom/cancel/:id', err);
        return res.status(500).json(error('取消失败'));
    }
});

// 我的预约
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const list = await StudySeatBooking.listByStudent(req.user.studentId || req.user.userId || String(req.user.id || ''));
        return res.json(success('ok', list));
    } catch (err) {
        console.error('GET /api/studyroom/my', err);
        return res.status(500).json(error('获取我的预约失败'));
    }
});

module.exports = router;


