<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6" :xs="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>个人信息</span>
                    </div>
                    <div>
                        <div class="text-center">
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
                                <div class="pull-right">{{ user.userOrganizationName }} </div>
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
                </el-card>
            </el-col>
            <el-col :span="18" :xs="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>基本资料</span>
                    </div>
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
                </el-card>
            </el-col>
        </el-row>
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
            roleGroup: {},
            postGroup: {},
            activeTab: "resetPwd"
        };
    },
    created() {
        this.getUser();
    },
    methods: {
        getUser() {

            qmxgetInfo().then(response => {
                console.log(111, response)
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
