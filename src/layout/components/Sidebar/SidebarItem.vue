<template>
    <div v-if="!item.hidden">
        <!-- <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.subMenuBg : variables.subMenuBg }">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
        </el-submenu> -->

        <template v-if="!item.children || item.children == 0">
            <app-link v-if="item.meta" :to="resolvePath(item.path)">
                <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown':!isNest}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.subMenuBg : variables.subMenuBg }">
                    <item :icon="item.meta.icon||(item.meta&&item.meta.icon)" :title="item.meta.title" :unit="item.meta.unit" />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" :unit="item.meta.unit" />
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(item.path)" class="nest-menu" />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import variables from '@/assets/styles/variables.scss'

export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        },
        sideTheme: {
            type: ''
        }
    },
    computed: {

        variables() {
            return variables;
        }
    },
    data() {
        this.onlyOneChild = null
        return {}
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            if (!children) {
                children = [];
            }
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item
                    return true
                }
            })

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {

                return routePath
            }
            if (isExternal(this.basePath)) {

                return this.basePath
            }
            // console.log(routePath, '进行中', this.basePath)
            return path.resolve(this.basePath, routePath)
        }
    }
}
</script>
