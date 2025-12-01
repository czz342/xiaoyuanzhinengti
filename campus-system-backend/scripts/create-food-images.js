/**
 * 创建菜品占位图片
 */
const fs = require('fs');
const path = require('path');

// 菜品图片映射（使用网络图片URL作为占位）
const foodImageUrls = {
  // 川菜
  '麻婆豆腐': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '宫保鸡丁': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '鱼香肉丝': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '水煮鱼': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '回锅肉': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '口水鸡': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  
  // 湘菜
  '剁椒鱼头': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '毛血旺': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '湘式小炒肉': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '糖醋排骨': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '农家小炒': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  
  // 粤菜
  '白切鸡': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '蒸蛋羹': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '广式烧鸭': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '清蒸鲈鱼': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '蜜汁叉烧': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  
  // 快餐
  '红烧肉盖饭': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '鸡腿饭': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '青椒肉丝盖饭': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '西红柿鸡蛋盖饭': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '土豆丝盖饭': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  
  // 面食
  '兰州拉面': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '西红柿鸡蛋面': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '炸酱面': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '牛肉面': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '刀削面': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '酸辣粉': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  
  // 素食
  '地三鲜': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '干煸豆角': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '清炒菠菜': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '蒜蓉西兰花': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  
  // 小吃
  '煎饺': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '小笼包': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '锅贴': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '烧饼': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '豆浆油条': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  
  // 西餐
  '意大利面': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '牛排': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '汉堡': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '披萨': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '沙拉': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  
  // 家常菜
  '红烧肉': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '糖醋里脊': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '番茄炒蛋': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '土豆丝': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '青椒肉丝': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  
  // 烧烤
  '烤羊肉串': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '烤鸡翅': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '烤茄子': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '烤玉米': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '烤鱼': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  
  // 饮品
  '珍珠奶茶': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop',
  '柠檬蜂蜜茶': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  '鲜榨橙汁': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  '绿豆沙': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  '咖啡': 'https://images.unsplash.com/photo-1565299585323-38174c6a3b7e?w=400&h=300&fit=crop'
};

async function createFoodImages() {
  try {
    console.log('🖼️ 创建菜品图片资源...\n');
    
    // 1. 确保图片目录存在
    const imageDir = path.join(__dirname, '../../public/static/images/FoodList');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
      console.log('✅ 创建图片目录:', imageDir);
    }
    
    // 2. 创建图片映射文件
    const mappingContent = `# 菜品图片映射表

## 使用说明
1. 这是菜品名称与图片URL的映射表
2. 开发阶段可以使用这些占位图片URL
3. 生产环境建议下载真实菜品图片并放置到对应路径

## 图片映射

${Object.entries(foodImageUrls).map(([name, url]) => `- **${name}**: ${url}`).join('\n')}

## 图片规格建议
- 尺寸: 400x300px
- 格式: JPG/PNG
- 大小: < 200KB
- 命名: 使用菜品名称.jpg

## 批量下载脚本示例
\`\`\`bash
# 使用curl批量下载（示例）
${Object.entries(foodImageUrls).slice(0, 3).map(([name, url]) => 
`curl "${url}" -o "${name}.jpg"`).join('\n')}
\`\`\`
`;
    
    const mappingFile = path.join(imageDir, 'IMAGE_MAPPING.md');
    fs.writeFileSync(mappingFile, mappingContent, 'utf8');
    console.log('✅ 生成图片映射文件:', mappingFile);
    
    // 3. 创建默认占位图说明
    const placeholderContent = `# 菜品图片占位符

当前使用网络图片作为占位符。

## 在线图片源
- Unsplash: 高质量食物图片
- 尺寸: 400x300px
- 自动裁剪适配

## 替换为本地图片
1. 下载真实菜品图片
2. 重命名为对应的菜品名称
3. 放置到此目录下
4. 更新数据库中的image字段路径

## 当前占位图片数量
总计: ${Object.keys(foodImageUrls).length} 张

## 图片清单
${Object.keys(foodImageUrls).map((name, index) => `${index + 1}. ${name}.jpg`).join('\n')}
`;
    
    const placeholderFile = path.join(imageDir, 'README.md');
    fs.writeFileSync(placeholderFile, placeholderContent, 'utf8');
    console.log('✅ 生成占位图说明:', placeholderFile);
    
    // 4. 创建图片下载脚本
    const downloadScript = `#!/bin/bash
# 菜品图片批量下载脚本

echo "开始下载菜品图片..."
cd "$(dirname "$0")"

${Object.entries(foodImageUrls).map(([name, url], index) => 
`echo "下载 ${index + 1}/${Object.keys(foodImageUrls).length}: ${name}"
curl -L "${url}" -o "${name}.jpg" --silent --show-error`).join('\n')}

echo "图片下载完成！"
echo "共下载 ${Object.keys(foodImageUrls).length} 张图片"
`;
    
    const scriptFile = path.join(imageDir, 'download_images.sh');
    fs.writeFileSync(scriptFile, downloadScript, 'utf8');
    console.log('✅ 生成下载脚本:', scriptFile);
    
    console.log('\n📊 统计信息:');
    console.log(`   - 图片映射: ${Object.keys(foodImageUrls).length} 个`);
    console.log(`   - 目录路径: ${imageDir}`);
    console.log(`   - 映射文件: IMAGE_MAPPING.md`);
    console.log(`   - 说明文件: README.md`);
    console.log(`   - 下载脚本: download_images.sh`);
    
    console.log('\n🎯 下一步操作:');
    console.log('1. 查看生成的映射文件了解图片对应关系');
    console.log('2. 可选：运行下载脚本获取占位图片');
    console.log('3. 可选：替换为真实菜品图片');
    console.log('4. 重启前端应用查看效果');
    
    console.log('\n🎉 菜品图片资源创建完成！');
    
  } catch (error) {
    console.error('❌ 创建图片资源失败:', error);
    throw error;
  }
}

if (require.main === module) {
  createFoodImages()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { createFoodImages };
