/*
 * 路由模块
 */
const express = require('express');
const router = express.Router();
const service = require('./service.js');

//路由处理
router.get('/', service.showIndex);

// 登录 电商后台管理系统
router.post('/api/private/v1/login',service.login);

// 获取左侧 菜单数据
router.get('/api/private/v1/menus',service.menus);

// 获取用户列表数据
router.get('/api/private/v1/users',service.getUserList);

// 修改用户状态数据
router.put('/api/private/v1/users/:uID/state/:status',service.toEditUserState);

// 根据 ID 查询用户信息
router.get('/api/private/v1/users/:id', service.getUserListById)

// 添加用户
router.post('/api/private/v1/users', service.addUser)

// 修改用户   
router.put('/api/private/v1/users/:id', service.editUser)

// 删除单个用户
router.delete('/api/private/v1/users/:id', service.deleteUser)

// 获取权限列表
router.get('/api/private/v1/rights/:type', service.getRightsList)

// router.get('/books/users/:id',service.editBook);

// router.delete('/books/book/:id',service.toDelBook);

//导出路由
module.exports = router;
