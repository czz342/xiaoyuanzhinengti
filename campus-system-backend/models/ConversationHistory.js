/**
 * AI对话历史模型
 */
const { pool } = require('../config/database');

class ConversationHistory {
    /**
     * 插入对话历史记录
     */
    static async insert(data) {
        const connection = await pool.getConnection();
        try {
            const { student_id, module_type, user_message, ai_response, extracted_keywords } = data;
            
            const [result] = await connection.execute(
                `INSERT INTO ai_conversation_history 
                (student_id, module_type, user_message, ai_response, extracted_keywords)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    student_id,
                    module_type,
                    user_message,
                    ai_response || null,
                    extracted_keywords ? JSON.stringify(extracted_keywords) : null
                ]
            );
            
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    /**
     * 获取用户在某个模块的历史对话
     */
    static async getByStudentAndModule(student_id, module_type, limit = 20) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM ai_conversation_history 
                WHERE student_id = ? AND module_type = ?
                ORDER BY created_at DESC
                LIMIT ?`,
                [student_id, module_type, limit]
            );
            
            // 解析JSON字段
            return rows.map(row => ({
                ...row,
                extracted_keywords: row.extracted_keywords ? JSON.parse(row.extracted_keywords) : null
            }));
        } finally {
            connection.release();
        }
    }

    /**
     * 获取最近N条对话
     */
    static async getRecent(student_id, limit = 10) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM ai_conversation_history 
                WHERE student_id = ?
                ORDER BY created_at DESC
                LIMIT ?`,
                [student_id, limit]
            );
            
            return rows.map(row => ({
                ...row,
                extracted_keywords: row.extracted_keywords ? JSON.parse(row.extracted_keywords) : null
            }));
        } finally {
            connection.release();
        }
    }

    /**
     * 更新AI响应
     */
    static async updateAiResponse(id, ai_response) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `UPDATE ai_conversation_history SET ai_response = ? WHERE id = ?`,
                [ai_response, id]
            );
        } finally {
            connection.release();
        }
    }

    /**
     * 统计某个模块的对话次数
     */
    static async countByModule(student_id, module_type) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT COUNT(*) as count FROM ai_conversation_history 
                WHERE student_id = ? AND module_type = ?`,
                [student_id, module_type]
            );
            
            return rows[0].count;
        } finally {
            connection.release();
        }
    }
}

module.exports = ConversationHistory;

