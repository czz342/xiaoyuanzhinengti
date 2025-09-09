const express = require('express')
const router = express.Router()
const Activity = require('../models/Activity')
const ActivityParticipant = require('../models/ActivityParticipant')
const { authenticateToken } = require('../middleware/auth')

// 获取活动统计数据
router.get('/stats', async (req, res) => {
  try {
    const stats = await Activity.getStats()
    res.json({
      success: true,
      data: {
        overview: stats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取活动列表
router.get('/list', async (req, res) => {
  try {
    const result = await Activity.list(req.query)
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取活动详情
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      })
    }

    // 获取参与人数
    const participantCount = await ActivityParticipant.getParticipantCount(req.params.id)
    activity.current_participants = participantCount

    res.json({
      success: true,
      data: activity
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 创建活动
router.post('/', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.create(req.body)
    res.status(201).json({
      success: true,
      data: activity,
      message: '活动创建成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 更新活动
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.update(req.params.id, req.body)
    res.json({
      success: true,
      data: activity,
      message: '活动更新成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 删除活动
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const success = await Activity.delete(req.params.id)
    if (success) {
      res.json({
        success: true,
        message: '活动删除成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '活动不存在'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取活动参与者
router.get('/:id/participants', async (req, res) => {
  try {
    const result = await ActivityParticipant.getByActivityId(req.params.id, req.query)
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 更新参与者状态
router.put('/:id/participants/:participantId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    const success = await ActivityParticipant.updateStatus(req.params.id, req.params.participantId, status)
    
    if (success) {
      res.json({
        success: true,
        message: '参与者状态更新成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '参与者不存在'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 报名参加活动
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const result = await ActivityParticipant.register(req.params.id, userId)
    res.status(201).json({
      success: true,
      data: result,
      message: '报名成功'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// 取消报名
router.delete('/:id/register', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const success = await ActivityParticipant.cancel(req.params.id, userId)
    
    if (success) {
      res.json({
        success: true,
        message: '取消报名成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '您未报名此活动'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取社团活动列表
router.get('/club/:clubId', async (req, res) => {
  try {
    const result = await Activity.list({
      ...req.query,
      club_id: req.params.clubId
    })
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
