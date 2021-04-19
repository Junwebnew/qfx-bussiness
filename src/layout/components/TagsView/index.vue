<template>
    <div id="tags-view-container" class="tags-view-container">
        <div class="scroll-pane-box">
            <span class="scroll-btn l el-icon-d-arrow-left" @click="handleScroll( 200 )" v-show="isShowScrollBtn"></span>
            <scroll-pane ref="scrollPane" class="tags-view-wrapper">

                <router-link v-for="(item,index) in tagsList" :to="item.fullPath" :ref='item.name' :class="{'active': isActive(item.name),'tags-view-item':true}" :key="index" @contextmenu.prevent.native="openTabShow(item,$event)">
                    {{ item.title }}
                    <span v-if="item.name != '首页'" class="el-icon-close" @click.prevent.stop="closeTags(index)" />
                </router-link>

            </scroll-pane>
            <span class="scroll-btn r el-icon-d-arrow-right" @click="handleScroll( -200 )" v-show="isShowScrollBtn"></span>
        </div>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)" v-show="selectedTag.name == $route.name ">刷新页面</li>
            <li @click="closeOther">关闭其他</li>
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
            //滚动盒子
            scrollBox: '',
            //是否展示滚动操作按钮
            isShowScrollBtn: false
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

        // console.log(this.$route)

        if (Cookies.get('tagsList')) {
            this.tagsList = JSON.parse(Cookies.get('tagsList'))
        }
        this.setTags(this.$route);
    },
    mounted() {

        this.scrollBox = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap

        this.isShowScrollBtn = this.scrollBox.scrollWidth > this.scrollBox.clientWidth

    },
    methods: {
        //右键点击
        openTabShow(tag, e) {

            const menuMinWidth = 105
            const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            const offsetWidth = this.$el.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            const left = e.clientX - offsetLeft

            if (left > maxLeft) {
                this.left = maxLeft
            } else {
                this.left = left
            }

            this.top = e.clientY - 50 //顶部导航高 50
            this.visible = true
            this.selectedTag = tag
        },
        //寻找当前选中tag的位置 然后再滚动到显示的位置
        findNowSelect(name) {
            this.$nextTick(() => {

                let leftWidth = this.$el.getBoundingClientRect().left,  //盒子距离右侧宽度
                    boxWidth = this.scrollBox.clientWidth, //盒子长度
                    positionL = this.$refs[name][0].$el.getBoundingClientRect().left,//当前元素距左侧长度
                    positionR = this.$refs[name][0].$el.getBoundingClientRect().right;//当前元素距左侧长度+盒子自身长度

                //1.已滚动到左侧隐藏    
                // console.log('111', positionL, positionR)
                if (leftWidth > positionL) {
                    this.scrollTeps(positionL - leftWidth - 12) //padding有 12
                }
                else if (positionR > (leftWidth + boxWidth)) {
                    this.scrollTeps(positionR - leftWidth - boxWidth - 12)
                }

            })

        },
        // 当前选中标签
        isActive(name, ele) {
            // console.log(111, ele)
            // return name === this.$route.name;
            if (name === this.$route.name) {
                this.findNowSelect(name)

                return true
            }

            return false
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
            this.cookeSaveTag()
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

            this.cookeSaveTag()

        },
        // 关闭其他标签
        closeOther() {

            if (this.selectedTag.name == '首页') {
                this.tagsList = [this.selectedTag];
            }
            else
                this.tagsList = [this.tagsList[0], this.selectedTag];


            if (this.selectedTag.fullPath != this.$route.fullPath) {
                this.$router.push(this.selectedTag.fullPath);
            }

            this.cookeSaveTag()
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

                // if (this.tagsList.length >= 8) {
                //     this.tagsList.shift();
                // }
                this.tagsList.push({
                    title: route.meta.title,
                    fullPath: route.fullPath,
                    name: route.name,

                });

                this.cookeSaveTag()


                // this.$ls.set('tagsList', tagsList)
            }
        },
        cookeSaveTag() {

            this.$nextTick(() => {
                this.isShowScrollBtn = this.scrollBox.scrollWidth > this.scrollBox.clientWidth
                Cookies.set('tagsList', this.tagsList)
            })
        },
        closeMenu() {
            this.visible = false
        },
        handleScroll(num) {

            this.scrollTeps(num)
        },
        //long 滑动长度 ; teps 分多少步，默认20
        scrollTeps(long, teps = 20) {
            let timer = 0
            var inter = setInterval(() => {
                this.scrollBox.scrollLeft = this.scrollBox.scrollLeft + (long / teps)

                if (timer++ == teps) {
                    clearInterval(inter)
                }
            }, 10)
        }
    }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 32px;
    width: 100%;
    // background: #edf0f4;
    padding-left: 216px;
    background: #edf0f4;

    position: relative;
    .scroll-pane-box {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        background-color: #ffffff;
        // border-bottom: 1px solid #d8dce5;
        // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
        //     0 0 3px 0 rgba(0, 0, 0, 0.04);
    }
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
            // margin-left: 5px;
            // margin-top: 4px;
            // border-radius: 3px;
            border-right: 1px solid #edf0f4;
            overflow: hidden;
            &:first-of-type {
                // margin-left: 10px;
                border-left: 1px solid #edf0f4;
            }
            // &:last-of-type {
            //     margin-right: 10px;
            // }
            &.active {
                background-color: #ffffff;
                color: #2d8cf0;
                background: #edf0f4;
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
    .scroll-btn {
        // position: absolute;
        // top: 0;
        height: 32px;
        width: 32px;
        text-align: center;
        line-height: 32px;
        // &.l {
        //     left: 0;
        // }
        // &.r {
        //     right: 0;
        // }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    flex: 1;
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