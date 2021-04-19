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
            <logo v-if="showLogo" :collapse="true" />
            <ul class="first-item">
                <template v-for="(route, index) in showPermission_routes">
                    <li :key="route.path  + index" v-if="!route.hidden" :data-idx='index' class="l-side-item" :class="{'active':route.path == selectedIndexs[0]}" @click.stop="seitchMenu(index,route)">
                        <svg-icon :icon-class='route.meta && route.meta.icon' />
                    </li>
                </template>
            </ul>
        </div>
        <div class="r-side" @click.stop>

            <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
                <el-menu :default-openeds='selectedIndexs' mode="vertical">
                    <sidebar-item v-for="(route, index) in showPermission_routes" v-show=' route.path == selectedIndexs[0] ' :key="route.path  + index" :item="route" :base-path="route.path" />
                </el-menu>
            </el-scrollbar>

            <!-- <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper" :collapse="isCollapse">
                <el-menu :collapse-transition="false" mode="vertical">
                    <sidebar-item v-for=" (route, index) in showPermission_routes" v-show='rActive == index' :key="route.path + index" :item="route" :base-path="route.path" />
                </el-menu>
            </el-scrollbar> -->

            <!-- <ul class="menuBox">
                <li v-for=" (route, index) in permission_routes[rActive]" :key="route.name" :data-idx='index' class="menu-item">
                    <div class=" "></div>
                </li>
            </ul> -->
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
            selectedIndexs: [],
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
    created() {
        // console.log('9999重新加载', this.$route.path)
        let path = this.$route.path
        this.selectedIndexs = path == '/index' ? ['/resources'] : ['/' + this.$route.path.split('/')[1]]
    },
    mounted() {
        // console.log('侧边路由数组', this.showPermission_routes)
        // Global.$on('setRouterShow', msg => {
        //     console.log('打开路由数组', msg)
        //     this.selectedIndexs.push(msg)
        // })

    },
    methods: {
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
            font-size: 20px;
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
    }
}
</style>