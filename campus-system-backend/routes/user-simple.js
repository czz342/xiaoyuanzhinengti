const express = require('express');
const router = express.Router();

const mockUsers = [
    { id: 1, user_id: 'U001', username: 'zhangsan', display_name: '张三' },
    { id: 2, user_id: 'U002', username: 'lisi', display_name: '李四' }
];

router.get('/', (req, res) => {
    res.json({ success: true, message: '获取用户列表成功', data: mockUsers });
});

module.exports = router;
