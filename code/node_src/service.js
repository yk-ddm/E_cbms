/*
 * 业务模块（处理一些操作增删改查）
 */
//数据
const db = require('./db.js');
// 导入 crypto   md5 加密
const crypto = require('crypto')

// 进行密码加密
function my_md5(initPwd) {
    // 创建哈希加密算法
    var md5 = crypto.createHash('md5')
    var password = md5.update(initPwd).digest('base64')
    return password
}

//test 测试
exports.showIndex = (req, res) => {
    //let id = req.params.id;
    let sql = 'select * from user';
    // let sql = 'insert into book set ?';

    let data = null;

    db.base(sql, data, (results) => {
        /*console.log('原始数据加密结果：Y6nw6nu5gFB5a2SehUgYRQ==')
        console.log('原始数据加密结果：' + my_md5('root'))
        console.log('原始数据二次加密结果：' + my_md5(my_md5('root')))
        console.log('原始数据三次加密结果：' + my_md5(my_md5(my_md5('root'))))
        console.log('原始数据三次强加密结果：' + my_md5(my_md5(my_md5('root') + 'SecondEncryption') + 'ThirdEncryption'))*/
        res.json(results);
    });
}

// 登录  获取登录用户名  密码  post
exports.login = (req, res) => {
    //获取数据
    let info = req.body;

    // console.log('加密前的数据：' + JSON.stringify(info))
    info.password = my_md5(my_md5(my_md5(info.password) + 'SecondEncryption') + 'ThirdEncryption')
    // console.log('加密后的数据：' + JSON.stringify(info))
    let sql = 'select * from user where username = ? and password = ? and is_active = 1';

    let data = [info.username, info.password];

    db.base(sql, data, (results) => {
        data = null
        if (!results.length) {
            data = {
                data: null,
                meta: {
                    msg: '用户名不存在',
                    status: 400
                }
            }
        } else {
            const {
                id,
                role_id,
                username,
                mobile,
                email
            } = results[0]
            let token = my_md5(my_md5(my_md5('token' + new Date()) + 'SecondEncryption') + 'ThirdEncryption')
            data = {
                data: {
                    id: id,
                    role_id: role_id,
                    username: username,
                    mobile: mobile,
                    email: email,
                    token: token
                },
                meta: {
                    msg: '登录成功',
                    status: 200
                }
            }
        }
        res.json(data)
    });

}

//  获取左侧 菜单数据  get
exports.menus = (req, res) => {
    let sql = 'select * from menu';
    let data = null;

    db.base(sql, data, (results) => {
        data = {}
        if (!results.length) {
            data = {
                data: null,
                meta: {
                    msg: '菜单列表获取失败！',
                    status: 400
                }
            }
        } else {
            data.data = []
            results.forEach(item => {
                item.children = []
                if (!item.parent_id) {
                    let children = []
                    results.forEach(subItem => {
                        if (item.id === subItem.parent_id && !item.parent_id) children.push({
                            id: subItem.id,
                            authName: subItem.authName,
                            path: subItem.path,
                            children: []
                        })
                    })

                    data.data.push({
                        id: item.id,
                        authName: item.authName,
                        path: item.path,
                        children: children
                    })
                }
            })

            let meta = {
                msg: '菜单列表获取成功！',
                status: 200
            }
            data.meta = meta
        }
        res.json(data)
    })
}

