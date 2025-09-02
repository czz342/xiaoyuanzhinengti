const express = require('express');
const router = express.Router();
const Counselor = require('../models/Counselor');
const CounselorSchedule = require('../models/CounselorSchedule');

// 初始化表（若首次使用）
router.get('/init', async (req, res) => {
    try {
        await Counselor.createTable();
        await CounselorSchedule.createTable();
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

module.exports = router;


