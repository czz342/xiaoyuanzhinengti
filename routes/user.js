const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取所有用户列表
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT id, user_id, username, display_name, real_name, phone, 
                   email, student_id, college, major, grade, gender, 
                   status, credit_score, completed_orders, total_earnings, 
                   last_login_time, created_at, updated_at
            FROM users 
            ORDER BY created_at DESC
        `);
        
        res.json({
            success: true,
            message: '获取用户列表成功',
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取用户列表失败',
            error: error.message
        });
    }
});

// 根据ID获取用户详情
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [rows] = await db.execute(`
            SELECT * FROM users WHERE id = ?
        `, [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        
        res.json({
            success: true,
            message: '获取用户详情成功',
            data: rows[0]
        });
    } catch (error) {
        console.error('获取用户详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取用户详情失败',
            error: error.message
        });
    }
});

// 创建新用户
router.post('/', async (req, res) => {
    try {
        const {
            user_id, username, display_name, real_name, phone, email,
            student_id, college, major, grade, gender, birthday
        } = req.body;
        
        // 验证必填字段
        if (!user_id || !username) {
            return res.status(400).json({
                success: false,
                message: '用户ID和用户名是必填字段'
            });
        }
        
        // 检查用户ID是否已存在
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE user_id = ? OR username = ?',
            [user_id, username]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: '用户ID或用户名已存在'
            });
        }
        
        // 插入新用户
        const [result] = await db.execute(`
            INSERT INTO users (
                user_id, username, display_name, real_name, phone, email,
                student_id, college, major, grade, gender, birthday
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_id, username, display_name, real_name, phone, email,
             student_id, college, major, grade, gender, birthday]);
        
        res.status(201).json({
            success: true,
            message: '用户创建成功',
            data: { id: result.insertId, user_id, username }
        });
    } catch (error) {
        console.error('创建用户失败:', error);
        res.status(500).json({
            success: false,
            message: '创建用户失败',
            error: error.message
        });
    }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        // 移除不允许更新的字段
        delete updateData.id;
        delete updateData.user_id;
        delete updateData.created_at;
        delete updateData.updated_at;
        
        // 构建更新SQL
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: '没有要更新的字段'
            });
        }
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        
        const [result] = await db.execute(sql, [...values, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        
        res.json({
            success: true,
            message: '用户信息更新成功'
        });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({
            success: false,
            message: '更新用户信息失败',
            error: error.message
        });
    }
});

// 删除用户
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const [result] = await db.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        
        res.json({
            success: true,
            message: '用户删除成功'
        });
    } catch (error) {
        console.error('删除用户失败:', error);
        res.status(500).json({
            success: false,
            message: '删除用户失败',
            error: error.message
        });
    }
});

// 根据学号查询用户
router.get('/student/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const [rows] = await db.execute(`
            SELECT * FROM users WHERE student_id = ?
        `, [studentId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '未找到该学号对应的用户'
            });
        }
        
        res.json({
            success: true,
            message: '查询用户成功',
            data: rows[0]
        });
    } catch (error) {
        console.error('根据学号查询用户失败:', error);
        res.status(500).json({
            success: false,
            message: '查询用户失败',
            error: error.message
        });
    }
});

module.exports = router;