//  获取用户列表数据  get
exports.getUserList = (req, res) => {
    let query = req.query.query
    let pagenum = parseInt(req.query.pagenum)
    let pagesize = parseInt(req.query.pagesize)

    //  ctrl + k ctrl + u  取消注释
    let sql = 'SELECT user.id, username, role_name, mobile, email, mg_state, totalpage FROM USER, role, (SELECT SUM(is_active) AS totalpage FROM USER WHERE is_active = 1) temp ' +
        'where is_active = 1 and user.role_id = role.id limit ?, ?';
    let data = [(pagenum - 1) * pagesize, pagesize];
    if (query !== '') {
        sql = 'SELECT user.id, username, role_name, mobile, email, mg_state, totalpage FROM USER, role, (SELECT SUM(is_active) AS totalpage FROM USER WHERE is_active = 1) temp ' +
            'where is_active = 1 and user.role_id = role.id and username like ? limit ?, ?';
        data = ['%' + query + '%', (pagenum - 1) * pagesize, pagesize];
    }

    db.base(sql, data, (results) => {
        data = {}
        if (!results.length) {
            data = {
                data: null,
                meta: {
                    msg: '用户列表获取失败！',
                    status: 401
                }
            }
        } else {
            let totalpage = 0
            let users = []
            results.forEach(item => {
                totalpage = item.totalpage
                users.push({
                    id: item.id,
                    role_id: item.role_id,
                    username: item.username,
                    mobile: item.mobile,
                    email: item.email,
                    mg_state: item.mg_state ? true : false,
                    role_name: item.role_name
                })

            })
            data = {
                data: {
                    totalpage: totalpage,
                    pagenum: pagenum,
                    users: users
                },
                meta: {
                    msg: '用户列表获取成功！',
                    status: 200
                }
            }
        }
        res.json(data)
    });
}

// 修改用户状态数据  put
exports.toEditUserState = (req, res) => {
    let user_id = req.params.uID
    let user_state = req.params.status
    let sql = 'UPDATE USER SET mg_state = ? WHERE id = ?';
    let data = [user_state, user_id];

    db.base(sql, data, (results) => {
        data = {}
        if (results.affectedRows == 1) {
            sql = 'select id, role_id, username, mobile, email, mg_state from user where id = ?';
            data = [user_id]
            db.base(sql, data, (subResults) => {
                data = {}
                if (!subResults.length) {
                    data = {
                        data: null,
                        meta: {
                            msg: '用户状态设置失败！',
                            status: 401
                        }
                    }
                } else {
                    const {
                        id,
                        role_id,
                        username,
                        mobile,
                        email,
                        mg_state
                    } = subResults[0]
                    data = {
                        data: {
                            id: id,
                            role_id: role_id,
                            username: username,
                            mobile: mobile,
                            email: email,
                            mg_state: mg_state
                        },
                        meta: {
                            msg: '用户状态设置成功！',
                            status: 200
                        }
                    }
                }
                res.json(data)
            })
        }
    });
}

// 根据 ID 查询用户信息  get
exports.getUserListById = (req, res) => {
    //  get 方式  params
    let sql = 'select * from user where is_active = 1 and id = ?';
    let data = [req.params.id];

    db.base(sql, data, (results) => {
        data = {}
        if (!results.length) {
            data = {
                data: null,
                meta: {
                    msg: '用户信息查询失败！',
                    status: 401
                }
            }
        } else {
            const {
                id,
                role_id,
                username,
                mobile,
                email,
                mg_state
            } = results[0]
            data = {
                data: {
                    id: id,
                    role_id: role_id,
                    username: username,
                    mobile: mobile,
                    email: email,
                    mg_state: mg_state
                },
                meta: {
                    msg: '用户信息查询成功！',
                    status: 200
                }
            }
        }
        res.json(data)
    })
}

