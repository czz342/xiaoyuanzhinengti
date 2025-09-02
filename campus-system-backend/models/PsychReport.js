const { db } = require('../config/database');

const PsychReport = {
    async createTables() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS psych_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(64) NOT NULL,
                questionnaire_key VARCHAR(64) NOT NULL,
                questionnaire_title VARCHAR(255) NOT NULL,
                total_score INT NOT NULL,
                result_level VARCHAR(64) NOT NULL,
                suggestion TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_student (student_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS psych_report_entries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                question_index INT NOT NULL,
                selected_text VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                FOREIGN KEY (report_id) REFERENCES psych_reports(id) ON DELETE CASCADE,
                INDEX idx_report (report_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async createReport({ studentId, questionnaireKey, questionnaireTitle, totalScore, resultLevel, suggestion, entries }) {
        const [res] = await db.execute(`
            INSERT INTO psych_reports (student_id, questionnaire_key, questionnaire_title, total_score, result_level, suggestion)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [studentId, questionnaireKey, questionnaireTitle, totalScore, resultLevel, suggestion || '']);
        const reportId = res.insertId;
        for (const e of entries || []) {
            await db.execute(`
                INSERT INTO psych_report_entries (report_id, question_index, selected_text, score)
                VALUES (?, ?, ?, ?)
            `, [reportId, e.question_index || e.lb77_questionindex, e.selected_text || e.lb77_selecttext, e.score || e.lb77_score]);
        }
        return { id: reportId };
    },

    async listByStudent(studentId) {
        const [rows] = await db.execute(`
            SELECT * FROM psych_reports WHERE student_id=? ORDER BY created_at DESC
        `, [studentId]);
        return rows;
    }
};

module.exports = PsychReport;


