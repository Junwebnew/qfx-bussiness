<template>
    <div class="app-container home">
        <div class="back-fff">
            <el-row :gutter="20" class="pad20 userInfoBox">
                <el-col :sm="12" :xs="24" class="">
                    <div class="user-avatar">
                        <img :src="avatar">
                    </div>
                    <div class="avaterContent">
                        <h2>{{timeFix()}},{{name}}</h2>
                        <p>{{orgInfo.orgName}} - {{orgInfo.deptName}}</p>
                    </div>
                </el-col>
                <el-col :sm="12" :xs="24">
                    <ul class="showInfo">
                        <li>
                            <span>剩余次数</span>
                            <p class="num">898</p>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: "index",
    data() {
        return {
            //机构职位
            orgInfo: {}
        };
    },
    computed: {
        ...mapGetters([
            'avatar',
            'name'
        ]),
    },
    created() {
        this.$store.dispatch('getUserOrgAndDep').then(res => {
            // console.log('000', res)
            this.orgInfo = res
        })
    },
    methods: {
        goTarget(href) {
            window.open(href, "_blank");
        },
        timeFix() {
            const time = new Date();
            const hour = time.getHours();
            return hour < 9
                ? "早上好"
                : hour <= 11
                    ? "上午好"
                    : hour <= 13
                        ? "中午好"
                        : hour < 20
                            ? "下午好"
                            : "晚上好";
        }
    },
};
</script>

<style scoped lang="scss">
.userInfoBox {
    .user-avatar {
        float: left;
        width: 72px;
        height: 72px;
        margin-right: 24px;
        overflow: hidden;
        border-radius: 50%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .avaterContent {
        position: relative;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        padding-top: 6px;
        h2 {
            margin-bottom: 8px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
        }
        p {
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
        }
    }
    .showInfo {
        text-align: right;
        li {
            position: relative;
            display: inline-block;
            padding: 0 32px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5;
            .num {
                color: rgba(0, 0, 0, 0.85);
                font-size: 24px;
                margin-top: 10px;
            }
            & + li {
                &::after {
                    position: absolute;
                    top: 8px;
                    left: 0;
                    width: 1px;
                    height: 40px;
                    background-color: #e8e8e8;
                    content: "";
                }
            }
        }
    }
}
</style>

