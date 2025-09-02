const fs = require('fs');
const path = require('path');
const { db } = require('../config/database');
const MedicalDepartment = require('../models/MedicalDepartment');
const MedicalDoctor = require('../models/MedicalDoctor');
const DoctorSchedule = require('../models/DoctorSchedule');

function parseCSV(content) {
    const lines = content.trim().split(/\r?\n/);
    const header = lines.shift().split(',');
    return lines.map(line => {
        const cols = line.split(',');
        const obj = {};
        header.forEach((h, i) => obj[h.trim()] = (cols[i] || '').trim());
        return obj;
    });
}

function timeToSec(t) {
    // e.g. 08:30 -> seconds
    const [h, m] = t.split(':').map(n => parseInt(n, 10));
    return (h * 3600) + (m * 60);
}

async function main() {
    try {
        await MedicalDepartment.createTable();
        await MedicalDoctor.createTable();
        await DoctorSchedule.createTable();

        const dataDir = path.join(__dirname, '..', '..', 'data');

        // 导入科室
        const deptCsv = fs.readFileSync(path.join(dataDir, '校医科室导入模板.csv'), 'utf8');
        const deptRows = parseCSV(deptCsv);
        for (const r of deptRows) {
            await MedicalDepartment.upsert({
                deptNumber: r['number'],
                name: r['name.zh_CN'],
                description: r['description']
            });
        }

        // 导入医生
        const docCsv = fs.readFileSync(path.join(dataDir, '校医医生信息导入模板.csv'), 'utf8');
        const docRows = parseCSV(docCsv);
        for (const r of docRows) {
            await MedicalDoctor.upsert({
                doctorNumber: r['number'],
                name: r['name.zh_CN'],
                deptNumber: r['lb77_department.number'],
                title: r['lb77_title'],
                specialty: r['lb77_specialty']
            });
        }

        // 导入周排班（根据“医生周排班数据说明.md”生成一些固定样例）
        // 简化：这里手写三位医生对应的时段（与说明一致）
        const schedules = {
            'DOC01': [
                ['周一','08:30','08:45'],['周一','08:45','09:00'],['周一','09:00','09:15'],['周一','09:15','09:30'],
                ['周一','14:00','14:15'],['周一','14:15','14:30'],
                ['周三','08:30','08:45'],['周三','08:45','09:00'],['周三','09:00','09:15'],
                ['周五','08:30','08:45'],['周五','08:45','09:00'],['周五','15:00','15:15'],['周五','15:15','15:30']
            ],
            'DOC02': [
                ['周二','09:00','09:15'],['周二','09:15','09:30'],['周二','09:30','09:45'],
                ['周二','14:30','14:45'],['周二','14:45','15:00'],
                ['周四','09:00','09:15'],['周四','09:15','09:30'],['周四','16:00','16:15'],['周四','16:15','16:30']
            ],
            'DOC03': [
                ['周一','10:00','10:15'],['周一','10:15','10:30'],
                ['周二','10:00','10:15'],['周二','10:15','10:30'],
                ['周三','10:00','10:15'],['周三','10:15','10:30'],
                ['周四','10:00','10:15'],['周四','10:15','10:30'],
                ['周五','10:00','10:15'],['周五','10:15','10:30']
            ]
        };

        for (const [doc, slots] of Object.entries(schedules)) {
            const rows = slots.map(([dow, s, e]) => ({
                day_of_week: dow,
                start_time_sec: timeToSec(s),
                end_time_sec: timeToSec(e),
                quota: 1
            }));
            await DoctorSchedule.bulkInsert(doc, rows);
        }

        console.log('✅ 医疗数据导入完成');
        process.exit(0);
    } catch (e) {
        console.error('❌ 导入失败:', e.message);
        process.exit(1);
    }
}

main();


