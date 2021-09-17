<template>
    <div>
        <!-- 面包屑导航区域 start -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航区域 end -->
        <!-- 卡片区域 start -->
        <el-card>
            <!-- 搜索和添加区域 start -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input :clearable="true" v-model="queryInfo.query" placeholder="请输入内容" @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUserDialog">添加</el-button>
                </el-col>
            </el-row>
            <!-- 搜索和添加区域 end -->
            <!-- 用户列表区域 start -->
            <el-table :border="true" :stripe="true" :data="userlist">
                <el-table-column type="index" label="id">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 start -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUser(scope.row)"></el-button>
                        <!-- 修改按钮 end -->
                        <!-- 删除按钮 start -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 删除按钮 end -->
                        <!-- 分配角色按钮 start -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="settingUserRole"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 end -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 用户列表区域 end -->
            <!-- 分页区域 start -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
            </el-pagination>
            <!-- 分页区域 end -->
        </el-card>
        <!-- 卡片区域 end -->
        <!-- 添加用户 对话框 start -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 主体内容区域 start -->
            <el-form label-width="70px" ref="addFormRef" :model="addUserForm" :rules="addFormRules">
                <!-- 用户名区域 start -->
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <!-- 用户名区域 end -->
                <!-- 密码区域 start -->
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <!-- 密码区域 end -->
                <!-- 邮箱区域 start -->
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <!-- 邮箱区域 end -->
                <!-- 手机号区域 start -->
                <el-form-item prop="mobile" label="电话">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
                <!-- 手机号区域 end -->
            </el-form>
            <!-- 主体内容区域 end -->
            <!-- 底部区域 start -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserInfo">确 定</el-button>
            </span>
            <!-- 底部区域 end -->
        </el-dialog>
        <!-- 添加用户 对话框 end -->
        <!-- 修改用户 对话框 start -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 主体内容区域 start -->
            <el-form label-width="70px" ref="editFormRef" :model="editUserForm" :rules="editFormRules">
                <!-- 用户名区域 start -->
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="editUserForm.username" :disabled="true"></el-input>
                </el-form-item>
                <!-- 用户名区域 end -->
                <!-- 邮箱区域 start -->
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <!-- 邮箱区域 end -->
                <!-- 手机号区域 start -->
                <el-form-item prop="mobile" label="电话">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
                <!-- 手机号区域 end -->
            </el-form>
            <!-- 主体内容区域 end -->
            <!-- 底部区域 start -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
            <!-- 底部区域 end -->
        </el-dialog>
        <!-- 修改用户 对话框 end -->
        <!-- 分配角色 对话框 start -->
        <el-dialog title="分配角色" :visible.sync="settingDialogVisible" width="50%">
            <!-- 主体内容区域 start -->
            <el-form label-width="70px" ref="editFormRef" :model="editUserForm" :rules="addFormRules">
                <!-- 用户名区域 start -->
                <el-form-item prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <!-- 用户名区域 end -->
                <!-- 密码区域 start -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <!-- 密码区域 end -->
            </el-form>
            <!-- 主体内容区域 end -->
            <!-- 底部区域 start -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
            <!-- 底部区域 end -->
        </el-dialog>
        <!-- 分配角色 对话框 end -->
    </div>
</template>

<script>
export default {
    created() {
        this.getUserList()
    },
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证 手机号的规则
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的电话'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                pagesize: 1
            },
            userlist: [],
            totalpage: 0,
            // 添加 用户 对话框是否显示
            addDialogVisible: false,
            // 修改 用户 对话框是否显示
            editDialogVisible: false,
            settingDialogVisible: false,
            // 添加用户的表单数据
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 修改 用户的数据
            editUserForm: {
                username: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                // 验证用户名 是否合法
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
                ],
                // 验证用户名 是否合法
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                // 验证密码是否合法
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ]
            },
            editFormRules: {
                // 验证用户名 是否合法
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                // 验证密码是否合法
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.userlist = res.data.users
            this.totalpage = res.data.totalpage
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 pagenum 页码值 改变的事件
        handleCurrentChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum
            this.getUserList()
        },
        // 监听 switch 开关状态 改变的事件
        async userStateChanged(userinfo) {
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state ? 1 : 0}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
        },
        //  开启 添加用户 对话框
        addUserDialog() {
            this.addDialogVisible = true
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUserInfo() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post('users', this.addUserForm);
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.addDialogVisible = false
                this.getUserList()
            });
        },
        // 展示 编辑 用户的对话框
        async showEditUser(currentObj) {
            this.editDialogVisible = true
            this.editUserForm = currentObj
            /*
            const { data: res } = await this.$http.get(`users/${currentObj.id}`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            */
        },
        // 监听 修改 用户对话框的关闭事件        
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        //  修改用户
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, {
                    email: this.editUserForm.email,
                    mobile: this.editUserForm.mobile
                });
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.editDialogVisible = false
                this.getUserList()
            });
        },
        // 根据 id 删除对应的用户信息
        async removeUserById(id) {
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败！')
            }

            this.$message.success('删除用户成功！')
            this.queryInfo.pagenum = 1;
            this.getUserList()
        },
        settingUserRole() {
            console.log('为用户分配角色')
        }
    }
}
</script>

<style lang="less" scoped>

</style>
