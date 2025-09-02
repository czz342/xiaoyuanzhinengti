const express = require('express');
const router = express.Router();
const MedicalDepartment = require('../models/MedicalDepartment');
const MedicalDoctor = require('../models/MedicalDoctor');
const DoctorSchedule = require('../models/DoctorSchedule');
const MedicalAppointment = require('../models/MedicalAppointment');
const { authenticateToken } = require('../middleware/auth');

// 初始化表
router.get('/init', async (req, res) => {
    try {
        await MedicalDepartment.createTable();
        await MedicalDoctor.createTable();
        await DoctorSchedule.createTable();
        await MedicalAppointment.createTable();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 科室列表
router.get('/departments', async (req, res) => {
    try {
        const list = await MedicalDepartment.list();
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取科室失败' });
    }
});

// 指定科室的医生列表
router.get('/departments/:deptNumber/doctors', async (req, res) => {
    try {
        const deptNumber = req.params.deptNumber;
        const list = await MedicalDoctor.listByDepartment(deptNumber);
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取医生失败' });
    }
});

// 医生周排班
router.get('/doctors/:doctorNumber/schedule', async (req, res) => {
    try {
        const doctorNumber = req.params.doctorNumber;
        const list = await DoctorSchedule.listByDoctor(doctorNumber);
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取排班失败' });
    }
});

// 创建预约
router.post('/appointments', authenticateToken, async (req, res) => {
    try {
        const { studentId, doctorNumber, date, startTimeSec, endTimeSec } = req.body || {};
        if (!studentId || !doctorNumber || !date || startTimeSec == null || endTimeSec == null) {
            return res.status(400).json({ success: false, message: '参数不完整' });
        }
        const booked = await MedicalAppointment.isSlotBooked(doctorNumber, date, Number(startTimeSec));
        if (booked) {
            return res.status(409).json({ success: false, message: '该时段已被预约' });
        }
        const created = await MedicalAppointment.create({
            studentId: String(studentId),
            doctorNumber,
            appointmentDate: date,
            startTimeSec: Number(startTimeSec),
            endTimeSec: Number(endTimeSec)
        });
        res.json({ success: true, data: created });
    } catch (e) {
        res.status(500).json({ success: false, message: '创建预约失败' });
    }
});

// 取消预约
router.post('/appointments/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { studentId } = req.body || {};
        if (!id || !studentId) return res.status(400).json({ success: false, message: '参数不完整' });
        await MedicalAppointment.cancel(id, String(studentId));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: '取消预约失败' });
    }
});

// 我的预约
router.get('/my/appointments', authenticateToken, async (req, res) => {
    try {
        const studentId = req.query.studentId;
        if (!studentId) return res.status(400).json({ success: false, message: '参数不完整' });
        const list = await MedicalAppointment.listByStudent(String(studentId));
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取预约失败' });
    }
});

module.exports = router;


