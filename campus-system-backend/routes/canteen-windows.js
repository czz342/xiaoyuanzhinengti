/**
 * 食堂窗口管理API
 */
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { success, error } = require('../utils/response');

/**
 * GET /api/canteen-windows/canteens/:canteenId/windows
 * 获取指定食堂的所有窗口
 */
router.get('/canteens/:canteenId/windows', authenticateToken, async (req, res) => {
  try {
    const { canteenId } = req.params;
    
    console.log('获取食堂窗口，食堂ID:', canteenId);
    
    // 先根据canteenId查找对应的数字ID（用于窗口表查询）
    const canteenQuery = `SELECT id, number, name FROM canteens WHERE number = ? OR id = ?`;
    const canteenResult = await db.query(canteenQuery, [canteenId, canteenId]);
    
    if (canteenResult.length === 0) {
      console.log(`❌ 未找到食堂 ${canteenId}`);
      return res.status(404).json(error(`食堂 ${canteenId} 不存在`));
    }
    
    // 使用整数ID进行窗口表查询
    const actualCanteenId = canteenResult[0].id;
    console.log(`✅ 食堂ID映射: ${canteenId} → ${actualCanteenId} (${canteenResult[0].name})`);
    
    const query = `
      SELECT 
        cw.*,
        COUNT(f.id) as food_count
      FROM canteen_windows cw
      LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
      WHERE cw.canteen_id = ?
      GROUP BY cw.id
      ORDER BY cw.window_number
    `;
    
    const windows = await db.query(query, [actualCanteenId]);
    
    // 处理窗口数据
    const processedWindows = windows.map(window => ({
      ...window,
      tags: Array.isArray(window.tags) ? window.tags : 
            (window.tags ? window.tags.split(',').map(t => t.trim()) : []),
      food_count: parseInt(window.food_count) || 0
    }));
    
    console.log(`✅ 成功获取食堂 ${canteenId} 的 ${processedWindows.length} 个窗口`);
    
    return res.json(success('获取窗口列表成功', processedWindows));
    
  } catch (err) {
    console.error('获取食堂窗口失败:', err);
    return res.status(500).json(error('获取窗口列表失败'));
  }
});

/**
 * GET /api/canteen-windows/windows/:windowId/foods
 * 获取指定窗口的菜品
 */
router.get('/windows/:windowId/foods', authenticateToken, async (req, res) => {
  try {
    const { windowId } = req.params;
    
    console.log('获取窗口菜品，窗口ID:', windowId);
    
    const query = `
      SELECT 
        f.*,
        cw.window_number,
        cw.window_name,
        cw.window_type,
        c.name as canteen_name
      FROM foods f
      JOIN canteen_windows cw ON f.window_id = cw.id
      JOIN canteens c ON f.canteen_id = c.id
      WHERE f.window_id = ? AND f.status = 'available'
      ORDER BY f.created_at DESC
    `;
    
    const foods = await db.query(query, [windowId]);
    
    // 处理菜品数据
    const processedFoods = foods.map(food => ({
      ...food,
      tags: Array.isArray(food.tags) ? food.tags : 
            (food.tags ? food.tags.split(',').map(t => t.trim()) : []),
      price: parseFloat(food.price) || 0,
      monthly_sales: parseInt(food.monthly_sales) || 0
    }));
    
    console.log(`✅ 成功获取窗口 ${windowId} 的 ${processedFoods.length} 个菜品`);
    
    return res.json(success('获取窗口菜品成功', processedFoods));
    
  } catch (err) {
    console.error('获取窗口菜品失败:', err);
    return res.status(500).json(error('获取窗口菜品失败'));
  }
});

/**
 * GET /api/canteen-windows/canteens/:canteenId/foods
 * 获取指定食堂的所有菜品（按窗口分组）
 */
router.get('/canteens/:canteenId/foods', authenticateToken, async (req, res) => {
  try {
    const { canteenId } = req.params;
    
    console.log('获取食堂所有菜品，食堂ID:', canteenId);
    
    // 先查找正确的食堂ID
    const canteenQuery = `SELECT id, number, name FROM canteens WHERE number = ? OR id = ?`;
    const canteenResult = await db.query(canteenQuery, [canteenId, canteenId]);
    
    if (canteenResult.length === 0) {
      console.log(`❌ 未找到食堂 ${canteenId}`);
      return res.status(404).json(error(`食堂 ${canteenId} 不存在`));
    }
    
    const actualCanteenId = canteenResult[0].id;
    
    const query = `
      SELECT 
        f.*,
        cw.id as window_id,
        cw.window_number,
        cw.window_name,
        cw.window_type,
        c.name as canteen_name
      FROM foods f
      LEFT JOIN canteen_windows cw ON f.window_id = cw.id
      JOIN canteens c ON f.canteen_id = c.id
      WHERE f.canteen_id = ? AND f.status = 'available'
      ORDER BY cw.window_number, f.created_at DESC
    `;
    
    const foods = await db.query(query, [actualCanteenId]);
    
    // 处理菜品数据
    const processedFoods = foods.map(food => ({
      ...food,
      tags: Array.isArray(food.tags) ? food.tags : 
            (food.tags ? food.tags.split(',').map(t => t.trim()) : []),
      price: parseFloat(food.price) || 0,
      monthly_sales: parseInt(food.monthly_sales) || 0
    }));
    
    console.log(`✅ 成功获取食堂 ${canteenId} 的 ${processedFoods.length} 个菜品`);
    
    return res.json(success('获取食堂菜品成功', processedFoods));
    
  } catch (err) {
    console.error('获取食堂菜品失败:', err);
    return res.status(500).json(error('获取食堂菜品失败'));
  }
});

/**
 * GET /api/canteen-windows/search
 * 根据窗口名称或类型搜索
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { canteen, window, windowType } = req.query;
    
    console.log('搜索窗口:', { canteen, window, windowType });
    
    let query = `
      SELECT 
        cw.*,
        c.name as canteen_name,
        COUNT(f.id) as food_count
      FROM canteen_windows cw
      JOIN canteens c ON cw.canteen_id = c.number
      LEFT JOIN foods f ON cw.id = f.window_id AND f.status = 'available'
      WHERE 1=1
    `;
    const params = [];
    
    if (canteen) {
      query += ` AND c.name LIKE ?`;
      params.push(`%${canteen}%`);
    }
    
    if (window) {
      query += ` AND (cw.window_number LIKE ? OR cw.window_name LIKE ?)`;
      params.push(`%${window}%`, `%${window}%`);
    }
    
    if (windowType) {
      query += ` AND cw.window_type = ?`;
      params.push(windowType);
    }
    
    query += ` GROUP BY cw.id ORDER BY cw.canteen_id, cw.window_number`;
    
    const windows = await db.query(query, params);
    
    // 处理窗口数据
    const processedWindows = windows.map(window => ({
      ...window,
      tags: Array.isArray(window.tags) ? window.tags : 
            (window.tags ? window.tags.split(',').map(t => t.trim()) : []),
      food_count: parseInt(window.food_count) || 0
    }));
    
    console.log(`✅ 搜索到 ${processedWindows.length} 个窗口`);
    
    return res.json(success('搜索窗口成功', processedWindows));
    
  } catch (err) {
    console.error('搜索窗口失败:', err);
    return res.status(500).json(error('搜索窗口失败'));
  }
});

module.exports = router;
