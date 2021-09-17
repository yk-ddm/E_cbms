<template>
    <div class="login-container">
        <div class="login-part">
            <!-- 头像区域 start -->
            <div class="avatar-part">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 头像区域 end -->
            <!-- 登录表单区域 start -->
            <el-form
                ref="loginFormRef"
                class="login-form" 
                :model="loginForm"
                label-position="left"
                :rules="loginFormRules">
                <!-- 用户名区域 start -->
                <el-form-item prop="username">
                    <el-input 
                        v-model="loginForm.username"
                        prefix-icon="iconfont icon-wo"></el-input>
                </el-form-item>
                <!-- 用户名区域 end -->
                <!-- 密码区域 start -->
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password" 
                        prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <!-- 密码区域 end -->
                <!-- 按钮区域 start -->
                <el-form-item class="btns-part">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
                <!-- 按钮区域 end -->
            </el-form>
            <!-- 登录表单区域 end -->
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: 'root'
            },
            // 表单验证规则对象
            loginFormRules: {
                // 验证用户名 是否合法
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login() {
            // 通过 async / await 简化 promise
            this.$refs.loginFormRef.validate(async valid => {
                // valid => boolean 值
                if (!valid) return;
                // 简单验证通过，向后台请求数据  使用 {} 解构赋值  : 取别名
                const { data: res } = await this.$http.post('login', this.loginForm);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);                                                  
                this.$message.success(res.meta.msg);
                window.sessionStorage.setItem('token', res.data.token);
                // 编程式导航
                this.$router.push('/home');
            });            
        },
        // 点击重置按钮， 重置登录表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    height: 100%;
    background-color: #2b4b6b;
}

.login-part {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);

    .avatar-part {
        position: absolute;
        left: 50%;
        width: 130px;
        height: 130px;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        transform: translate(-50%, -50%);
        img {
            width: 100%;
            height: 100%;
            background-color: #eee;
            border-radius: 50%;
        }
    }

    .login-form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;

        .btns-part {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