//  添加用户  post
exports.addUser = (req, res) => {
    let username = req.body.username
    let password = my_md5(my_md5(my_md5(req.body.password) + 'SecondEncryption') + 'ThirdEncryption')
    let email = req.body.email
    let mobile = req.body.mobile

    let sql = 'INSERT INTO USER(username, password, mobile, email) VALUES(?, ?, ?, ?)';
    // let sql = 'update USER set username = ?, password = ?, mobile = ?, email = ?, role_id = 2 where id = 4';
    let data = [username, password, mobile, email];

    db.base(sql, data, (results) => {
        if (results.affectedRows == 1) {
            sql = 'select id, role_id, username, mobile, email, mg_state from user where id = (select sum(id) as id from user where is_active = 1)';
            data = null
            db.base(sql, data, (subResults) => {
                data = {}
                if (!subResults.length) {
                    data = {
                        data: null,
                        meta: {
                            msg: '用户创建失败！',
                            status: 401
                        }
                    }
                } else {
                    const {
                        id,
                        role_id,
                        username,
                        mobile,
                        email,
                        mg_state
                    } = subResults[0]
                    data = {
                        data: {
                            id: id,
                            role_id: role_id,
                            username: username,
                            mobile: mobile,
                            email: email,
                            mg_state: mg_state
                        },
                        meta: {
                            msg: '用户创建成功！',
                            status: 201
                        }
                    }
                }
                res.json(data)
            })
        }
    });
}

//  编辑用户  put
exports.editUser = (req, res) => {
    let user_id = parseInt(req.params.id)
    let email = req.body.email
    let mobile = req.body.mobile
    let sql = 'UPDATE USER SET email = ?, mobile = ? WHERE id = ?';
    let data = [email, mobile, user_id];

    db.base(sql, data, (results) => {
        if (results.affectedRows == 1) {
            sql = 'select id, role_id, username, mobile, email from user where id = ?';
            data = [user_id]
            db.base(sql, data, (subResults) => {
                data = {}
                if (!subResults.length) {
                    data = {
                        data: null,
                        meta: {
                            msg: '用户修改失败！',
                            status: 401
                        }
                    }
                } else {
                    const {
                        id,
                        role_id,
                        username,
                        mobile,
                        email
                    } = subResults[0]
                    data = {
                        data: {
                            id: id,
                            role_id: role_id,
                            username: username,
                            mobile: mobile,
                            email: email
                        },
                        meta: {
                            msg: '更新成功！',
                            status: 200
                        }
                    }
                }
                res.json(data)
            })
        }
    });
}

// 删除单个用户  delete 
exports.deleteUser = (req, res) => {
    let user_id = req.params.id
    let sql = 'update USER set is_active = 0 WHERE id = ?';
    let data = [user_id];

    db.base(sql, data, (results) => {
        if (results.affectedRows == 1) {
            data = {
                data: null,
                meta: {
                    msg: '删除成功！',
                    status: 200
                }
            }
        } else {
            data = {
                data: null,
                meta: {
                    msg: '删除失败！',
                    status: 401
                }
            }
        }
        res.json(data)
    })
}

// 获取所有权限列表  get
exports.getRightsList = (req, res) => {
    // console.log(req.params.type)

    let sql = 'select * from user where is_active = 1';
    let data = null;

    db.base(sql, data, (results) => {
        data = {}
        if (!results.length) {
            data = {
                data: null,
                meta: {
                    msg: '用户信息查询失败！',
                    status: 401
                }
            }
        } else {
            const {
                id,
                role_id,
                username,
                mobile,
                email,
                mg_state
            } = results[0]
            data = {
                data: {
                    id: id,
                    role_id: role_id,
                    username: username,
                    mobile: mobile,
                    email: email,
                    mg_state: mg_state
                },
                meta: {
                    msg: '用户信息查询成功！',
                    status: 200
                }
            }
        }
        res.json(data)
    })
}

/*
//修改图书（提交修改数据）
exports.editBook = (req,res) => {
    //获取数据
    let info = req.body;

    let sql = 'update book set name=?,author=?,category=?,description=? where id=?';
	let data = [info.name,info.author,info.category,info.desc,info.id];

    db.base(sql,data,(results) => {
		if(results.affectedRows == 1){
			res.json({ flag : 1 });			
		}
    });
}

//删除图书
exports.toDelBook = (req,res) => {
	//获取数据
    let id = req.params.id;

    let sql = 'delete from book where id=?';
	let data = [id];

    db.base(sql,data,(results) => {
		if(results.affectedRows == 1){
			res.json({ flag : 1 });			
		}
    });
}
*/