-- 食堂窗口系统升级脚本
-- 支持窗口级别的细化管理

-- 1. 创建食堂窗口表
CREATE TABLE IF NOT EXISTS `canteen_windows` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `canteen_id` INT NOT NULL COMMENT '食堂ID',
  `window_number` VARCHAR(20) NOT NULL COMMENT '窗口编号，如：1号窗口、2号窗口',
  `window_name` VARCHAR(100) NOT NULL COMMENT '窗口名称',
  `window_type` VARCHAR(50) NOT NULL COMMENT '窗口类型/菜系：川菜、湘菜、面食、快餐等',
  `description` TEXT COMMENT '窗口描述',
  `tags` JSON COMMENT '窗口标签：["特色", "热销", "新品"]',
  `status` ENUM('open', 'closed', 'busy') DEFAULT 'open' COMMENT '窗口状态',
  `open_time` TIME COMMENT '营业开始时间',
  `close_time` TIME COMMENT '营业结束时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_canteen_id` (`canteen_id`),
  INDEX `idx_window_type` (`window_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食堂窗口表';

-- 2. 修改菜品表，增加窗口关联
ALTER TABLE `foods` ADD COLUMN `window_id` INT DEFAULT NULL COMMENT '所属窗口ID' AFTER `canteen_id`;
ALTER TABLE `foods` ADD INDEX `idx_window_id` (`window_id`);

-- 3. 插入食堂窗口数据

-- 一食堂窗口
INSERT INTO `canteen_windows` (`canteen_id`, `window_number`, `window_name`, `window_type`, `description`, `tags`, `open_time`, `close_time`) VALUES
(1, '1号窗口', '一食堂川菜窗口', '川菜', '正宗川味，麻辣鲜香', '["热销", "特色"]', '06:30:00', '21:30:00'),
(1, '2号窗口', '一食堂湘菜窗口', '湘菜', '地道湘味，香辣可口', '["特色", "推荐"]', '06:30:00', '21:30:00'),
(1, '3号窗口', '一食堂粤菜窗口', '粤菜', '清淡养生，原汁原味', '["健康", "清淡"]', '07:00:00', '21:00:00'),
(1, '4号窗口', '一食堂快餐窗口', '快餐', '快速出餐，品种齐全', '["快速", "实惠"]', '06:30:00', '21:30:00'),
(1, '5号窗口', '一食堂面食窗口', '面食', '各式面点，手工制作', '["主食", "特色"]', '06:30:00', '21:00:00'),
(1, '6号窗口', '一食堂素食窗口', '素食', '健康素食，营养均衡', '["健康", "素食"]', '07:00:00', '20:00:00'),
(1, '7号窗口', '一食堂小吃窗口', '小吃', '地方小吃，风味独特', '["小吃", "特色"]', '10:00:00', '21:30:00');

-- 二食堂窗口
INSERT INTO `canteen_windows` (`canteen_id`, `window_number`, `window_name`, `window_type`, `description`, `tags`, `open_time`, `close_time`) VALUES
(2, '1号窗口', '二食堂特色川菜', '川菜', '招牌川菜，师傅精选', '["热销", "特色", "推荐"]', '07:00:00', '21:00:00'),
(2, '2号窗口', '二食堂精品面食', '面食', '手工拉面，现做现卖', '["主食", "热销"]', '07:00:00', '21:00:00'),
(2, '3号窗口', '二食堂西式简餐', '西餐', '西式快餐，便捷美味', '["西餐", "快速"]', '08:00:00', '20:00:00'),
(2, '4号窗口', '二食堂特色小炒', '家常菜', '家常小炒，温馨美味', '["家常", "推荐"]', '07:00:00', '21:00:00'),
(2, '5号窗口', '二食堂盖浇饭', '快餐', '营养盖浇，经济实惠', '["实惠", "快速"]', '07:00:00', '21:00:00');

-- 三食堂窗口
INSERT INTO `canteen_windows` (`canteen_id`, `window_number`, `window_name`, `window_type`, `description`, `tags`, `open_time`, `close_time`) VALUES
(3, '1号窗口', '三食堂快餐套餐', '快餐', '营养套餐，搭配合理', '["套餐", "实惠"]', '07:30:00', '20:30:00'),
(3, '2号窗口', '三食堂面馆', '面食', '各地面食，应有尽有', '["主食", "特色"]', '07:30:00', '20:30:00'),
(3, '3号窗口', '三食堂小吃城', '小吃', '网红小吃，美味汇聚', '["小吃", "网红", "新品"]', '10:00:00', '20:30:00'),
(3, '4号窗口', '三食堂饮品站', '饮品', '现制饮品，清凉一夏', '["饮品", "推荐"]', '08:00:00', '20:30:00'),
(3, '5号窗口', '三食堂烧烤', '烧烤', '特色烧烤，香气扑鼻', '["烧烤", "特色", "热销"]', '11:00:00', '20:30:00');

-- 4. 更新现有菜品的窗口关联（根据菜品类型分配到相应窗口）

-- 更新川菜类菜品到川菜窗口
UPDATE `foods` f 
SET f.window_id = (
  SELECT cw.id FROM `canteen_windows` cw 
  WHERE cw.canteen_id = f.canteen_id 
  AND cw.window_type = '川菜' 
  LIMIT 1
)
WHERE (f.tags LIKE '%川菜%' OR f.name LIKE '%川%' OR f.name LIKE '%麻辣%' OR f.name LIKE '%水煮%' OR f.name LIKE '%回锅%')
AND f.window_id IS NULL;

-- 更新湘菜类菜品到湘菜窗口
UPDATE `foods` f 
SET f.window_id = (
  SELECT cw.id FROM `canteen_windows` cw 
  WHERE cw.canteen_id = f.canteen_id 
  AND cw.window_type = '湘菜' 
  LIMIT 1
)
WHERE (f.tags LIKE '%湘菜%' OR f.name LIKE '%湘%' OR f.name LIKE '%辣椒%')
AND f.window_id IS NULL;

-- 更新面食类菜品到面食窗口
UPDATE `foods` f 
SET f.window_id = (
  SELECT cw.id FROM `canteen_windows` cw 
  WHERE cw.canteen_id = f.canteen_id 
  AND cw.window_type = '面食' 
  LIMIT 1
)
WHERE (f.tags LIKE '%面食%' OR f.name LIKE '%面%' OR f.name LIKE '%饺子%' OR f.name LIKE '%包子%' OR f.name LIKE '%馒头%')
AND f.window_id IS NULL;

-- 更新小吃类菜品到小吃窗口
UPDATE `foods` f 
SET f.window_id = (
  SELECT cw.id FROM `canteen_windows` cw 
  WHERE cw.canteen_id = f.canteen_id 
  AND cw.window_type = '小吃' 
  LIMIT 1
)
WHERE (f.tags LIKE '%小吃%' OR f.name LIKE '%小吃%')
AND f.window_id IS NULL;

-- 其他菜品分配到快餐或家常菜窗口
UPDATE `foods` f 
SET f.window_id = (
  SELECT cw.id FROM `canteen_windows` cw 
  WHERE cw.canteen_id = f.canteen_id 
  AND cw.window_type IN ('快餐', '家常菜') 
  LIMIT 1
)
WHERE f.window_id IS NULL;

-- 5. 插入更多细化的菜品数据（带窗口关联和图片）

-- 一食堂川菜窗口菜品
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '1号窗口'),
  '宫保鸡丁', 18.00, '经典川菜，麻辣鲜香，鸡肉鲜嫩', '热菜', '["川菜", "特色", "热销"]',
  'http://localhost:3000/static/images/FoodList/gongbao_jiding.jpg', 'available', 580
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '宫保鸡丁' AND canteen_id = 1);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '1号窗口'),
  '麻婆豆腐', 15.00, '麻辣鲜香，豆腐嫩滑，下饭必备', '热菜', '["川菜", "特色", "下饭"]',
  'http://localhost:3000/static/images/FoodList/mapo_tofu.jpg', 'available', 720
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '麻婆豆腐' AND canteen_id = 1);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '1号窗口'),
  '水煮鱼', 28.00, '鱼肉鲜嫩，麻辣过瘾，招牌菜品', '热菜', '["川菜", "特色", "热销"]',
  'http://localhost:3000/static/images/FoodList/shuizhu_fish.jpg', 'available', 450
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '水煮鱼' AND canteen_id = 1);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '1号窗口'),
  '回锅肉', 22.00, '肥而不腻，香辣可口，经典川味', '热菜', '["川菜", "特色"]',
  'http://localhost:3000/static/images/FoodList/huiguo_meat.jpg', 'available', 380
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '回锅肉' AND canteen_id = 1);

-- 一食堂面食窗口菜品
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '5号窗口'),
  '牛肉拉面', 12.00, '手工拉面，牛肉大块，汤鲜味美', '主食', '["面食", "主食", "热销"]',
  'http://localhost:3000/static/images/FoodList/beef_noodles.jpg', 'available', 890
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '牛肉拉面' AND canteen_id = 1);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '5号窗口'),
  '炸酱面', 10.00, '老北京炸酱面，酱香浓郁', '主食', '["面食", "主食", "实惠"]',
  'http://localhost:3000/static/images/FoodList/zhajiang_noodles.jpg', 'available', 650
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '炸酱面' AND canteen_id = 1);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  1,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 1 AND window_number = '5号窗口'),
  '小笼包', 8.00, '皮薄馅大，汁多味美，现蒸现卖', '主食', '["面食", "主食", "特色"]',
  'http://localhost:3000/static/images/FoodList/xiaolongbao.jpg', 'available', 520
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '小笼包' AND canteen_id = 1);

-- 二食堂川菜窗口菜品（5号窗口）
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '1号窗口'),
  '毛血旺', 25.00, '麻辣鲜香，料足味美，二食堂招牌', '热菜', '["川菜", "特色", "热销"]',
  'http://localhost:3000/static/images/FoodList/maoxuewang.jpg', 'available', 680
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '毛血旺' AND canteen_id = 2);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '1号窗口'),
  '辣子鸡', 20.00, '外酥里嫩，香辣过瘾', '热菜', '["川菜", "特色"]',
  'http://localhost:3000/static/images/FoodList/laziji.jpg', 'available', 490
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '辣子鸡' AND canteen_id = 2);

-- 二食堂面食窗口菜品
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '2号窗口'),
  '刀削面', 11.00, '手工刀削，筋道爽滑', '主食', '["面食", "主食", "热销"]',
  'http://localhost:3000/static/images/FoodList/daoxiao_noodles.jpg', 'available', 780
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '刀削面' AND canteen_id = 2);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '2号窗口'),
  '担担面', 13.00, '麻辣鲜香，面条劲道，川味面食', '主食', '["面食", "主食", "川菜"]',
  'http://localhost:3000/static/images/FoodList/dandan_noodles.jpg', 'available', 560
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '担担面' AND canteen_id = 2);

-- 二食堂盖浇饭窗口（5号窗口）
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '5号窗口'),
  '番茄炒蛋盖浇饭', 12.00, '营养均衡，酸甜可口', '主食', '["快餐", "实惠", "营养"]',
  'http://localhost:3000/static/images/FoodList/tomato_egg_rice.jpg', 'available', 820
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '番茄炒蛋盖浇饭' AND canteen_id = 2);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  2,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 2 AND window_number = '5号窗口'),
  '黑椒牛柳盖浇饭', 18.00, '牛肉鲜嫩，黑椒味浓', '主食', '["快餐", "热销"]',
  'http://localhost:3000/static/images/FoodList/beef_rice.jpg', 'available', 620
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '黑椒牛柳盖浇饭' AND canteen_id = 2);

-- 三食堂小吃窗口菜品
INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  3,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 3 AND window_number = '3号窗口'),
  '煎饼果子', 8.00, '现做现卖，香脆可口', '小吃', '["小吃", "实惠", "热销"]',
  'http://localhost:3000/static/images/FoodList/jianbing.jpg', 'available', 950
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '煎饼果子' AND canteen_id = 3);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  3,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 3 AND window_number = '3号窗口'),
  '臭豆腐', 10.00, '外焦里嫩，香气四溢', '小吃', '["小吃", "特色", "网红"]',
  'http://localhost:3000/static/images/FoodList/stinky_tofu.jpg', 'available', 430
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '臭豆腐' AND canteen_id = 3);

INSERT INTO `foods` (`canteen_id`, `window_id`, `name`, `price`, `description`, `category`, `tags`, `image`, `status`, `monthly_sales`) 
SELECT 
  3,
  (SELECT id FROM `canteen_windows` WHERE canteen_id = 3 AND window_number = '3号窗口'),
  '烤冷面', 9.00, '东北特色，酱香浓郁', '小吃', '["小吃", "特色"]',
  'http://localhost:3000/static/images/FoodList/kaolengmian.jpg', 'available', 380
WHERE NOT EXISTS (SELECT 1 FROM `foods` WHERE name = '烤冷面' AND canteen_id = 3);

-- 查询统计
SELECT 
  c.name AS 食堂名称,
  cw.window_number AS 窗口编号,
  cw.window_name AS 窗口名称,
  cw.window_type AS 窗口类型,
  COUNT(f.id) AS 菜品数量
FROM canteens c
LEFT JOIN canteen_windows cw ON c.number = cw.canteen_id
LEFT JOIN foods f ON cw.id = f.window_id
GROUP BY c.number, cw.id
ORDER BY c.number, cw.id;
