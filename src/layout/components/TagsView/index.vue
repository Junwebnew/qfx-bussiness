<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
            <!-- <router-link to='/index' :class="{'active': isActive('index'),'tags-view-item':true}" @contextmenu.prevent.native="openTabShow(indexItem,$event)">
                首页
            </router-link> -->
            <router-link v-for="(item,index) in tagsList" :to="item.fullPath" :class="{'active': isActive(item.name),'tags-view-item':true}" :key="index" @contextmenu.prevent.native="openTabShow(item,$event)">
                {{ item.title }}
                <span v-if="item.name != '首页'" class="el-icon-close" @click.prevent.stop="closeTags(index)" />
            </router-link>
        </scroll-pane>
        <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
            <li v-show="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags(selectedTag)">关闭所有</li>
        </ul> -->
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
            <li @click="closeOther" v-show=' selectedTag.name == $route.name'>关闭其他</li>
            <li @click="closeRight">关闭右侧</li>
            <li @click="closeAll" v-show="selectedTag.name != '首页'">关闭所有</li>
        </ul>
    </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import Global from "@/layout/components/global.js";
import Cookies from 'js-cookie'
import { deepClone } from '@/utils/index'

export default {
    components: { ScrollPane },
    data() {
        return {
            indexItem: {
                title: '首页',
                fullPath: '/index',
                name: 'index',
            },
            tagsList: [], // 存放所有标签
            visible: false,
            left: 0,
            top: 0,
            selectedTag: {},
            isClick: false
        }
    },
    watch: {
        $route(newValue, oldValue) {
            this.setTags(newValue);
        },
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu)
            } else {
                document.body.removeEventListener('click', this.closeMenu)
            }
        }
    },
    created() {

        console.log(this.$route)

        if (Cookies.get('tagsList')) {
            this.tagsList = JSON.parse(Cookies.get('tagsList'))

        }
        this.setTags(this.$route);
    },
    methods: {
        //右键点击
        openTabShow(tag, e) {

            const menuMinWidth = 105
            const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            const offsetWidth = this.$el.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            const left = e.clientX - offsetLeft + 15 // 15: margin right

            if (left > maxLeft) {
                this.left = maxLeft
            } else {
                this.left = left
            }

            this.top = e.clientY
            this.visible = true
            this.selectedTag = tag
        },
        // 当前选中标签
        isActive(path) {
            return path === this.$route.name;
        },
        // 关闭单个标签
        closeTags(index) {
            const delItem = this.tagsList.splice(index, 1)[0];
            const item = this.tagsList[index]
                ? this.tagsList[index]
                : this.tagsList[index - 1];
            if (item) {
                delItem.fullPath === this.$route.fullPath && this.$router.push(item.fullPath);
            } else {
                this.$router.push("/");
            }
        },
        //刷新
        refreshSelectedTag() {
            // Global.$emit("reLoadRouter"); // 组件传值

            this.$nextTick(() => {
                this.$router.replace({
                    path: '/redirect' + this.selectedTag.fullPath
                })
            })
        },
        //关闭右侧
        closeRight() {
            let arr;
            for (let i = 0; i < this.tagsList.length; i++) {
                if (this.tagsList[i].name == this.selectedTag.name) {
                    arr = this.tagsList.slice(0, i + 1)
                }
            }
            this.tagsList = arr
            this.$router.push(this.selectedTag.fullPath);
        },
        // 关闭其他标签
        closeOther() {

            if (this.selectedTag.name == '首页') {
                this.tagsList = [this.selectedTag];
            }
            else
                this.tagsList = [this.tagsList[0], this.selectedTag];
        },
        // 关闭全部标签
        closeAll() {
            this.tagsList = [];
            this.$router.replace("/");
        },
        // 设置标签
        setTags(route) {

            if (!route.name) return

            const isExist = this.tagsList.some(item => {
                return item.name === route.name;
            });

            if (!isExist) {

                if (this.tagsList.length >= 8) {
                    this.tagsList.shift();
                }
                this.tagsList.push({
                    title: route.meta.title,
                    fullPath: route.fullPath,
                    name: route.name,

                });

                Cookies.set('tagsList', this.tagsList)
                // this.$ls.set('tagsList', tagsList)
            }
        },
        closeMenu() {
            this.visible = false
        },
        handleScroll() {

        }
    }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 40px;
    width: 100%;
    background: #edf0f4;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 32px;
            line-height: 32px;
            // border: 1px solid #d8dce5;
            color: #515a6e;
            background: #fff;
            padding: 0 12px 0 12px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            border-radius: 3px;
            &:first-of-type {
                margin-left: 10px;
            }
            &:last-of-type {
                margin-right: 10px;
            }
            &.active {
                background-color: #ffffff;
                color: #2d8cf0;
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            font-size: 12px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>