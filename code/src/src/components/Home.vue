<template>
    <el-container class="home-container">
        <!-- 头部区域 start -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <a href="http://127.0.0.1:8080/#/home">
                    <span>电商后台管理系统</span>
                </a>
            </div>
            <el-button type="info" @click="logout">退出</el-button>            
        </el-header>
        <!-- 头部区域 end -->        
        <!-- 页面主体区域 start -->        
        <el-container>
            <!-- 侧边栏区域 start -->                    
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 侧边栏菜单区域 start -->
                <el-menu
                    :default-active="activePath"
                    :router="true"
                    :collapse-transition="false"
                    :collapse="isCollapse"
                    background-color="#304156"
                    text-color="#fff"
                    active-text-color="#409eff"
                    :unique-opened="true">
                    <!-- 一级菜单 start -->
                    <el-submenu :index="'/' + item.path" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 一级菜单 end -->                    
                </el-menu>
                <!-- 侧边栏菜单区域 end -->                
            </el-aside>
            <!-- 侧边栏区域 end -->                                
            <!-- 右侧主体区域 start -->                                
            <el-main>
                <div class="toggle-button">
                    <i :class="toggleIconStr" @click="toggleCollapse"></i>                    
                </div>
                <div class="main-container">
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </div>
            </el-main>
            <!-- 右侧主体区域 end -->                                            
        </el-container>
        <!-- 页面主体区域 end -->        
        <!-- 底部区域 start -->        
        <el-footer>© 2021-3 湖北工程学院 计算机学院 yk-ddm</el-footer>
        <!-- 底部区域 end -->                
    </el-container>
</template>

<script>
export default {
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
        return {
            // 侧边栏 菜单数据
            menulist: [],
            iconsObj: {
                1: 'iconfont icon-yonghuguanli',
                2: 'iconfont icon-quanxianguanli2',
                3: 'iconfont icon-shangpinguanli',
                4: 'iconfont icon-dingdanguanli',
                5: 'iconfont icon-shujutongji'
            },
            toggleIconStr: 'iconfont icon-toggle-left',
            // 是否 折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
    methods: {
        // 获取所有的菜单
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            // console.log(this.menulist);
        },
        // 点击 折叠 和 展开  进行切换
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
            if (!this.isCollapse) {
                this.toggleIconStr = 'iconfont icon-toggle-left'
                return
            }
            this.toggleIconStr = 'iconfont icon-toggle-right'
        },
        // 保存链接 的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
        // 退出登录
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        background-color: #4d9c97;

        > div {
            display: flex;
            align-items: center;

            > img {
                height: 60px;
                margin-right: 10px;
                border-radius: 50%;
            }

            > a {
                color: #fff;
                font-size: 18px;
                text-decoration: none;
            }
        }        
    }
    
    .el-aside {
        background-color: rgb(48, 65, 86);

        .el-menu {
            border-right: none;

            .iconfont {
                margin-right: 10px;
            }
        }
    }

    .el-main {
        position: relative;
        padding: 0;        
        background-color: #eee;

        .toggle-button {
            position: absolute;
            width: 50px;
            height: 50px;
            font-weight: bold;
            text-align: center;
            line-height: 50px;
            z-index: 1;
            cursor: pointer;
        }
        
    }

    .el-footer {
        background-color: #999;
        text-align: center;
        line-height: 60px;
    }
}
</style>
