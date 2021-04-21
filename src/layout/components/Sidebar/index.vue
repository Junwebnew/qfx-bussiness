<template>
    <!-- <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :default-openeds='selectedIndexs' @open="handleOpen" :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg" :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'" :unique-opened="uniqueOpened" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="(route, index) in permission_routes" :key="route.path  + index" :item="route" :sideTheme='settings.sideTheme' :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div> -->
    <div class="newSide">
        <div class="l-side">
            <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
                <logo v-if="showLogo" :collapse="true" />
                <ul class="first-item">
                    <template v-for="(route, index) in showPermission_routes">
                        <li :key="route.path  + index" v-if="!route.hidden" :data-idx='index' class="l-side-item" :class="{'active':index == rActive}" @click.stop="seitchMenu(index,route)">
                            <el-tooltip class="item" effect="dark" :content="route.meta && route.meta.title" placement="left">
                                <svg-icon :icon-class='route.meta && route.meta.icon' />
                            </el-tooltip>
                        </li>
                    </template>
                </ul>
            </el-scrollbar>
        </div>
        <div class="r-side" @click.stop>

            <!-- <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
                <el-menu :default-openeds='selectedIndexs' mode="vertical">

                    <template>
                        <sidebar-item v-for="(route, index) in showPermission_routes" v-show=' index == rActive ' :key="route.path  + index" :item="route" :base-path="route.path" />
                    </template>
                </el-menu>
            </el-scrollbar> -->

            <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
                <el-menu :default-openeds='selectedIndexs' mode="vertical">

                    <template>
                        <sidebar-item v-for="(route, index) in showPermission_routes[rActive].children" :key="route.path  + index" :item="route" :base-path="showPermission_routes[rActive].path" />
                    </template>
                </el-menu>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import Global from "@/layout/components/global.js";

export default {
    components: { SidebarItem, Logo },
    data() {
        return {
            //是否只保持一个子菜单的展开
            uniqueOpened: false,
            selectedIndexs: [], //控制菜单的打开
            rActive: 0,//第一级的选中
        }
    },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["permission_routes", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
        showPermission_routes() {
            return this.permission_routes.filter(i => !i.hidden)
        },
    },
    watch: {
        $route(newRoute) {
            // console.log(18, n)
            this.changeRoute(newRoute.path)
        }
    },
    created() {

        this.changeRoute(this.$route.path)
    },
    mounted() {
        console.log('侧边路由数组', this.showPermission_routes)
        // Global.$on('setRouterShow', msg => {
        //     console.log('打开路由数组', msg)
        //     this.selectedIndexs.push(msg)
        // })
        // console.log('9999重新加载')
    },
    methods: {
        changeRoute(path) {
            let selectedIndexs = path == '/index' ? ['/resources'] : ['/' + this.$route.path.split('/')[1]]
            if (selectedIndexs[0] == this.selectedIndexs[0]) return
            this.showPermission_routes.map((route, idx) => {
                if (route.path == selectedIndexs[0]) {
                    this.rActive = idx
                }
            })
            this.selectedIndexs = selectedIndexs
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        seitchMenu(index, route) {
            this.rActive = index
            // console.log('加载了为什么', route, index)
            this.selectedIndexs = [route.path]
        }
    }

};
</script>
<style lang="scss" scoped>
// @import "~@/assets/styles/variables.scss";
.newSide {
    .l-side {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 21, 41);
        .l-side-item {
            width: 100%;
            height: 54px;
            text-align: center;
            line-height: 54px;
            font-size: 22px;
            color: #fff;
            cursor: pointer;
            &.active {
                background-color: #000c17 !important;
                color: #1579fa;
            }
            .svg-icon {
                margin: 0 !important;
            }
        }
    }
    .r-side {
        position: absolute;
        right: 0;
        top: 50px;
        width: 206px;
        height: 100%;
        transform: translateX(100%);
        overflow: auto;
        background-color: #fff;
        padding-bottom: 70px;
    }
}
</style>