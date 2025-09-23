const { query } = require('../config/database')

async function initParticipantData() {
  try {
    console.log('开始初始化参与者数据...')
    
    // 清理现有参与者数据
    await query('DELETE FROM activity_participants')
    console.log('✅ 旧参与者数据清理完成')
    
    // 获取用户和活动数据（排除admin、骑手、餐厅商户账号）
    const users = await query(`
      SELECT id, userName, displayName, picture 
      FROM users 
      WHERE id > 1 
        AND userName NOT LIKE 'canteen_%' 
        AND userName NOT LIKE 'rider_%'
        AND displayName NOT LIKE '%食堂%'
        AND displayName NOT LIKE '%餐厅%'
        AND displayName NOT LIKE '%骑手%'
      LIMIT 8
    `)
    const activities = await query('SELECT id, title, max_participants FROM activities')
    
    console.log(`📊 找到 ${users.length} 个用户，${activities.length} 个活动`)
    
    // 生成参与者数据
    const participants = []
    
    // 为每个活动生成参与者
    activities.forEach((activity, activityIndex) => {
      // 每个活动随机选择3-8个参与者
      const participantCount = Math.floor(Math.random() * 6) + 3
      const selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, participantCount)
      
      selectedUsers.forEach((user, userIndex) => {
        // 随机选择状态：registered, attended, absent, cancelled
        const statuses = ['registered', 'attended', 'absent', 'cancelled']
        const weights = [0.4, 0.3, 0.2, 0.1] // 权重：已报名40%，已签到30%，缺席20%，已取消10%
        
        let status = 'registered'
        const random = Math.random()
        let cumulative = 0
        for (let i = 0; i < statuses.length; i++) {
          cumulative += weights[i]
          if (random <= cumulative) {
            status = statuses[i]
            break
          }
        }
        
        // 生成加入时间（活动开始前1-7天）
        const activityStartTime = new Date('2025-09-05') // 第一个活动的开始时间
        const daysOffset = activityIndex * 1 + Math.floor(Math.random() * 7) + 1
        const joinedAt = new Date(activityStartTime.getTime() - daysOffset * 24 * 60 * 60 * 1000)
        
        // 生成签到时间（如果状态是attended）
        let attendedAt = null
        if (status === 'attended') {
          const activityTime = new Date(activityStartTime.getTime() + activityIndex * 24 * 60 * 60 * 1000)
          attendedAt = new Date(activityTime.getTime() + Math.floor(Math.random() * 60) * 60 * 1000) // 活动开始后0-60分钟内
        }
        
        // 生成积分奖励（如果已签到）
        const pointsEarned = status === 'attended' ? Math.floor(Math.random() * 30) + 10 : 0
        
        // 生成反馈（如果已签到）
        const feedbacks = [
          '活动很有趣，学到了很多！',
          '组织得很好，期待下次活动。',
          '内容很丰富，收获很大。',
          '活动时间安排合理，体验很好。',
          '讲师很专业，讲解很详细。',
          '活动氛围很好，认识了很多朋友。',
          '活动内容超出预期，非常满意。',
          '希望以后能多举办类似活动。'
        ]
        const feedback = status === 'attended' ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : null
        
        participants.push({
          activity_id: activity.id,
          user_id: user.id,
          status: status,
          joined_at: joinedAt.toISOString().slice(0, 19).replace('T', ' '),
          attended_at: attendedAt ? attendedAt.toISOString().slice(0, 19).replace('T', ' ') : null,
          points_earned: pointsEarned,
          feedback: feedback
        })
      })
    })
    
    console.log(`📝 生成了 ${participants.length} 个参与者记录`)
    
    // 插入参与者数据
    for (const participant of participants) {
      const sql = `
        INSERT INTO activity_participants 
        (activity_id, user_id, status, joined_at, attended_at, points_earned, feedback, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `
      const values = [
        participant.activity_id,
        participant.user_id,
        participant.status,
        participant.joined_at,
        participant.attended_at,
        participant.points_earned,
        participant.feedback
      ]
      
      await query(sql, values)
    }
    
    console.log('✅ 参与者数据插入完成')
    
    // 更新活动的当前参与者数量
    for (const activity of activities) {
      const participantCount = await query(
        'SELECT COUNT(*) as count FROM activity_participants WHERE activity_id = ? AND status != ?',
        [activity.id, 'cancelled']
      )
      
      await query(
        'UPDATE activities SET current_participants = ? WHERE id = ?',
        [participantCount[0].count, activity.id]
      )
    }
    
    console.log('✅ 活动参与者数量更新完成')
    
    // 统计信息
    const stats = await query(`
      SELECT 
        COUNT(*) as total_participants,
        SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) as registered,
        SUM(CASE WHEN status = 'attended' THEN 1 ELSE 0 END) as attended,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(points_earned) as total_points
      FROM activity_participants
    `)
    
    console.log('🎉 参与者数据初始化完成！')
    console.log('📊 数据统计:')
    console.log(`   - 总参与记录: ${stats[0].total_participants}`)
    console.log(`   - 已报名: ${stats[0].registered}`)
    console.log(`   - 已签到: ${stats[0].attended}`)
    console.log(`   - 缺席: ${stats[0].absent}`)
    console.log(`   - 已取消: ${stats[0].cancelled}`)
    console.log(`   - 总积分: ${stats[0].total_points}`)
    
  } catch (error) {
    console.error('❌ 初始化参与者数据失败:', error)
    throw error
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initParticipantData()
    .then(() => {
      console.log('✅ 脚本执行完成')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error)
      process.exit(1)
    })
}

module.exports = initParticipantData
