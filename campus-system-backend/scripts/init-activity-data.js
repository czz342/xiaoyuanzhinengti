const { query } = require('../config/database');
const Activity = require('../models/Activity');
const ActivityParticipant = require('../models/ActivityParticipant');
const UserPoints = require('../models/UserPoints');
const UserCredibility = require('../models/UserCredibility');

async function initActivityData() {
    try {
        console.log('开始初始化活动中心数据...');

        // 创建表
        await Activity.createTable();
        await ActivityParticipant.createTable();
        await UserPoints.createTable();
        await UserCredibility.createTable();

        console.log('✅ 数据表创建完成');

        // 清理旧数据
        console.log('🧹 清理旧数据...');
        await query('DELETE FROM activity_participants');
        await query('DELETE FROM activities');
        await query('DELETE FROM user_points');
        await query('DELETE FROM user_credibility');
        console.log('✅ 旧数据清理完成');

        // 插入示例活动数据
        const sampleActivities = [
            {
                title: '校园摄影大赛',
                description: '用镜头记录校园美好瞬间，展现青春风采。参赛作品需为校园内拍摄，主题积极向上。',
                image_url: '/static/images/activity/校园摄影大赛.png',
                club_id: 1,
                club_name: '摄影社',
                start_time: '2025-09-05 09:00:00',
                end_time: '2025-09-05 17:00:00',
                location: '艺术楼展厅',
                max_participants: 50,
                points_reward: 20,
                min_credibility: 6.0,
                status: 'published',
                is_featured: true,
                created_by: 'admin'
            },
            {
                title: '编程马拉松',
                description: '24小时编程挑战赛，团队协作完成创新项目。提供技术指导和奖品。',
                image_url: '/static/images/activity/编程马拉松.png',
                club_id: 2,
                club_name: '计算机协会',
                start_time: '2025-09-06 08:00:00',
                end_time: '2025-09-07 08:00:00',
                location: '计算机学院实验室',
                max_participants: 30,
                points_reward: 50,
                min_credibility: 7.0,
                status: 'published',
                is_featured: true,
                created_by: 'admin'
            },
            {
                title: '环保志愿活动',
                description: '校园环保宣传和清洁活动，提高环保意识，共建绿色校园。',
                image_url: '/static/images/activity/环保志愿活动.png',
                club_id: 3,
                club_name: '环保社',
                start_time: '2025-09-08 14:00:00',
                end_time: '2025-09-08 18:00:00',
                location: '校园广场',
                max_participants: 100,
                points_reward: 15,
                min_credibility: 5.0,
                status: 'published',
                is_featured: true,
                created_by: 'admin'
            },
            {
                title: '英语角活动',
                description: '每周英语口语交流活动，提高英语表达能力，结交国际朋友。',
                image_url: '/static/images/activity/英语角.png',
                club_id: 4,
                club_name: '英语协会',
                start_time: '2025-09-09 19:00:00',
                end_time: '2025-09-09 21:00:00',
                location: '外语学院教室',
                max_participants: 40,
                points_reward: 10,
                min_credibility: 4.0,
                status: 'published',
                is_featured: false,
                created_by: 'admin'
            },
            {
                title: '篮球友谊赛',
                description: '学院间篮球友谊赛，展现运动风采，增进友谊。',
                image_url: '/static/images/activity/篮球比赛.png',
                club_id: 5,
                club_name: '篮球社',
                start_time: '2025-09-10 15:00:00',
                end_time: '2025-09-10 18:00:00',
                location: '体育馆篮球场',
                max_participants: 20,
                points_reward: 25,
                min_credibility: 6.5,
                status: 'published',
                is_featured: true,
                created_by: 'admin'
            },
            {
                title: '读书分享会',
                description: '分享最近阅读的好书，交流读书心得，营造书香校园氛围。',
                image_url: '/static/images/activity/读书会.png',
                club_id: 6,
                club_name: '读书社',
                start_time: '2025-09-12 19:30:00',
                end_time: '2025-09-12 21:30:00',
                location: '图书馆报告厅',
                max_participants: 60,
                points_reward: 12,
                min_credibility: 5.5,
                status: 'published',
                is_featured: false,
                created_by: 'admin'
            }
        ];

        for (const activityData of sampleActivities) {
            await Activity.create(activityData);
        }

        console.log('✅ 示例活动数据插入完成');

        // 为现有用户初始化积分和诚信度
        const users = await query('SELECT id FROM users LIMIT 10');
        for (const user of users) {
            await UserPoints.initUserPoints(user.id, 50);
            await UserCredibility.initUserCredibility(user.id);
        }

        console.log('✅ 用户积分和诚信度初始化完成');

        // 模拟一些用户参与活动
        const activities = await Activity.list({ limit: 6 });
        const userIds = users.map(u => u.id);

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            const participants = userIds.slice(0, Math.floor(Math.random() * 10) + 5);
            
            for (const userId of participants) {
                try {
                    await ActivityParticipant.join(activity.id, userId);
                    await Activity.updateParticipantCount(activity.id, 1);
                    
                    // 模拟参与结果
                    const behaviors = ['attended', 'late', 'absent'];
                    const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
                    
                    if (behavior === 'attended') {
                        await ActivityParticipant.markAttended(activity.id, userId, activity.points_reward);
                        await UserPoints.addPoints(userId, activity.points_reward, `参与活动: ${activity.title}`);
                    } else if (behavior === 'late') {
                        await ActivityParticipant.markAttended(activity.id, userId, Math.floor(activity.points_reward * 0.8));
                        await UserPoints.addPoints(userId, Math.floor(activity.points_reward * 0.8), `参与活动(迟到): ${activity.title}`);
                    } else {
                        await ActivityParticipant.markAbsent(activity.id, userId);
                    }
                    
                    await UserCredibility.updateCredibility(userId, behavior);
                } catch (err) {
                    // 忽略重复参与错误
                }
            }
        }

        console.log('✅ 模拟参与数据创建完成');

        console.log('🎉 活动中心数据初始化完成！');
        console.log('📊 数据统计:');
        console.log(`   - 活动数量: ${activities.length}`);
        console.log(`   - 用户数量: ${users.length}`);
        console.log(`   - 参与记录: ${await query('SELECT COUNT(*) as count FROM activity_participants').then(r => r[0].count)}`);

    } catch (error) {
        console.error('❌ 初始化活动中心数据失败:', error);
        throw error;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    initActivityData()
        .then(() => {
            console.log('✅ 活动中心数据初始化完成');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ 初始化失败:', error);
            process.exit(1);
        });
}

module.exports = initActivityData;
