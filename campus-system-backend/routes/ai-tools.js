const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');
const StudySeatBooking = require('../models/StudySeatBooking');
const { success, error } = require('../utils/response');

/**
 * 将秒数转换为可读的时间格式（HH:MM）
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * 根据自习室名称查找room_id
 */
async function findRoomByName(roomName) {
    const rooms = await StudyRoom.list();
    const room = rooms.find(r => 
        r.name === roomName || 
        r.number === roomName ||
        r.name.includes(roomName) ||
        roomName.includes(r.name)
    );
    return room;
}

/**
 * 根据座位标识（label或number）在指定自习室内查找seat_id
 * 支持多种格式：
 * 1. 完整label："中央图书馆-4-9"
 * 2. 座位号："9" 或 "5号座"（会在label中查找匹配的座位号）
 * 3. 楼层-座位号："4-9"
 */
async function findSeatByLabel(roomId, seatLabel) {
    const seats = await StudySeat.listByRoom(roomId);
    
    // 方式1：完全匹配
    let seat = seats.find(s => s.label === seatLabel || s.number === seatLabel);
    if (seat) return seat;
    
    // 方式2：包含匹配
    seat = seats.find(s => 
        s.label.includes(seatLabel) ||
        seatLabel.includes(s.label) ||
        seatLabel.includes(s.number) ||
        s.number.includes(seatLabel)
    );
    if (seat) return seat;
    
    // 方式3：提取座位号（处理"5号座"、"5"等格式）
    const seatNumMatch = seatLabel.match(/(\d+)/);
    if (seatNumMatch) {
        const seatNum = seatNumMatch[1];
        // 在label中查找包含该座位号的（格式：房间-楼层-座位号）
        seat = seats.find(s => {
            const parts = s.label.split('-');
            return parts.length >= 3 && parts[parts.length - 1] === seatNum;
        });
        if (seat) return seat;
        
        // 也尝试匹配col_no字段
        seat = seats.find(s => s.col_no && s.col_no.toString() === seatNum);
        if (seat) return seat;
    }
    
    // 方式4：支持"楼层-座位号"格式（如"4-9"）
    const floorSeatMatch = seatLabel.match(/^(\d+)[-](\d+)$/);
    if (floorSeatMatch) {
        const floor = floorSeatMatch[1];
        const seatNum = floorSeatMatch[2];
        seat = seats.find(s => {
            const parts = s.label.split('-');
            return parts.length >= 3 && 
                   parts[parts.length - 2] === floor && 
                   parts[parts.length - 1] === seatNum;
        });
        if (seat) return seat;
    }
    
    return null;
}

/**
 * AI助手工具：创建自习室座位预约
 * POST /api/ai/studyroom/book
 * 
 * 支持两种方式：
 * 1. 通过名称：room_name + seat_label（推荐，更易理解）
 * 2. 通过ID：room_id + seat_id（精确，需先查询）
 */
