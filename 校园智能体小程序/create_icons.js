const fs = require('fs');
const path = require('path');

// 图标列表
const icons = [
  'assistant.png',
  'assistant-active.png',
  'services.png',
  'services-active.png',
  'personal.png',
  'personal-active.png',
  // 添加其他需要的图标
  'arrow-left.png',
  'arrow-right.png',
  'close.png',
  'filter.png',
  'scan.png',
  'search.png',
  'zoom-in.png',
  'zoom-out.png',
  'rotate.png',
  'projector.png',
  'computer.png',
  'ac.png',
  'steps.png',
  'sleep.png',
  'weight.png',
  'heart.png',
  'medical.png',
  'psychology.png',
  'examination.png',
  'emergency.png',
  'wallet.png',
  'credits.png',
  'awards.png',
  'certificates.png',
  'feedback.png',
  'settings.png',
  'privacy.png',
  'about.png',
  'qrcode.png',
  'refresh.png',
  'save.png',
  'health-banner.png',
  'notification-system.png',
  'notification-course.png',
  'notification-activity.png',
  'avatar.png',
  'personal-qrcode.png'
];

// 创建 1x1 像素的 PNG buffer
function createDummyPngBuffer(color) {
  // PNG 文件头
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG 签名
    0x00, 0x00, 0x00, 0x0D, // IHDR 块长度 (13)
    0x49, 0x48, 0x44, 0x52, // IHDR 块类型
    0x00, 0x00, 0x00, 0x30, // 宽度 (48 像素)
    0x00, 0x00, 0x00, 0x30, // 高度 (48 像素)
    0x08, // 位深度 (8)
    0x06, // 颜色类型 (RGBA)
    0x00, // 压缩方法 (deflate)
    0x00, // 过滤方法 (标准)
    0x00, // 隔行扫描方法 (无)
    0x00, 0x00, 0x00, 0x00, // IHDR CRC32 (占位)
  ]);
  
  // 创建一个简单的 48x48 纯色 PNG 图片数据
  // 为了简单，我们不计算真正的 CRC 校验码，而是用一个简化版本
  const width = 48;
  const height = 48;
  const colorData = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 生成一个简单的图案
      colorData.push(color.r); // R
      colorData.push(color.g); // G
      colorData.push(color.b); // B
      colorData.push(255);    // Alpha (不透明)
    }
  }
  
  // 数据长度
  const dataLength = width * height * 4;
  
  // 简化的末尾数据
  const footer = Buffer.from([
    0x00, 0x00, 0x00, 0x00, // 占位符
    0x49, 0x45, 0x4E, 0x44, // IEND 块类型
    0xAE, 0x42, 0x60, 0x82  // IEND CRC32
  ]);
  
  return Buffer.concat([
    header,
    Buffer.from([0x00, 0x00, 0x00, dataLength]), // IDAT 块长度
    Buffer.from([0x49, 0x44, 0x41, 0x54]),      // IDAT 块类型
    Buffer.from(colorData),                     // 图像数据
    footer
  ]);
}

// 确保目录存在
const imagesDir = path.join(__dirname, 'static', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 生成图标文件
icons.forEach(icon => {
  const iconPath = path.join(imagesDir, icon);
  
  // 如果图标已存在，跳过
  if (fs.existsSync(iconPath)) {
    console.log(`图标 ${icon} 已存在，跳过`);
    return;
  }
  
  // 根据图标名称生成不同颜色
  let color;
  
  if (icon.includes('-active')) {
    // 激活状态的图标用蓝色
    color = { r: 0, g: 122, b: 255 };
  } else if (icon.includes('assistant')) {
    color = { r: 52, g: 152, b: 219 };
  } else if (icon.includes('services')) {
    color = { r: 46, g: 204, b: 113 };
  } else if (icon.includes('personal')) {
    color = { r: 155, g: 89, b: 182 };
  } else if (icon.includes('banner')) {
    // banner 图片稍大一些，使用淡蓝色
    color = { r: 100, g: 181, b: 246 };
  } else {
    // 其他图标使用灰色
    color = { r: 149, g: 165, b: 166 };
  }
  
  // 创建并写入图标文件
  const buffer = createDummyPngBuffer(color);
  fs.writeFileSync(iconPath, buffer);
  
  console.log(`创建图标: ${icon}`);
});

console.log('所有图标创建完成！'); 