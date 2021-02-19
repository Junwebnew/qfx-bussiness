<template>
    <div class="app-container">
        <div>
            <el-row :gutter="10">
                <el-col :span="6" :xs="24">
                    <div class="back-fff pad20 full-height">
                        <p class=" f16 mb20 part-tit">
                            个人信息
                        </p>
                        <div>
                            <div class="text-center mb20">
                                <userAvatar :user="user" />
                            </div>
                            <ul class="list-group list-group-striped">
                                <li class="list-group-item">
                                    <svg-icon icon-class="user" class="mr5" />用户名称
                                    <div class="pull-right">{{ user.name }}</div>
                                </li>
                                <li class="list-group-item">
                                    <svg-icon icon-class="phone" class="mr5" />手机号码
                                    <div class="pull-right">{{ user.mobile }}</div>
                                </li>
                                <!-- <li class="list-group-item">
                                <svg-icon icon-class="email" />用户邮箱
                                <div class="pull-right">{{ user.email }}</div>
                            </li> -->
                                <li class="list-group-item">
                                    <svg-icon icon-class="tree" class="mr5" />所属部门
                                    <div class="pull-right"> {{orgInfo.orgName}}
                                        <span v-if=" orgInfo.orgName != orgInfo.deptName"> - {{orgInfo.deptName}}</span>
                                    </div>
                                </li>
                                <!-- <li class="list-group-item">
                                <svg-icon icon-class="peoples" />所属角色
                                <div class="pull-right">{{ roleGroup }}</div>
                            </li>
                            <li class="list-group-item">
                                <svg-icon icon-class="date" />创建日期
                                <div class="pull-right">{{ user.createTime }}</div>
                            </li> -->
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="18" :xs="24">
                    <div class="back-fff pad20 full-height">
                        <!-- <div slot="header" class="clearfix">
                            <span>基本资料</span>
                        </div> -->
                        <p class=" f16 mb20 part-tit">
                            基本资料
                        </p>
                        <el-tabs v-model="activeTab">
                            <!-- <el-tab-pane label="消息设置" name="setNotice">
                            <setNotice :user="user" />
                        </el-tab-pane>
                        <el-tab-pane label="基本资料" name="userinfo">
                            <userInfo :user="user" />
                        </el-tab-pane> -->
                            <el-tab-pane label="修改密码" name="resetPwd">
                                <resetPwd :user="user" />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import setNotice from "./setNotice";

import { getUserProfile } from "@/api/system/user";
import { qmxgetInfo } from "@/api/login";


export default {
    name: "Profile",
    components: { userAvatar, userInfo, resetPwd, setNotice },
    data() {
        return {
            user: {},
            orgInfo: {},
            roleGroup: {},
            postGroup: {},
            activeTab: "resetPwd"
        };
    },
    created() {
        this.getUser();
        this.$store.dispatch('getUserOrgAndDep').then(res => {
            this.orgInfo = res
        })
    },
    methods: {
        getUser() {

            qmxgetInfo().then(response => {
                // console.log(111, response)
                this.user = response.data;
                // this.roleGroup = response.roleGroup;
                // this.postGroup = response.postGroup;
            });

            return
            getUserProfile().then(response => {
                this.user = response.data;
                this.roleGroup = response.roleGroup;
                this.postGroup = response.postGroup;
            });
        }
    }
};
</script>

<style scoped lang="scss">
.userInfoBox {
    label {
        color: #888;
    }
}
.list-group-item {
    padding: 14px 0;
    border-top: none;
}
</style>