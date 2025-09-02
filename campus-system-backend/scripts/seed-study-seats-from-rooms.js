const { ensureDatabase } = require('../config/database');
const StudyRoom = require('../models/StudyRoom');
const StudySeat = require('../models/StudySeat');

function computeGrid(total) {
  const cols = 10; // 固定每行10列，便于前端布局
  const rows = Math.ceil(total / cols);
  return { rows, cols };
}

async function main() {
  await ensureDatabase();
  await StudySeat.createTable();

  const rooms = await StudyRoom.list();
  if (!Array.isArray(rooms) || rooms.length === 0) {
    console.log('No rooms found. Abort.');
    process.exit(0);
  }

  let inserted = 0;
  for (const room of rooms) {
    const total = Number(room.total_seats) || 0;
    if (total <= 0) continue;
    const { rows, cols } = computeGrid(total);
    let created = 0;
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        if ((r - 1) * cols + c > total) break;
        const number = `${room.number}-${r}-${c}`;
        const label = `${room.name}-${r}-${c}`;
        await StudySeat.insert({
          room_id: room.id,
          number,
          label,
          row_no: r,
          col_no: c,
          seat_type: null,
          status: 'available'
        });
        inserted++;
        created++;
      }
    }
    console.log(`Room ${room.number} -> created ${created} seats`);
  }

  console.log(`Done. Inserted/Upserted seats: ${inserted}`);
  process.exit(0);
}

main().catch(err => {
  console.error('seed seats error:', err);
  process.exit(1);
});


