/**
 * 用户偏好模型
 */
const { pool } = require('../config/database');

class UserPreference {
    /**
     * 插入或更新用户偏好（自动累加频率）
     */
    static async upsert(data) {
        const connection = await pool.getConnection();
        try {
            const { student_id, module_type, preference_type, preference_value } = data;
            
            await connection.execute(
                `INSERT INTO user_preferences 
                (student_id, module_type, preference_type, preference_value, frequency)
                VALUES (?, ?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE 
                    frequency = frequency + 1,
                    last_mentioned_at = CURRENT_TIMESTAMP`,
                [student_id, module_type, preference_type, preference_value]
            );
        } finally {
            connection.release();
        }
    }

    /**
     * 批量插入偏好
     */
    static async batchUpsert(student_id, module_type, preferences) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            for (const pref of preferences) {
                await connection.execute(
                    `INSERT INTO user_preferences 
                    (student_id, module_type, preference_type, preference_value, frequency)
                    VALUES (?, ?, ?, ?, 1)
                    ON DUPLICATE KEY UPDATE 
                        frequency = frequency + 1,
                        last_mentioned_at = CURRENT_TIMESTAMP`,
                    [student_id, module_type, pref.type, pref.value]
                );
            }
            
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * 获取用户在某个模块的所有偏好（按频率和时间排序）
     */
    static async getByStudentAndModule(student_id, module_type) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM user_preferences 
                WHERE student_id = ? AND module_type = ?
                ORDER BY frequency DESC, last_mentioned_at DESC`,
                [student_id, module_type]
            );
            
            return rows;
        } finally {
            connection.release();
        }
    }

    /**
     * 获取用户特定类型的偏好
     */
    static async getByType(student_id, module_type, preference_type) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM user_preferences 
                WHERE student_id = ? AND module_type = ? AND preference_type = ?
                ORDER BY frequency DESC, last_mentioned_at DESC`,
                [student_id, module_type, preference_type]
            );
            
            return rows;
        } finally {
            connection.release();
        }
    }

    /**
     * 生成用户偏好摘要（用于注入到AI对话中）
     */
    static async generatePreferenceSummary(student_id, module_type) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT preference_type, preference_value, frequency 
                FROM user_preferences 
                WHERE student_id = ? AND module_type = ?
                ORDER BY frequency DESC, last_mentioned_at DESC
                LIMIT 10`,
                [student_id, module_type]
            );
            
            if (rows.length === 0) {
                return null;
            }

            // 按类型分组
            const grouped = {};
            rows.forEach(row => {
                if (!grouped[row.preference_type]) {
                    grouped[row.preference_type] = [];
                }
                grouped[row.preference_type].push({
                    value: row.preference_value,
                    frequency: row.frequency
                });
            });

            // 生成自然语言摘要
            const parts = [];
            
            // 图书推荐模块的偏好类型
            if (module_type === 'book' || module_type === 'library') {
                if (grouped.subject) {
                    const subjects = grouped.subject.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`学科偏好：${subjects}`);
                }
                
                if (grouped.book_type) {
                    const bookTypes = grouped.book_type.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`图书类型：${bookTypes}`);
                }
                
                if (grouped.reading_cycle) {
                    const readingCycles = grouped.reading_cycle.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`阅读周期：${readingCycles}`);
                }
                
                if (grouped.borrow_timing) {
                    const borrowTimings = grouped.borrow_timing.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`借阅时机：${borrowTimings}`);
                }
                
                if (grouped.author) {
                    const authors = grouped.author.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`作者偏好：${authors}`);
                }
            } else if (module_type === 'classroom') {
                // 教室预约模块的偏好类型
                if (grouped.equipment) {
                    const equipments = grouped.equipment.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`设备需求：${equipments}`);
                }
                
                if (grouped.floor) {
                    const floors = grouped.floor.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`楼层偏好：${floors}`);
                }
                
                if (grouped.capacity) {
                    const capacities = grouped.capacity.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`容量需求：${capacities}`);
                }
            } else {
                // 自习室模块的偏好类型（原有逻辑）
                if (grouped.location) {
                    const locations = grouped.location.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`位置偏好：${locations}`);
                }
                
                if (grouped.environment) {
                    const envs = grouped.environment.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`环境偏好：${envs}`);
                }
                
                // ❌ 时间偏好已移除 - 时间基于课表动态推荐
                
                if (grouped.facility) {
                    const facilities = grouped.facility.map(p => p.value).slice(0, 3).join('、');
                    parts.push(`设施偏好：${facilities}`);
                }
            }

            return parts.length > 0 ? parts.join('；') : null;
        } finally {
            connection.release();
        }
    }

    /**
     * 获取TOP N偏好（最常提到的）
     */
    static async getTopPreferences(student_id, module_type, limit = 5) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM user_preferences 
                WHERE student_id = ? AND module_type = ?
                ORDER BY frequency DESC, last_mentioned_at DESC
                LIMIT ?`,
                [student_id, module_type, limit]
            );
            
            return rows;
        } finally {
            connection.release();
        }
    }

    /**
     * 删除某个偏好
     */
    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `DELETE FROM user_preferences WHERE id = ?`,
                [id]
            );
        } finally {
            connection.release();
        }
    }

    /**
     * 清空用户某个模块的所有偏好
     */
    static async clearByModule(student_id, module_type) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `DELETE FROM user_preferences WHERE student_id = ? AND module_type = ?`,
                [student_id, module_type]
            );
        } finally {
            connection.release();
        }
    }
}

module.exports = UserPreference;

