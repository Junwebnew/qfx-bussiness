<template>
    <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }" />
        <div :class="{hasTagsView:needTagsView}" class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>
        <!-- 指导遮盖层 -->
        <div class="guideBox" v-if='showGuide'>
            <span class="skip pointer" @click.stop="showGuide = false">跳过</span>
            <!-- 1 -->
            <div class="stepBox step1" v-show=" step == 1">
                <div class="words">
                    <p class="tit">
                        <span>1、</span> 部门管理 : 增加部门
                    </p>
                    <p class="f12">为你公司增加商务部门， (例如：增加商务中心，再增加商务一部，商务二部....)</p>
                </div>
                <p class="next" @click=" step = 2 ">下一步</p>
            </div>
            <!-- 2 -->
            <div class="stepBox step2" v-show=" step == 2">
                <div class="words">
                    <p class="tit">
                        <span>2、</span> 用户管理 : 增加用户
                    </p>
                    <p class="f12">为新增的部门，新增所属人员</p>
                </div>
                <p class="next" @click.stop="showGuide = false">完成</p>
            </div>
        </div>
        <!-- 电话固定窗 -->
        <div class="fixPhone" @click="takePhone">
            <img src="../assets/images/fixphone.png" alt="电话">
        </div>
        <!-- 电话组件 -->
        <takePhone />
    </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import Global from "@/layout/components/global.js";
import takePhone from './components/takePhone'
export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView,
        takePhone
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            theme: state => state.settings.theme,
            sideTheme: state => state.settings.sideTheme,
            sidebar: state => state.app.sidebar,
            device: state => state.app.device,
            showSettings: state => state.settings.showSettings,
            needTagsView: state => state.settings.tagsView,
            fixedHeader: state => state.settings.fixedHeader
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        },
        variables() {
            return variables;
        }
    },
    data() {
        return {
            showGuide: false,
            step: 1
        }
    },
    mounted() {



        let showGuide = localStorage.getItem('showGuide')
        if (!showGuide) {
            this.showGuide = true

            Global.$emit('setRouterShow', '/system')

            localStorage.setItem('showGuide', true)
        }
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        },
        takePhone() {
            Global.$emit("takePhone");
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 1000;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}

.guideBox {
    position: fixed;
    left: 0;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 100000;
    background-color: rgba(0, 0, 0, 0.8);
    .skip {
        position: absolute;
        right: 30px;
        top: 20px;
        color: #ffffff;
        text-decoration: underline;
        font-size: 16px;
    }
    .stepBox {
        position: absolute;
        left: 280px;
        top: 75px;
        width: 500px;
        // height: 300px;
        border-radius: 6px;
        color: #fff;
        padding: 20px;
        border: 1px solid #ffffff;
        &::before {
            position: absolute;
            content: " ";
            left: -20px;
            top: 20px;
            border: 10px solid transparent;
            border-right: 10px solid #ffffff;
        }
        .tit {
            color: #fff;
            font-weight: bolder;
            border-radius: 50%;
            margin-bottom: 10px;
        }
        .words {
            padding: 10px 0 20px;
            font-size: 18px;
            line-height: 1.5;
        }
        .next {
            text-align: right;
            color: #fff;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: underline;
        }
    }
    .step1 {
        top: 250px;
    }
    .step2 {
        top: 100px;
    }
}
.fixPhone {
    position: fixed;
    z-index: 10001;
    right: 0;
    top: 45%;
    background-color: #ffffff;
    border-radius: 4px 0 0 4px;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0 1px 10px #c1c1c1;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        background-color: #f9f9f9;
    }
    img {
        max-width: 72%;
        max-height: 72%;
    }
}
</style>
