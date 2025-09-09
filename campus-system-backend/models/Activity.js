const { query } = require('../config/database')

class Activity {
  // 创建活动表
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        club_id INT NOT NULL,
        title VARCHAR(200) NOT NULL COMMENT '活动标题',
        description TEXT COMMENT '活动描述',
        start_time DATETIME NOT NULL COMMENT '开始时间',
        end_time DATETIME NOT NULL COMMENT '结束时间',
        location VARCHAR(200) NOT NULL COMMENT '活动地点',
        max_participants INT DEFAULT 50 COMMENT '最大参与人数',
        registration_deadline DATETIME NOT NULL COMMENT '报名截止时间',
        cover_image VARCHAR(500) COMMENT '封面图片',
        tags JSON COMMENT '活动标签',
        status ENUM('draft', 'published', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft' COMMENT '活动状态',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_club_id (club_id),
        INDEX idx_status (status),
        INDEX idx_start_time (start_time),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表'
    `
    
    try {
      await query(sql)
      console.log('Activities table created successfully')
    } catch (error) {
      console.error('Error creating activities table:', error)
      throw error
    }
  }
  // 创建活动
  static async create(data) {
    const {
      club_id,
      title,
      description,
      start_time,
      end_time,
      location,
      max_participants,
      image_url,
      club_name,
      points_reward = 0,
      min_credibility = 0,
      status = 'draft',
      is_featured = false,
      created_by = 'admin'
    } = data

    const sql = `
      INSERT INTO activities (
        club_id, title, description, start_time, end_time, 
        location, max_participants, image_url, club_name,
        points_reward, min_credibility, status, is_featured, created_by,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `
    
    const values = [
      club_id,
      title,
      description,
      start_time,
      end_time,
      location,
      max_participants || 0,
      image_url || null,
      club_name || null,
      points_reward,
      min_credibility,
      status,
      is_featured,
      created_by
    ]

    try {
      const result = await query(sql, values)
      return { id: result.insertId, ...data }
    } catch (error) {
      throw new Error(`创建活动失败: ${error.message}`)
    }
  }

  // 获取活动列表
  static async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      club_id,
      status,
      keyword
    } = params

    let sql = `
      SELECT 
        a.*,
        c.name as club_name,
        c.category as club_category
      FROM activities a
      LEFT JOIN clubs c ON a.club_id = c.id
      WHERE 1=1
    `
    const values = []

    if (club_id) {
      sql += ' AND a.club_id = ?'
      values.push(club_id)
    }

    if (status) {
      sql += ' AND a.status = ?'
      values.push(status)
    }

    if (keyword) {
      sql += ' AND (a.title LIKE ? OR a.description LIKE ?)'
      values.push(`%${keyword}%`, `%${keyword}%`)
    }

    // 添加分页
    const offset = (page - 1) * limit
    sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`
    values.push(limit, offset)

    try {
      const activities = await query(sql, values)
      
      // 获取总数
      let countSql = `
        SELECT COUNT(*) as total
        FROM activities a
        WHERE 1=1
      `
      const countValues = []
      
      if (club_id) {
        countSql += ' AND a.club_id = ?'
        countValues.push(club_id)
      }
      
      if (status) {
        countSql += ' AND a.status = ?'
        countValues.push(status)
      }
      
      if (keyword) {
        countSql += ' AND (a.title LIKE ? OR a.description LIKE ?)'
        countValues.push(`%${keyword}%`, `%${keyword}%`)
      }

      const countResult = await query(countSql, countValues)
      const total = countResult[0].total

      // 处理活动数据
      const processedActivities = activities.map(activity => ({
        ...activity,
        tags: activity.tags ? JSON.parse(activity.tags) : [],
        current_participants: 0 // 这里需要单独查询参与者数量
      }))

      return {
        activities: processedActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total)
        }
      }
    } catch (error) {
      throw new Error(`获取活动列表失败: ${error.message}`)
    }
  }

  // 获取活动详情
  static async findById(id) {
    const sql = `
      SELECT 
        a.*,
        c.name as club_name,
        c.category as club_category
      FROM activities a
      LEFT JOIN clubs c ON a.club_id = c.id
      WHERE a.id = ?
    `

    try {
      const result = await query(sql, [id])
      if (result.length === 0) {
        return null
      }

      const activity = result[0]
      return {
        ...activity,
        tags: activity.tags ? JSON.parse(activity.tags) : []
      }
    } catch (error) {
      throw new Error(`获取活动详情失败: ${error.message}`)
    }
  }

  // 更新活动
  static async update(id, data) {
    const fields = []
    const values = []

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        if (key === 'tags') {
          fields.push(`${key} = ?`)
          values.push(JSON.stringify(data[key]))
        } else {
          fields.push(`${key} = ?`)
          values.push(data[key])
        }
      }
    })

    if (fields.length === 0) {
      throw new Error('没有要更新的字段')
    }

    fields.push('updated_at = NOW()')
    values.push(id)

    const sql = `UPDATE activities SET ${fields.join(', ')} WHERE id = ?`

    try {
      await query(sql, values)
      return await this.findById(id)
    } catch (error) {
      throw new Error(`更新活动失败: ${error.message}`)
    }
  }

  // 删除活动
  static async delete(id) {
    const sql = 'DELETE FROM activities WHERE id = ?'
    
    try {
      const result = await query(sql, [id])
      return result.affectedRows > 0
    } catch (error) {
      throw new Error(`删除活动失败: ${error.message}`)
    }
  }

  // 获取活动统计数据
  static async getStats() {
    try {
      // 总活动数
      const totalResult = await query('SELECT COUNT(*) as total FROM activities')
      const totalActivities = totalResult[0].total

      // 已发布活动数
      const publishedResult = await query('SELECT COUNT(*) as total FROM activities WHERE status = "published"')
      const publishedActivities = publishedResult[0].total

      // 进行中活动数
      const ongoingResult = await query('SELECT COUNT(*) as total FROM activities WHERE status = "ongoing"')
      const ongoingActivities = ongoingResult[0].total

      // 总参与人数
      const participantsResult = await query('SELECT COUNT(*) as total FROM activity_participants')
      const totalParticipants = participantsResult[0].total

      // 平均每活动参与人数
      const avgResult = await query(`
        SELECT AVG(participant_count) as avg_participants
        FROM (
          SELECT activity_id, COUNT(*) as participant_count
          FROM activity_participants
          GROUP BY activity_id
        ) as counts
      `)
      const avgParticipants = avgResult[0].avg_participants || 0

      // 热门活动
      const popularResult = await query(`
        SELECT 
          a.id,
          a.title,
          COUNT(ap.id) as participants
        FROM activities a
        LEFT JOIN activity_participants ap ON a.id = ap.activity_id
        WHERE a.status IN ('published', 'ongoing', 'completed')
        GROUP BY a.id, a.title
        ORDER BY participants DESC
        LIMIT 5
      `)

      // 活动趋势（最近7天）
      const trendResult = await query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM activities
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `)

      // 社团类型分布
      const categoryResult = await query(`
        SELECT 
          c.category,
          COUNT(a.id) as count
        FROM activities a
        LEFT JOIN clubs c ON a.club_id = c.id
        GROUP BY c.category
      `)

      return {
        total_activities: totalActivities,
        published_activities: publishedActivities,
        ongoing_activities: ongoingActivities,
        total_participants: totalParticipants,
        avg_participants_per_activity: Math.round(avgParticipants * 100) / 100,
        popular_activities: popularResult,
        activity_trend: trendResult,
        category_distribution: categoryResult
      }
    } catch (error) {
      throw new Error(`获取活动统计失败: ${error.message}`)
    }
  }
}

module.exports = Activity