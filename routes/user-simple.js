const express = require('express');
const router = express.Router();

// 模拟用户数据
const mockUsers = [
    {
        id: 1,
        user_id: 'U001',
        username: 'zhangsan',
        display_name: '张三',
        real_name: '张三',
        phone: '13800138001',
        student_id: '2021001',
        college: '计算机学院',
        major: '软件工程',
        grade: '2021级',
        status: 'active',
        credit_score: 5.00,
        completed_orders: 0,
        total_earnings: 0.00,
        created_at: '2025-08-27T00:00:00.000Z'
    },
    {
        id: 2,
        user_id: 'U002',
        username: 'lisi',
        display_name: '李四',
        real_name: '李四',
        phone: '13800138002',
        student_id: '2021002',
        college: '计算机学院',
        major: '软件工程',
        grade: '2021级',
        status: 'active',
        credit_score: 5.00,
        completed_orders: 0,
        total_earnings: 0.00,
        created_at: '2025-08-27T00:00:00.000Z'
    }
];

// 获取所有用户列表
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: '获取用户列表成功',
        data: mockUsers,
        total: mockUsers.length
    });
});

// 根据ID获取用户详情
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '用户不存在'
        });
    }
    
    res.json({
        success: true,
        message: '获取用户详情成功',
        data: user
    });
});

// 根据学号查询用户
router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const user = mockUsers.find(u => u.student_id === studentId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '未找到该学号对应的用户'
        });
    }
    
    res.json({
        success: true,
        message: '查询用户成功',
        data: user
    });
});

module.exports = router;

