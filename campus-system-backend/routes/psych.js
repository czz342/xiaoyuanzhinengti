const express = require('express');
const router = express.Router();
const Counselor = require('../models/Counselor');
const CounselorSchedule = require('../models/CounselorSchedule');
const PsychAppointment = require('../models/PsychAppointment');
const Questionnaire = require('../models/Questionnaire');
const PsychReport = require('../models/PsychReport');

// 初始化表（若首次使用）
router.get('/init', async (req, res) => {
    try {
        await Counselor.createTable();
        await CounselorSchedule.createTable();
        await PsychAppointment.createTable();
        await Questionnaire.createTables();
        await PsychReport.createTables();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 咨询师列表
router.get('/counselors', async (req, res) => {
    try {
        const list = await Counselor.list();
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取咨询师失败' });
    }
});

// 咨询师周排班
router.get('/counselors/:id/schedule', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const list = await CounselorSchedule.listByCounselor(id);
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取排班失败' });
    }
});

// 创建预约
router.post('/appointments', async (req, res) => {
    try {
        const { studentId, counselorId, date, startTimeSec, endTimeSec } = req.body || {};
        if (!studentId || !counselorId || !date || startTimeSec == null || endTimeSec == null) {
            return res.status(400).json({ success: false, message: '参数不完整' });
        }
        const booked = await PsychAppointment.isSlotBooked(Number(counselorId), date, Number(startTimeSec));
        if (booked) {
            return res.status(409).json({ success: false, message: '该时段已被预约' });
        }
        const created = await PsychAppointment.create({
            studentId: String(studentId),
            counselorId: Number(counselorId),
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
router.post('/appointments/:id/cancel', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { studentId } = req.body || {};
        if (!id || !studentId) return res.status(400).json({ success: false, message: '参数不完整' });
        await PsychAppointment.cancel(id, String(studentId));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: '取消预约失败' });
    }
});

// 我的预约
router.get('/my/appointments', async (req, res) => {
    try {
        const studentId = req.query.studentId;
        if (!studentId) return res.status(400).json({ success: false, message: '参数不完整' });
        const list = await PsychAppointment.listByStudent(String(studentId));
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取预约失败' });
    }
});

// 提交评估（生成报告）
router.post('/reports', async (req, res) => {
    try {
        const { studentId, questionnaireKey, questionnaireTitle, totalScore, resultLevel, suggestion, entries } = req.body || {};
        if (!studentId || !questionnaireKey || !questionnaireTitle || totalScore == null || !resultLevel) {
            return res.status(400).json({ success: false, message: '参数不完整' });
        }
        const created = await PsychReport.createReport({
            studentId: String(studentId),
            questionnaireKey,
            questionnaireTitle,
            totalScore: Number(totalScore),
            resultLevel,
            suggestion: suggestion || '',
            entries: entries || []
        });
        res.json({ success: true, data: created });
    } catch (e) {
        res.status(500).json({ success: false, message: '提交评估失败' });
    }
});

// 我的报告
router.get('/my/reports', async (req, res) => {
    try {
        const studentId = req.query.studentId;
        if (!studentId) return res.status(400).json({ success: false, message: '参数不完整' });
        const list = await PsychReport.listByStudent(String(studentId));
        res.json({ success: true, data: list });
    } catch (e) {
        res.status(500).json({ success: false, message: '获取报告失败' });
    }
});

module.exports = router;


