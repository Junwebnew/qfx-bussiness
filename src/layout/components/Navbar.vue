<template>
    <div class="navbar">
        <hamburger v-if="device =='mobile'" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <!-- <div class="refresh hamburger-container" style="padding: 0 10px;" @click="refreshFunc"> <i class="el-icon-refresh-right"></i> </div> -->
        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
        <div class="logoBox" :class="{wap: device =='mobile'}">
            <a href="http://www.qmxip.com" target="_blank" rel="noopener noreferrer">
                <!-- <img src="../../assets/images/logo-black2.png" alt='权明星'> -->
                权发现
            </a>
            <span class="min" v-if="device !=='mobile'">知识产权销售利器</span>
        </div>
        <div class="right-menu">
            <template v-if="device!=='mobile'">
                <!-- <search id="header-search" class="right-menu-item" /> -->

                <!-- <el-tooltip content=undefind effect="dark" placement="bottom">
                    
                </el-tooltip> -->

                <!-- 电话 -->
                <div class="takePhone" @click="takePhone">
                    <svg-icon icon-class='telNum' class="telNum" />
                </div>

                <!-- <takePhone /> -->

                <el-tooltip content="权明星官网" effect="dark" placement="bottom">
                    <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
                </el-tooltip>

                <wchartBox class="right-menu-item hover-effect" />

                <qmxmsg class="right-menu-item hover-effect" />

                <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

                <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
                    <size-select id="size-select" class="right-menu-item hover-effect" />
                </el-tooltip> -->

            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <span class="name text-delic">{{name}}</span>
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <!-- <el-dropdown-item @click.native="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item> -->
                    <el-dropdown-item divided @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
// import RuoYiDoc from '@/components/RuoYi/Doc'
import qmxmsg from '@/components/RuoYi/msg'
import wchartBox from './wchartBox'
import Global from "@/layout/components/global.js";
export default {
    components: {
        // Breadcrumb,
        Hamburger,
        // Screenfull,
        // SizeSelect,
        // Search,
        RuoYiGit,
        // RuoYiDoc,
        qmxmsg,
        wchartBox
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar',
            'device',
            'name'
        ]),
        setting: {
            get() {
                return this.$store.state.settings.showSettings
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'showSettings',
                    value: val
                })
            }
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        refreshFunc() {
            this.$nextTick(() => {
                this.$router.replace({
                    path: '/redirect' + this.$route.fullPath
                })
            })
        },
        async logout() {
            this.$confirm('确定注销并退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    location.href = '/';
                })
            })
        },
        takePhone() {
            Global.$emit("takePhone");
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #edf0f4;
    .logoBox {
        float: left;
        height: 50px;
        line-height: 50px;
        margin-left: 20px;
        font-size: 0;
        &.wap {
            margin: 0;
        }
        img {
            // height: 50px;
            width: 152px;
        }
        .min {
            // vertical-align: sub;
            font-size: 14px;
        }
        a {
            font-size: 24px;
            font-family: NSimSun;
            font-weight: 700;
        }
    }
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 14px;
            height: 100%;
            font-size: 24px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                position: relative;
                line-height: 46px;
                .user-avatar {
                    cursor: pointer;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
                .name {
                    display: inline-block;
                    font-size: 12px;
                    vertical-align: middle;
                    margin-left: 4px;
                    max-width: 50px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 22px;
                    font-size: 12px;
                }
            }
        }
    }
}
//刷新
.refresh {
    i {
        font-size: 22px;
        display: inline-block;
        vertical-align: middle;
    }
}
.takePhone {
    display: inline-block;
    vertical-align: top;
    margin-top: -2px;
    cursor: pointer;
    .telNum {
        font-size: 26px;
        vertical-align: middle;
        color: #5ac724;
    }
}
</style>
