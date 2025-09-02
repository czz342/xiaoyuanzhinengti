const { query } = require('../config/database');

const Food = {
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS foods (
                id INT AUTO_INCREMENT PRIMARY KEY,
                number VARCHAR(64) NOT NULL UNIQUE COMMENT '菜品编码',
                name VARCHAR(255) NOT NULL COMMENT '菜品名称',
                canteen_id INT NOT NULL COMMENT '所属食堂ID',
                canteen_window VARCHAR(100) COMMENT '所属窗口',
                description TEXT COMMENT '菜品描述',
                image VARCHAR(500) COMMENT '菜品图片',
                price DECIMAL(10,2) NOT NULL COMMENT '价格',
                category VARCHAR(100) COMMENT '菜品分类',
                tags JSON COMMENT '口味标签',
                status ENUM('available', 'sold_out', 'discontinued') DEFAULT 'available' COMMENT '售卖状态',
                monthly_sales INT DEFAULT 0 COMMENT '月销量',
                rating DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
                preparation_time INT DEFAULT 10 COMMENT '制作时间(分钟)',
                is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_food_canteen FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品信息表';
        `;
        await query(sql);
    },

    async insert(food) {
        const sql = `
            INSERT INTO foods (number, name, canteen_id, canteen_window, description, image, price, category, tags, status, monthly_sales, rating, preparation_time, is_recommended)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name), canteen_id = VALUES(canteen_id), canteen_window = VALUES(canteen_window),
                description = VALUES(description), image = VALUES(image), price = VALUES(price),
                category = VALUES(category), tags = VALUES(tags), status = VALUES(status),
                monthly_sales = VALUES(monthly_sales), rating = VALUES(rating),
                preparation_time = VALUES(preparation_time), is_recommended = VALUES(is_recommended)
        `;
        
        const tags = food.tags ? JSON.stringify(food.tags) : '[]';
        const params = [
            food.number, food.name, food.canteen_id, food.canteen_window,
            food.description, food.image, food.price, food.category, tags,
            food.status || 'available', food.monthly_sales || 0, food.rating || 5.00,
            food.preparation_time || 10, food.is_recommended || false
        ];
        await query(sql, params);
    },

    async list() {
        const rows = await query('SELECT * FROM foods WHERE status = "available" ORDER BY id ASC');
        return Array.isArray(rows) ? rows : [];
    },

    async findByCanteen(canteenId) {
        const sql = `
            SELECT f.*, c.name as canteen_name, c.location as canteen_location
            FROM foods f
            LEFT JOIN canteens c ON f.canteen_id = c.id
            WHERE f.canteen_id = ? AND f.status = 'available'
            ORDER BY f.category, f.id ASC
        `;
        const rows = await query(sql, [canteenId]);
        return Array.isArray(rows) ? rows : [];
    },

    async findByCategory(category) {
        const rows = await query('SELECT * FROM foods WHERE category = ? AND status = "available" ORDER BY id ASC', [category]);
        return Array.isArray(rows) ? rows : [];
    },

    async findById(id) {
        const rows = await query('SELECT * FROM foods WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByNumber(number) {
        const rows = await query('SELECT * FROM foods WHERE number = ?', [number]);
        return rows[0] || null;
    },

    async search(keyword) {
        const sql = `
            SELECT * FROM foods 
            WHERE (name LIKE ? OR description LIKE ? OR category LIKE ?) 
            AND status = 'available'
            ORDER BY is_recommended DESC, monthly_sales DESC
        `;
        const searchTerm = `%${keyword}%`;
        const rows = await query(sql, [searchTerm, searchTerm, searchTerm]);
        return Array.isArray(rows) ? rows : [];
    },

    async getRecommended() {
        const rows = await query('SELECT * FROM foods WHERE is_recommended = TRUE AND status = "available" ORDER BY rating DESC LIMIT 10');
        return Array.isArray(rows) ? rows : [];
    },

    async getCategories() {
        const rows = await query('SELECT DISTINCT category FROM foods WHERE status = "available" ORDER BY category');
        return Array.isArray(rows) ? rows.map(row => row.category) : [];
    },

    async update(id, updates) {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);
        
        const sql = `UPDATE foods SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const result = await query(sql, values);
        return result.affectedRows > 0;
    },

    async delete(id) {
        const result = await query('DELETE FROM foods WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Food;
