<template>
    <div>
        <!-- 面包屑导航区域 start -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航区域 end -->
        <!-- 卡片区域 start -->
        <el-card>
            <!-- 用户列表区域 start -->
            <el-table :border="true" :stripe="true" :data="rightslist">
                <el-table-column type="index" label="id">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                </el-table-column>
            </el-table>
            <!-- 用户列表区域 end -->
        </el-card>
        <!-- 卡片区域 end -->
    </div>
</template>

<script>
export default {
    created() {
        console.log(window.sessionStorage.getItem('activePath'))
        this.getRightsList()
    },
    data() {
        return {
            //  权限列表
            rightslist: []
        }
    },
    methods: {
        //  获取 所有 的权限
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
        }
    }
}
</script>

<style lang="less" scoped>
h3 {
    margin-left: 15px;
}
</style>
