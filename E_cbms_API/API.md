# 电商后台管理系统  后台 API 接口文档

## API V1 接口说明

* 接口根地址：`http://127.0.0.1:3000/api/private/v1/`
* 服务端已开启 CORS 跨域支持
* API V1 认证统一使用Token 认证
* 需要授权的API,  必须在请求头中使用 `Authorization` 字段 提供 `token`令牌
* 使用 HTTP Status Code 标识状态
* 数据返回格式统一使用 JSON

## 支持的请求方法

* GET（select）: 从服务器取出资源（一项或多项）
* POST( create ) ：在服务器新建一个资源
* PUT（update）：在服务器更新资源（客户端提供改变后的完整资源）
* PATCH（update）：在服务器更新资源（客户端提供改变的属性）
* DELETE（delete）：从服务器删除资源
* HEAD：获取资源的元数据
* OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的

## 通用返回状态说明

| 状态码 | 含义                  | 说明                                               |
| :----: | --------------------- | -------------------------------------------------- |
|  200   | ok                    | 请求成功                                           |
|  201   | created               | 创建成功                                           |
|  204   | deleted               | 删除成功                                           |
|  400   | bad request           | 请求的地址不存在或者包含不支持的参数               |
|  401   | unauthorized          | 未授权                                             |
|  403   | forbidden             | 被禁止访问                                         |
|  404   | not found             | 请求的资源不存在                                   |
|  422   | unprocessable entity  | [POST/PUT/PATCH]当创建一个对象时，发生一个验证错误 |
|  500   | internal server error | 内部错误                                           |
|        |                       |                                                    |

---

## 登录

### 登录验证接口

* 请求路径：login
* 请求方法：post
* 请求参数

| 参数名   | 参数说明 | 备注     |
| -------- | -------- | -------- |
| username | 用户名   | 不能为空 |
| password | 密码     | 不能为空 |

* 响应参数

| 参数名   | 参数说明   | 备注            |
| -------- | ---------- | --------------- |
| id       | 用户ID     |                 |
| rid      | 用户角色ID |                 |
| username | 用户名     |                 |
| mobile   | 手机号     |                 |
| email    | 邮箱       |                 |
| token    | 令牌       | 基于 jwt 的令牌 |
|          |            |                 |

* 响应数据

```
{
  "data": {
    "id": 1,
    "rid": 2,
    "username": "admin",
    "mobile": "137",
    "email": "17158577",
    "token": "BAcOFQqQ9HefmfL4TscJjA=="
  },
  "meta": {
    "msg": "登录成功",
    "status": 200
  }
}
```



## 用户管理

### 用户数据列表

* 请求路径：users
* 请求方法：get
* 请求参数

| 参数名   | 参数说明     | 备注     |
| -------- | ------------ | -------- |
| query    | 查询参数     | 可以为空 |
| pagenum  | 当前页码     | 不能为空 |
| pagesize | 每页显示条数 | 不能为空 |

* 响应参数

| 参数名    | 参数说明     | 备注 |
| --------- | ------------ | ---- |
| totalpage | 总记录数     |      |
| pagenum   | 当前页码     |      |
| users     | 用户数据集合 |      |

* 响应数据

```
{
  "data": {
    "totalpage": 3,
    "pagenum": 1,
    "users": [
      {
        "id": 1,
        "role_id": 1,
        "username": "admin",
        "mobile": "137",
        "email": "17158577",
        "mg_state": 1
      },
      {
        "id": 2,
        "role_id": 2,
        "username": "test",
        "mobile": "1245",
        "email": "45785",
        "mg_state": 1
      }
    ]
  },
  "meta": {
    "msg": "用户列表获取成功！",
    "status": 200
  }
}
```



### 添加用户

* 请求路径：users
* 请求方法：post
* 请求参数

| 参数名   | 参数说明 | 备注     |
| -------- | -------- | -------- |
| username | 用户名称 | 不能为空 |
| password | 用户密码 | 不能为空 |
| email    | 邮箱     | 可以为空 |
| mobile   | 手机号   | 可以为空 |

* 响应参数

| 参数名   | 参数说明   | 备注 |
| -------- | ---------- | ---- |
| id       | 用户ID     |      |
| role_id  | 用户角色ID |      |
| username | 用户名     |      |
| mobile   | 手机号     |      |
| email    | 邮箱       |      |

* 响应数据

```
{
  "data": {
    "id": 5,
    "role_id": 2,
    "username": "ww",
    "mobile": "13799999999",
    "email": "1715898746@qq.com",
    "mg_state": 1
  },
  "meta": {
    "msg": "用户创建成功！",
    "status": 201
  }
}
```



### 修改用户状态

* 请求路径：users/:user_id/mg_state/:type
* 请求方法：put
* 请求参数

| 参数名  | 参数说明 | 备注                                        |
| ------- | -------- | ------------------------------------------- |
| user_id | 用户ID   | 不能为空，携带在 url 中                     |
| type    | 用户状态 | 不能为空，携带在url 中，值为true 或者 false |

* 响应数据

```
{
  "data": {
    "id": 1,
    "role_id": 1,
    "username": "admin",
    "mobile": "137",
    "email": "17158577",
    "mg_state": 0
  },
  "meta": {
    "msg": "用户状态设置成功！",
    "status": 200
  }
}
```



### 根据ID查询用户信息

* 请求路径：users/:id
* 请求方法：get
* 请求参数

| 参数名 | 参数说明 | 备注                 |
| ------ | -------- | -------------------- |
| id     | 用户ID   | 不能为空 携带在url中 |

