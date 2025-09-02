const path = require('path');
const fs = require('fs');
const { ensureDatabase } = require('../config/database');
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');
const StudySeatBooking = require('../models/StudySeatBooking');

function parseCSVLine(line) {
    // 简单 CSV 解析（支持不含逗号转义的模板）
    // 去除行首尾空白与可能的 BOM
    const trimmed = line.replace(/^\uFEFF/, '').trim();
    // 兼容以逗号分隔并包裹在双引号内的字段
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            parts.push(current.replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += ch;
        }
    }
    parts.push(current.replace(/^"|"$/g, ''));
    return parts;
}

async function importRooms(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('</rewritten_file'));
    // 跳过两行表头
    for (let i = 2; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        // 依据提供模板的列序：number,name.zh_CN,...,lb77_number,lb77_location,lb77_opening_hours,lb77_closing_time,lb77_status,lb77_total_seats
        const number = cols[0];
        const name = cols[1];
        const lb_number = cols[10];
        const location = cols[11];
        const open = cols[12];
        const close = cols[13];
        const status = cols[14] === '可用' ? 'active' : 'inactive';
        const total = parseInt(cols[15], 10) || 0;
        if (!number || !name) continue;
        await StudyRoom.insert({
            number,
            name,
            location,
            open_time: open,
            close_time: close,
            total_seats: total,
            status
        });
    }
}

async function importSeats(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('</rewritten_file'));
    // 跳过两行表头
    // 需要先建立 number->id 映射
    let rooms = await StudyRoom.list();
    if (!Array.isArray(rooms)) rooms = [];
    const numberToId = rooms.reduce((acc, r) => { acc[r.number] = r.id; return acc; }, {});

    for (let i = 2; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        // 列：number,name.zh_CN,...,lb77_studyroom_id.number,lb77_studyroom_id.name,lb77_type,lb77_status
        const seatNumber = cols[0];
        const seatName = cols[1]; // 例如 中央图书馆-1-1
        const roomNumber = cols[10];
        const seatType = cols[12] || null;
        const seatStatus = cols[13] === '可用' ? 'available' : (cols[13] === '损坏' ? 'broken' : 'unavailable');
        const roomId = numberToId[roomNumber];
        if (!roomId) continue;

        // 解析行列
        let rowNo = null, colNo = null;
        const parts = (seatName || '').split('-');
        if (parts.length >= 3) {
            const r = parseInt(parts[parts.length - 2], 10);
            const c = parseInt(parts[parts.length - 1], 10);
            rowNo = isNaN(r) ? null : r;
            colNo = isNaN(c) ? null : c;
        }

        await StudySeat.insert({
            room_id: roomId,
            number: seatNumber,
            label: seatName,
            row_no: rowNo,
            col_no: colNo,
            seat_type: seatType,
            status: seatStatus
        });
    }
}

async function main() {
    await ensureDatabase();
    await StudyRoom.createTable();
    await StudySeat.createTable();
    await StudySeatBooking.createTable();
    // 先导入房间
    await importRooms(path.join(__dirname, '..', '..', 'data', '自习室信息导入模板.csv'));
    // 再导入座位
    await importSeats(path.join(__dirname, '..', '..', 'data', '自习室座位信息导入模板.csv'));
    console.log('Study rooms and seats imported successfully.');
    process.exit(0);
}

main().catch(err => {
    console.error('Init studyroom error:', err);
    process.exit(1);
});


