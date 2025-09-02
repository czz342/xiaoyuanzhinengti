const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config');
const Counselor = require('../models/Counselor');
const CounselorSchedule = require('../models/CounselorSchedule');

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(l => l.split(',').map(v => v.trim()));
  return { headers, rows };
}

function val(headers, row, key) {
  const i = headers.indexOf(key); return i >= 0 ? row[i] : '';
}

async function main() {
  const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password || '424266445Czz',
    database: 'campus_system'
  });
  try {
    await Counselor.createTable();
    await CounselorSchedule.createTable();

    // 导入咨询师
    const counselorCsv = path.resolve(__dirname, '../../data/心理咨询师信息导入模板.csv');
    const cContent = fs.readFileSync(counselorCsv, 'utf-8');
    const cParsed = parseCsv(cContent);
    for (const row of cParsed.rows) {
      const counselorNumber = val(cParsed.headers, row, 'number');
      if (!counselorNumber) continue;
      const name = val(cParsed.headers, row, 'name.zh_CN');
      const title = val(cParsed.headers, row, 'lb77_title');
      const background = val(cParsed.headers, row, 'lb77_background');
      const style = val(cParsed.headers, row, 'lb77_style');
      const specialties = val(cParsed.headers, row, 'lb77_specialties');
      const status = val(cParsed.headers, row, 'lb77_status') || '在职';
      await Counselor.create({ counselorNumber, name, title, background, style, specialties, status });
    }

    // 索引映射：编号->ID
    const counselorList = await Counselor.list();
    const numToId = new Map(counselorList.map(c => [c.counselor_number, c.id]));

    // 导入周排班
    const scheduleCsv = path.resolve(__dirname, '../../data/咨询师周排班导入模板.csv');
    const sContent = fs.readFileSync(scheduleCsv, 'utf-8');
    const sParsed = parseCsv(sContent);
    for (const row of sParsed.rows) {
      const counselorNumber = val(sParsed.headers, row, 'lb77_counselor.number');
      const dayOfWeek = val(sParsed.headers, row, 'lb77_day_of_week') || '周一';
      const start = Number(val(sParsed.headers, row, 'lb77_start_time') || 0);
      const end = Number(val(sParsed.headers, row, 'lb77_end_time') || 0);
      const counselorId = numToId.get(counselorNumber);
      if (!counselorId) continue;
      await CounselorSchedule.create({ counselorId, dayOfWeek, startSec: start, endSec: end });
    }

    console.log('✅ 导入咨询师与排班完成');
  } catch (e) {
    console.error('❌ 导入失败:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };


