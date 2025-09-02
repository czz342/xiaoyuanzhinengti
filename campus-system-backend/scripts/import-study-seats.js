const path = require('path');
const fs = require('fs');
const { ensureDatabase } = require('../config/database');
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');

function parseCSVLine(line) {
    const trimmed = line.replace(/^\uFEFF/, '').trim();
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

async function importSeats(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('</rewritten_file'));

    // 直接按需查询 + 缓存，避免一次性 rooms.reduce
    const cache = new Map(); // key: roomNumber|roomName -> roomId

    let count = 0;
    let skipped = 0;
    for (let i = 2; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (!cols || cols.length < 14) { skipped++; continue; }

        const seatNumber = cols[0];
        const seatName = cols[1];
        const roomNumber = cols[10];
        const roomName = cols[11];
        const seatType = cols[12] || null;
        const rawStatus = cols[13];
        const seatStatus = rawStatus === '可用' ? 'available' : (rawStatus === '损坏' ? 'broken' : 'unavailable');

        let roomId = null;
        if (roomNumber && cache.has(roomNumber)) roomId = cache.get(roomNumber);
        if (!roomId && roomName && cache.has(roomName)) roomId = cache.get(roomName);
        if (!roomId) {
            const cacheKey = roomNumber || roomName;
            if (cache.has(cacheKey)) {
                roomId = cache.get(cacheKey);
            } else {
                // 兜底：直接查库
                try {
                    const StudyRoomModel = require('../models/StudyRoom');
                    let found = null;
                    if (roomNumber) found = await StudyRoomModel.findByNumber(roomNumber);
                    if (!found && roomName) {
                        // 简单按名称匹配
                        const listNow = await StudyRoomModel.list();
                        if (Array.isArray(listNow)) found = listNow.find(r => r.name === roomName);
                    }
                    if (found && found.id) {
                        roomId = found.id;
                        cache.set(cacheKey, roomId);
                    } else if (i < 10) {
                        console.log(`[DEBUG] No match for line ${i}: roomNumber=${roomNumber}, roomName=${roomName}`);
                    }
                } catch (e) {
                    // 忽略，保持后续跳过
                }
            }
        }
        if (!roomId) { skipped++; continue; }

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
        count++;
        if (count % 200 === 0) console.log(`Imported ${count} seats...`);
    }

    console.log(`Seats import completed. Imported: ${count}, Skipped: ${skipped}`);
}

async function importRoomsIfEmpty(csvPath) {
    let rooms = await StudyRoom.list();
    if (Array.isArray(rooms) && rooms.length > 0) {
        console.log(`Rooms already present: ${rooms.length}. Skip room import.`);
        return;
    }
    console.log('No rooms found. Importing rooms from CSV...');
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('</rewritten_file'));
    let inserted = 0;
    for (let i = 2; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (!cols || cols.length < 16) continue;
        const number = cols[0];
        const name = cols[1];
        const location = cols[11];
        const open = cols[12];
        const close = cols[13];
        const status = cols[14] === '可用' ? 'active' : 'inactive';
        const total = parseInt(cols[15], 10) || 0;
        if (!number || !name) continue;
        await StudyRoom.insert({ number, name, location, open_time: open, close_time: close, total_seats: total, status });
        inserted++;
    }
    console.log(`Rooms import completed. Inserted: ${inserted}`);
}

async function main() {
    await ensureDatabase();
    // 确保表存在
    await StudyRoom.createTable();
    await StudySeat.createTable();
    await importRoomsIfEmpty(path.join(__dirname, '..', '..', 'data', '自习室信息导入模板.csv'));
    await importSeats(path.join(__dirname, '..', '..', 'data', '自习室座位信息导入模板.csv'));
}

main().catch(err => {
    console.error('Import study seats error:', err);
    process.exit(1);
});


