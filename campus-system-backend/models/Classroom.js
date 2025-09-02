const { query } = require('../config/database');

class Classroom {
  // 创建教室表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS classrooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        code VARCHAR(50) UNIQUE NOT NULL COMMENT '教室编号',
        name VARCHAR(100) NOT NULL COMMENT '教室名称',
        building VARCHAR(50) NOT NULL COMMENT '教学楼',
        floor VARCHAR(20) NOT NULL COMMENT '楼层',
        capacity INT DEFAULT 0 COMMENT '容纳人数',
        status ENUM('available', 'maintenance', 'occupied') DEFAULT 'available' COMMENT '教室状态',
        equipment TEXT COMMENT '设备列表，JSON格式',
        position_x INT DEFAULT 0 COMMENT '在地图上的X坐标',
        position_y INT DEFAULT 0 COMMENT '在地图上的Y坐标',
        description TEXT COMMENT '教室描述',
        isActive BOOLEAN DEFAULT TRUE COMMENT '是否启用'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室信息表';
    `;
    
    try {
      await query(sql);
      console.log('✅ 教室表创建成功');
      return true;
    } catch (error) {
      console.error('❌ 教室表创建失败:', error);
      return false;
    }
  }

  // 创建教室
  static async create(classroomData) {
    const {
      code,
      name,
      building,
      floor,
      capacity = 0,
      status = 'available',
      equipment = '[]',
      position_x = 0,
      position_y = 0,
      description = ''
    } = classroomData;

    const sql = `
      INSERT INTO classrooms (code, name, building, floor, capacity, status, equipment, position_x, position_y, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [code, name, building, floor, capacity, status, equipment, position_x, position_y, description]);
      return result.insertId;
    } catch (error) {
      console.error('创建教室失败:', error);
      throw error;
    }
  }

  // 根据ID查找教室
  static async findById(id) {
    const sql = 'SELECT * FROM classrooms WHERE id = ? AND isActive = TRUE';
    try {
      const rows = await query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找教室失败:', error);
      throw error;
    }
  }

  // 根据编号查找教室
  static async findByCode(code) {
    const sql = 'SELECT * FROM classrooms WHERE code = ? AND isActive = TRUE';
    try {
      const rows = await query(sql, [code]);
      return rows[0] || null;
    } catch (error) {
      console.error('查找教室失败:', error);
      throw error;
    }
  }

  // 获取所有教室列表
  static async getAll() {
    const sql = 'SELECT * FROM classrooms WHERE isActive = TRUE ORDER BY building, floor, code';
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('获取教室列表失败:', error);
      throw error;
    }
  }

  // 根据教学楼和楼层获取教室
  static async getByBuildingAndFloor(building, floor) {
    const sql = 'SELECT * FROM classrooms WHERE building = ? AND floor = ? AND isActive = TRUE ORDER BY code';
    try {
      const rows = await query(sql, [building, floor]);
      return rows;
    } catch (error) {
      console.error('获取教室列表失败:', error);
      throw error;
    }
  }

  // 获取所有教学楼
  static async getBuildings() {
    const sql = 'SELECT DISTINCT building FROM classrooms WHERE isActive = TRUE ORDER BY building';
    try {
      const rows = await query(sql);
      return rows.map(row => row.building);
    } catch (error) {
      console.error('获取教学楼列表失败:', error);
      throw error;
    }
  }

  // 获取指定教学楼的所有楼层
  static async getFloors(building) {
    const sql = 'SELECT DISTINCT floor FROM classrooms WHERE building = ? AND isActive = TRUE ORDER BY floor';
    try {
      const rows = await query(sql, [building]);
      return rows.map(row => row.floor);
    } catch (error) {
      console.error('获取楼层列表失败:', error);
      throw error;
    }
  }

  // 更新教室信息
  static async update(id, updateData) {
    const allowedFields = ['name', 'capacity', 'status', 'equipment', 'position_x', 'position_y', 'description'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(id);
    const sql = `UPDATE classrooms SET ${updates.join(', ')}, updatedTime = CURRENT_TIMESTAMP WHERE id = ?`;

    try {
      const result = await query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新教室失败:', error);
      throw error;
    }
  }

  // 删除教室（软删除）
  static async delete(id) {
    const sql = 'UPDATE classrooms SET isActive = FALSE WHERE id = ?';
    try {
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('删除教室失败:', error);
      throw error;
    }
  }

  // 根据设备筛选教室
  static async getByEquipment(equipmentList) {
    if (!equipmentList || equipmentList.length === 0) {
      return this.getAll();
    }

    const conditions = equipmentList.map(() => 'JSON_CONTAINS(equipment, ?)').join(' AND ');
    const sql = `SELECT * FROM classrooms WHERE ${conditions} AND isActive = TRUE ORDER BY building, floor, code`;
    
    try {
      const rows = await query(sql, equipmentList.map(eq => JSON.stringify(eq)));
      return rows;
    } catch (error) {
      console.error('根据设备筛选教室失败:', error);
      throw error;
    }
  }

  // 获取可用教室
  static async getAvailable() {
    const sql = 'SELECT * FROM classrooms WHERE status = "available" AND isActive = TRUE ORDER BY building, floor, code';
    try {
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error('获取可用教室失败:', error);
      throw error;
    }
  }
}

module.exports = Classroom;
