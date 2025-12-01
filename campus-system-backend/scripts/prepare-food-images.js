/**
 * 菜品图片准备脚本
 * 为所有菜品准备图片资源
 */

const fs = require('fs');
const path = require('path');

// 菜品图片映射表（使用占位图片服务或本地默认图片）
const foodImages = {
  // 川菜类
  '宫保鸡丁': 'gongbao_jiding.jpg',
  '麻婆豆腐': 'mapo_tofu.jpg',
  '水煮鱼': 'shuizhu_fish.jpg',
  '回锅肉': 'huiguo_meat.jpg',
  '毛血旺': 'maoxuewang.jpg',
  '辣子鸡': 'laziji.jpg',
  '鱼香肉丝': 'yuxiang_shredded_pork.jpg',
  '酸菜鱼': 'pickled_fish.jpg',
  
  // 面食类
  '牛肉拉面': 'beef_noodles.jpg',
  '炸酱面': 'zhajiang_noodles.jpg',
  '小笼包': 'xiaolongbao.jpg',
  '刀削面': 'daoxiao_noodles.jpg',
  '担担面': 'dandan_noodles.jpg',
  '热干面': 'regan_noodles.jpg',
  '云吞面': 'wonton_noodles.jpg',
  
  // 盖浇饭类
  '番茄炒蛋盖浇饭': 'tomato_egg_rice.jpg',
  '黑椒牛柳盖浇饭': 'beef_rice.jpg',
  '宫保鸡丁盖浇饭': 'gongbao_rice.jpg',
  '红烧肉盖浇饭': 'braised_pork_rice.jpg',
  
  // 小吃类
  '煎饼果子': 'jianbing.jpg',
  '臭豆腐': 'stinky_tofu.jpg',
  '烤冷面': 'kaolengmian.jpg',
  '肉夹馍': 'roujiamo.jpg',
  '凉皮': 'liangpi.jpg',
  '糖葫芦': 'tanghulu.jpg',
  
  // 默认图片
  'default': 'default.png'
};

// 确保图片目录存在
const imagePath = path.join(__dirname, '../../public/static/images/FoodList');
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
  console.log(`✅ 创建图片目录: ${imagePath}`);
}

// 生成占位图片说明文件
const readmePath = path.join(imagePath, 'README.md');
const readmeContent = `# 菜品图片资源

## 图片列表

${Object.entries(foodImages).map(([name, file]) => `- **${name}**: ${file}`).join('\n')}

## 图片要求

- 格式：JPG/PNG
- 尺寸：建议 800x600 或 1:1 比例
- 大小：每张图片不超过 500KB

## 获取图片

### 方式1：使用免费图片网站
- Unsplash (https://unsplash.com/)
- Pexels (https://www.pexels.com/)
- Pixabay (https://pixabay.com/)

搜索关键词：
- Chinese food
- Sichuan cuisine  
- Noodles
- Rice bowl
- Chinese snacks

### 方式2：使用占位图片服务
临时开发可以使用：
- https://picsum.photos/800/600 (随机图片)
- https://via.placeholder.com/800x600 (占位图)

### 方式3：使用默认图片
如果某些菜品暂时没有图片，系统会使用默认图片。

## 文件命名规范

按照上面的映射表命名，例如：
- 宫保鸡丁 → gongbao_jiding.jpg
- 麻婆豆腐 → mapo_tofu.jpg
- 牛肉拉面 → beef_noodles.jpg

## 快速准备图片（开发阶段）

在开发阶段，你可以：
1. 创建一个默认图片 default.png
2. 复制该图片到所有需要的文件名
3. 之后再逐步替换为真实图片

\`\`\`bash
# Windows PowerShell
$files = @("gongbao_jiding.jpg", "mapo_tofu.jpg", "beef_noodles.jpg", ...)
foreach ($file in $files) {
    Copy-Item "default.png" $file
}
\`\`\`

## 图片优化建议

上传前请优化图片：
- 使用 TinyPNG (https://tinypng.com/) 压缩图片
- 调整尺寸为合适的显示大小
- 转换为 WebP 格式以获得更好的性能
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`✅ 生成图片说明文件: ${readmePath}`);

// 创建默认占位图片（纯色SVG）
const defaultSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f5f5f5"/>
  <text x="400" y="280" font-family="Arial" font-size="48" fill="#999" text-anchor="middle">美食图片</text>
  <text x="400" y="340" font-family="Arial" font-size="24" fill="#ccc" text-anchor="middle">Food Image Placeholder</text>
</svg>`;

const defaultSvgPath = path.join(imagePath, 'default.svg');
fs.writeFileSync(defaultSvgPath, defaultSvg);
console.log(`✅ 生成默认占位图: ${defaultSvgPath}`);

// 输出菜品图片映射JSON（供前端使用）
const mappingJsonPath = path.join(imagePath, 'food-image-mapping.json');
fs.writeFileSync(mappingJsonPath, JSON.stringify(foodImages, null, 2));
console.log(`✅ 生成图片映射文件: ${mappingJsonPath}`);

console.log('\n📋 菜品图片准备完成！');
console.log('\n下一步操作：');
console.log('1. 请到以下网站下载真实的菜品图片：');
console.log('   - Unsplash: https://unsplash.com/s/photos/chinese-food');
console.log('   - Pexels: https://www.pexels.com/search/chinese%20food/');
console.log('\n2. 将下载的图片按照映射表重命名');
console.log(`\n3. 放置到目录: ${imagePath}`);
console.log('\n4. 或者使用默认占位图进行开发测试');
console.log('\n提示：开发阶段可以先使用占位图，答辩前再替换真实图片。');