router.post('/studyroom/book', async (req, res) => {
    try {
        console.log('收到预约请求:', JSON.stringify(req.body, null, 2));
        const {
            room_id,
            seat_id,
            room_name,
            seat_label,
            student_id,
            booking_date,
            start_time_sec,
            end_time_sec
        } = req.body;

        // 参数验证：必须提供student_id, booking_date, start_time_sec, end_time_sec
        if (!student_id || !booking_date || start_time_sec === undefined || end_time_sec === undefined) {
            console.log('参数验证失败，缺少必要参数');
            return res.status(200).json(error('缺少必要参数：student_id, booking_date, start_time_sec, end_time_sec'));
        }

        // 验证时间范围
        if (start_time_sec >= end_time_sec) {
            return res.status(200).json(error('时间范围非法：开始时间必须早于结束时间'));
        }

        let finalRoomId, finalSeatId;
        let room, seat;

        // 方式1：通过名称查找
        if (room_name && seat_label) {
            console.log(`通过名称查找：room_name=${room_name}, seat_label=${seat_label}`);
            const allRooms = await StudyRoom.list();
            console.log(`数据库中所有自习室：`, allRooms.map(r => ({ id: r.id, name: r.name, number: r.number })));
            
            room = await findRoomByName(room_name);
            if (!room) {
                const availableRooms = allRooms.map(r => r.name || r.number).filter(Boolean).join('、');
                console.log(`未找到自习室：${room_name}，可用自习室：${availableRooms}`);
                return res.status(200).json(error(`未找到自习室"${room_name}"。可用自习室：${availableRooms || '无'}。提示：请使用数据库中实际存在的自习室名称，例如"中央图书馆"`));
            }
            console.log(`找到自习室：id=${room.id}, name=${room.name}`);
            finalRoomId = room.id;

            const allSeats = await StudySeat.listByRoom(finalRoomId);
            console.log(`该自习室所有座位（前5个）：`, allSeats.slice(0, 5).map(s => ({ id: s.id, label: s.label, number: s.number })));
            
            seat = await findSeatByLabel(finalRoomId, seat_label);
            if (!seat) {
                const exampleSeats = allSeats.slice(0, 3).map(s => s.label).join('、');
                console.log(`未找到座位：${seat_label} (自习室：${room_name})`);
                return res.status(200).json(error(`未找到座位"${seat_label}" (自习室：${room_name})。示例座位：${exampleSeats || '无'}。提示：座位格式应为"房间名-楼层-座位号"，如"中央图书馆-4-9"，或只提供座位号如"9"`));
            }
            console.log(`找到座位：id=${seat.id}, label=${seat.label}`);
            finalSeatId = seat.id;
        }
        // 方式2：通过ID直接使用
        else if (room_id && seat_id) {
            finalRoomId = parseInt(room_id, 10);
            finalSeatId = parseInt(seat_id, 10);

            // 验证ID是否存在
            room = await StudyRoom.findById(finalRoomId);
            if (!room) {
                return res.status(200).json(error(`未找到自习室ID：${room_id}`));
            }

            const seats = await StudySeat.listByRoom(finalRoomId);
            seat = seats.find(s => s.id === finalSeatId);
            if (!seat) {
                return res.status(200).json(error(`未找到座位ID：${seat_id} (自习室ID：${room_id})`));
            }
        } else {
            return res.status(200).json(error('必须提供 (room_name + seat_label) 或 (room_id + seat_id)'));
        }

        // 检查时间冲突
        console.log('检查时间冲突:', {
            seat_id: finalSeatId,
            booking_date: booking_date,
            start_time_sec: start_time_sec,
            end_time_sec: end_time_sec
        });
        const hasConflict = await StudySeatBooking.hasTimeConflict(
            finalSeatId,
            booking_date,
            start_time_sec,
            end_time_sec
        );
        console.log('时间冲突检查结果:', hasConflict);

        if (hasConflict) {
            console.log('时间冲突，返回错误');
            return res.status(200).json(error('该时段已被预约，请选择其他时间'));
        }

        // 插入预约记录
        console.log('准备插入预约记录:', {
            room_id: finalRoomId,
            seat_id: finalSeatId,
            student_id: student_id,
            booking_date: booking_date,
            start_time_sec: start_time_sec,
            end_time_sec: end_time_sec
        });
        await StudySeatBooking.insert({
            room_id: finalRoomId,
            seat_id: finalSeatId,
            student_id: student_id,
            booking_date: booking_date,
            start_time_sec: start_time_sec,
            end_time_sec: end_time_sec,
            status: 'reserved'
        });
        console.log('预约记录插入成功');

        // 获取刚插入的记录（通过查询该学生的最新预约）
        const bookings = await StudySeatBooking.listByStudent(student_id);
        const newBooking = bookings.find(b => 
            b.room_id === finalRoomId && 
            b.seat_id === finalSeatId && 
            b.booking_date === booking_date &&
            b.start_time_sec === start_time_sec &&
            b.end_time_sec === end_time_sec
        ) || bookings[0]; // 如果找不到精确匹配，返回最新一条

        const responseData = {
            booking_id: newBooking.id,
            room_id: finalRoomId,
            seat_id: finalSeatId,
            room_name: room.name,
            seat_label: seat.label,
            student_id: student_id,
            booking_date: booking_date,
            start_time_sec: start_time_sec,
            end_time_sec: end_time_sec,
            start_time_display: formatTime(start_time_sec),
            end_time_display: formatTime(end_time_sec),
            status: 'reserved'
        };
        
        console.log('返回成功响应:', JSON.stringify(responseData, null, 2));
        // 返回成功响应（包含详细信息）
        return res.status(200).json(success('预约成功', responseData));

    } catch (err) {
        console.error('AI工具接口错误:', err);
        console.error('错误堆栈:', err.stack);
        return res.status(200).json(error('预约失败：' + (err.message || String(err))));
    }
});

module.exports = router;

