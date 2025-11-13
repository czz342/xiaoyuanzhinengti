const { query } = require('../config/database');

/**
 * 将状态枚举值转换为中文
 */
function formatStatus(status) {
    const statusMap = {
        'available': '可用',
        'maintenance': '维护中',
        'occupied': '占用'
    };
    return statusMap[status] || status;
}

/**
 * 将设备JSON数组转换为空格分隔的字符串
 */
function formatEquipment(equipmentJson) {
    if (!equipmentJson) {
        return '';
    }
    
    try {
        // 尝试解析JSON
        let equipmentList = [];
        if (typeof equipmentJson === 'string') {
            equipmentList = JSON.parse(equipmentJson);
        } else if (Array.isArray(equipmentJson)) {
            equipmentList = equipmentJson;
        }
        
        // 如果是数组，用空格连接
        if (Array.isArray(equipmentList)) {
            return equipmentList.join(' ');
        }
        
        return equipmentJson.toString();
    } catch (e) {
        // 如果不是JSON格式，直接返回原值
        return equipmentJson.toString();
    }
}

/**
 * 导出教室数据
 */
async function exportClassroomData() {
    try {
        console.log('开始导出教室数据...\n');
        
        // 查询所有教室
        const sql = `
            SELECT code, name, building, floor, capacity, status, equipment, isActive
            FROM classrooms
            WHERE isActive = TRUE
            ORDER BY building, floor, code
        `;
        
        const classrooms = await query(sql);
        
        if (classrooms.length === 0) {
            console.log('❌ 未找到教室数据');
            return;
        }
        
        console.log('教室数据导出结果：\n');
        console.log('序号\t教室编号\t教室名称\t所在教学楼\t所在楼层\t容量\t长期状态\t设备列表');
        console.log('='.repeat(100));
        
        classrooms.forEach((classroom, index) => {
            const serialNumber = index + 1;
            const code = classroom.code || '';
            const name = classroom.name || '';
            const building = classroom.building || '';
            // 格式化楼层：如果已经是"X楼"格式则保持，否则添加"楼"
            let floor = classroom.floor || '';
            if (floor && !floor.includes('楼')) {
                floor = floor + '楼';
            }
            const capacity = classroom.capacity || 0;
            const status = formatStatus(classroom.status || 'available');
            const equipment = formatEquipment(classroom.equipment || '');
            
            console.log(
                `${serialNumber}\t${code}\t${name}\t${building}\t${floor}\t${capacity}\t${status}\t${equipment}`
            );
        });
        
        console.log('\n' + '='.repeat(100));
        console.log(`\n✅ 共导出 ${classrooms.length} 条教室数据`);
        
        // 同时输出为Markdown表格格式（方便复制）
        console.log('\n\n--- Markdown表格格式 ---\n');
        console.log('| 序号 | 教室编号 | 教室名称 | 所在教学楼 | 所在楼层 | 容量 | 长期状态 | 设备列表 |');
        console.log('|------|----------|----------|------------|----------|------|----------|----------|');
        
        classrooms.forEach((classroom, index) => {
            const serialNumber = index + 1;
            const code = classroom.code || '';
            const name = classroom.name || '';
            const building = classroom.building || '';
            // 格式化楼层：如果已经是"X楼"格式则保持，否则添加"楼"
            let floor = classroom.floor || '';
            if (floor && !floor.includes('楼')) {
                floor = floor + '楼';
            }
            const capacity = classroom.capacity || 0;
            const status = formatStatus(classroom.status || 'available');
            const equipment = formatEquipment(classroom.equipment || '');
            
            console.log(
                `| ${serialNumber} | ${code} | ${name} | ${building} | ${floor} | ${capacity} | ${status} | ${equipment} |`
            );
        });
        
    } catch (error) {
        console.error('❌ 导出失败:', error);
        throw error;
    }
}

// 执行导出
if (require.main === module) {
    exportClassroomData()
        .then(() => {
            console.log('\n✅ 导出完成');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ 导出失败:', error);
            process.exit(1);
        });
}

module.exports = { exportClassroomData };

