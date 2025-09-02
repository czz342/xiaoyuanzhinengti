const { db } = require('../config/database');

const Questionnaire = {
    async createTables() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS questionnaires (
                id INT AUTO_INCREMENT PRIMARY KEY,
                questionnaire_key VARCHAR(64) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                questionnaire_id INT NOT NULL,
                question_index INT NOT NULL,
                text VARCHAR(1000) NOT NULL,
                options_json TEXT NOT NULL,
                FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
                INDEX idx_qid (questionnaire_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    async upsertQuestionnaire({ key, title }) {
        await db.execute(`
            INSERT INTO questionnaires (questionnaire_key, title)
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE title=VALUES(title)
        `, [key, title]);
        const [rows] = await db.execute(`SELECT * FROM questionnaires WHERE questionnaire_key=?`, [key]);
        return rows[0];
    },

    async replaceQuestions(questionnaireId, questions) {
        await db.execute(`DELETE FROM questions WHERE questionnaire_id=?`, [questionnaireId]);
        for (const q of questions) {
            await db.execute(`
                INSERT INTO questions (questionnaire_id, question_index, text, options_json)
                VALUES (?, ?, ?, ?)
            `, [questionnaireId, q.index, q.text, JSON.stringify(q.options)]);
        }
    },

    async getQuestionnaireWithQuestionsByKey(key) {
        const [qRows] = await db.execute(`SELECT * FROM questionnaires WHERE questionnaire_key=?`, [key]);
        if (qRows.length === 0) return null;
        const questionnaire = qRows[0];
        const [qs] = await db.execute(`SELECT * FROM questions WHERE questionnaire_id=? ORDER BY question_index ASC`, [questionnaire.id]);
        questionnaire.questions = qs.map(r => ({
            id: r.id,
            index: r.question_index,
            text: r.text,
            options: JSON.parse(r.options_json || '[]'),
        }));
        return questionnaire;
    }
};

module.exports = Questionnaire;