* 响应参数

| 参数名  | 参数说明 | 备注 |
| ------- | -------- | ---- |
| id      | 用户ID   |      |
| role_id | 角色ID   |      |
| mobile  | 手机号   |      |
| email   | 邮箱     |      |

* 响应数据

```
{
  "data": {
    "id": 1,
    "role_id": 1,
    "username": "admin",
    "mobile": "137",
    "email": "17158577",
    "mg_state": 1
  },
  "meta": {
    "msg": "用户信息查询成功！",
    "status": 200
  }
}
```



### 编辑用户提交

* 请求路径：user/:id
* 请求方法：put
* 请求参数

| 参数名 | 参数说明 | 备注                       |
| ------ | -------- | -------------------------- |
| id     | 用户id   | 不能为空 参数是url参数：id |
| email  | 邮箱     | 可以为空                   |
| mobile | 电话     | 可以为空                   |

* 响应参数

| 参数名  | 参数说明 | 备注 |
| ------- | -------- | ---- |
| id      | 用户ID   |      |
| role_id | 角色ID   |      |
| mobile  | 电话     |      |
| email   | 邮箱     |      |

* 响应数据

```
{
  "data": {
    "id": 1,
    "role_id": 1,
    "username": "admin",
    "mobile": "13789940592",
    "email": "1715858747@qq.com"
  },
  "meta": {
    "msg": "更新成功！",
    "status": 200
  }
}
```



### 删除单个用户

* 请求路径：users/:id
* 请求方法：delete
* 请求参数

| 参数名 | 参数说明 | 备注                        |
| ------ | -------- | --------------------------- |
| id     | 用户 id  | 不能为空 参数是url 参数：id |

* 响应参数
* 响应数据

```
{

}
```



### 分配用户角色

* 请求路径：users/:id/role
* 请求方法：put
* 请求参数

## 权限管理

### 所有权限列表

* 请求路径：rights/:type
* 请求方法：get
* 请求参数

| 参数名 | 参数说明 | 备注                                                         |
| ------ | -------- | ------------------------------------------------------------ |
| type   | 类型     | 值list或tree，list列表显示权限，tree树状显示权限，参数是url 参数：type |

* 响应参数

| 参数名   | 参数说明     | 备注 |
| -------- | ------------ | ---- |
| id       | 权限ID       |      |
| authName | 权限名称     |      |
| level    | 权限层级     |      |
| pid      | 权限父ID     |      |
| path     | 对应访问路径 |      |

* 响应数据 type = list

```
{
  "data": {
    "id": 1,
    "role_id": 1,
    "username": "admin",
    "mobile": "13789940592",
    "email": "1715858747@qq.com",
    "mg_state": 1
  },
  "meta": {
    "msg": "用户信息查询成功！",
    "status": 200
  }
}
```

* 响应数据 type = tree

```
{
  "data": {
    "id": 1,
    "role_id": 1,
    "username": "admin",
    "mobile": "13789940592",
    "email": "1715858747@qq.com",
    "mg_state": 1
  },
  "meta": {
    "msg": "用户信息查询成功！",
    "status": 200
  }
}
```



### 左侧菜单权限

* 请求路径：menus
* 请求方法：get
* 响应数据

```
{
  "data": [
    {
      "id": 1,
      "authName": "用户管理",
      "path": "users",
      "children": [
        {
          "id": 7,
          "authName": "用户列表",
          "path": "users",
          "children": []
        }
      ]
    },
    {
      "id": 2,
      "authName": "权限管理",
      "path": null,
      "children": [
        {
          "id": 8,
          "authName": "角色列表",
          "path": "system",
          "children": []
        },
        {
          "id": 9,
          "authName": "权限列表",
          "path": "rightlist",
          "children": []
        }
      ]
    },
    {
      "id": 3,
      "authName": "商品管理",
      "path": null,
      "children": [
        {
          "id": 10,
          "authName": "商品列表",
          "path": "goodslist",
          "children": []
        },
        {
          "id": 11,
          "authName": "分类参数",
          "path": "goodsargs",
          "children": []
        },
        {
          "id": 12,
          "authName": "商品分类",
          "path": "goodstype",
          "children": []
        }
      ]
    },
    {
      "id": 4,
      "authName": "订单管理",
      "path": null,
      "children": [
        {
          "id": 13,
          "authName": "订单列表",
          "path": "orderlist",
          "children": []
        }
      ]
    },
    {
      "id": 5,
      "authName": "数据统计",
      "path": null,
      "children": [
        {
          "id": 14,
          "authName": "数据列表",
          "path": "reportlist",
          "children": []
        }
      ]
    }
  ],
  "meta": {
    "msg": "菜单列表获取成功！",
    "status": 200
  }
}
```



## 角色管理

### 角色列表

### 添加角色

###根据ID查询角色

### 编辑提交角色

### 删除角色

### 角色授权

### 删除角色指定权限

## 商品分类管理

### 商品分类数据列表

### 添加分类

### 根据 id 查询分类

### 编辑提交分类

### 删除分类

### 分类参数管理

### 参数列表

### 添加动态参数或者静态属性

### 删除参数

### 根据ID查询参数

###编辑提交参数

## 商品管理

### 商品列表数据

### 添加商品

### 根据ID查询商品

### 编辑提交商品

### 删除商品

### 图片上传

## 订单管理

### 订单数据列表

### 修改订单状态

### 查看订单详情

### 修改地址





















