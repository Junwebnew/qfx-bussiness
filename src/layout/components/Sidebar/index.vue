<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <!-- <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg" :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'" :unique-opened="true" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="(route, index) in permission_routes" :key="route.path  + index" :item="route" :sideTheme='settings.sideTheme' :base-path="route.path" />
            </el-menu> -->
            <el-menu :default-active="activeMenu" :default-openeds='selectedIndexs' @open="handleOpen" :collapse="isCollapse" :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg" :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'" :unique-opened="uniqueOpened" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="(route, index) in permission_routes" :key="route.path  + index" :item="route" :sideTheme='settings.sideTheme' :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
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
            selectedIndexs: ['/resources']
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
        }
    },
    mounted() {
        // console.log('侧边路由数组', this.activeMenu)
        Global.$on('setRouterShow', msg => {
            console.log('打开路由数组', msg)
            this.selectedIndexs.push(msg)
        })
    },
    methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        }
    }

};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
</style>