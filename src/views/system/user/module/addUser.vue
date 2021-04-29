<template>
    <div>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
            <div class="pad20">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-row :gutter="20">
                        <!-- <el-col :span="12">
            <el-form-item label="用户账号" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="归属部门" prop="orgId">
                                <treeselect v-model="form.orgId" :options="deptOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择归属部门" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户姓名" prop="name">
                                <el-input v-model="form.name" placeholder="请输入用户姓名" maxlength="30" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="mobile">
                                <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="form.id == undefined">
                            <el-form-item label="用户密码" prop="password">
                                <el-input v-model="form.password" placeholder="请输入用户密码" type="text" :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户性别">
                                <el-select v-model="form.gender" placeholder="请选择" style="width:100%">
                                    <el-option v-for="dict in sexOptions" :key="dict.value" :label="dict.key" :value="dict.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户邮箱" prop="email">
                                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="微信Code" prop="enterpriseMicroSignal">
                                <el-input v-model="form.enterpriseMicroSignal" placeholder="请输入接收消息的企业微信code" maxlength="50" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="外呼坐席">
                                <el-input v-model="form.xxxCode" placeholder="请输入外呼系统的坐席号" maxlength="50" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="状态">
                                <el-radio-group v-model="form.commonStatus">
                                    <el-radio v-for="dict in statusOptions" :key="dict.key" :label="dict.value">{{dict.key}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="人员类型">
                                <el-radio-group v-model="form.whetherAdmin">
                                    <el-radio v-for="dict in adminArr" :key="dict.key" :label="dict.value">{{dict.key}}</el-radio>
                                </el-radio-group>
                                <span class="col-hui"> （管理者可查看本部门所有人员及下属部门数据）</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="用户角色" prop="roleIds">
                                <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width:100%">
                                    <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status == 1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
            <div slot="footer" class="dialog-footer">

                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { qmxUserUpdate, qmxUserDel } from "@/api/system/user";

import { qmxDept } from "@/api/system/dept";
import { qmxRoleList, qmxSaveUserRole, qmxUserRole } from "@/api/system/role";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from 'vuex'


export default {
    name: "AddUser",
    components: { Treeselect },
    props: {
        deptOptions: {
            type: Array
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'rolesId',
            'superAdmin',
            'companyId'
        ])
    },
    data() {

        var validateUseName = (rule, value, callback) => {

            let emojiTest = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

            if (!value) {
                callback(new Error('用户名不能为空'))
            }
            else if (emojiTest.test(value)) {
                callback(new Error('不能输入表情符号'))
            }
            else {

                callback()
            }
        }
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 性别状态字典
            sexOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            // 是否管理员选项
            adminArr: [{ 'key': '管理者', value: 1 }, { 'key': '普通员工', value: 0 }],
            // 表单参数
            form: {
                'password': 123456,
                'whetherAdmin': 0, //是否管理员  0 否 1 是
            },
            // 查询参数
            // 表单校验
            rules: {
                name: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                orgId: [
                    { required: true, message: "归属部门不能为空", trigger: "change" }
                ],
                roleIds: [
                    { required: true, message: "角色不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" }
                ],
                email: [
                    { message: "邮箱地址不能为空", trigger: "blur" },
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                mobile: [
                    { required: true, message: "手机号码不能为空", trigger: "blur" },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {

        this.qmxDataKey('sexEnumList').then(res => {
            this.sexOptions = res
        })

        this.qmxDataKey('enableStatusEnumList').then(res => {
            this.statusOptions = res
        })

        this.getRoleList()

    },
    methods: {
        showFunc(obj, tit) {
            //console.log(11,obj)
            this.reset()

            this.title = tit

            this.form = obj

            console.log(obj)

            if (obj.id) {
                this.getUserRole(obj.id)
            }

            this.open = true
        },
        /*查询角色列表*/
        getRoleList() {
            qmxRoleList({ organizationId: this.organizationId, pageNum: 1, pageSize: 1000 }).then(response => {
                this.roleOptions = response.data;
            })
        },
        //获取已选择的角色
        getUserRole(id) {

            qmxUserRole(id).then(response => {

                let roleIds = response.data.map(i => i.roleId)

                this.$set(this.form, 'roleIds', roleIds)
            })

        },
        /** selectTree 转换部门数据结构 */
        normalizer(node) {
            if (node.treeVoList && !node.treeVoList.length) {
                delete node.treeVoList;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.treeVoList
            };
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                orgId: undefined,
                name: undefined,
                mobile: undefined,
                email: undefined,
                gender: undefined,
                commonStatus: 1,
                password: 123456,
                roleIds: []
            };
            this.resetForm("form");
        },

        /** 提交按钮 新增用户*/
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    this.form.accountType = 10 //子账号
                    this.form.loginName = this.form.mobile
                    this.form.checkStatus = 1 //审核通过
                    this.form.companyId = this.getBelongCompanyId(this.form.orgId) //所属机构id

                    // console.log('000000', this.form.companyId)
                    // return
                    qmxUserUpdate(this.form).then(res => {
                        console.log(111, res)
                        this.addUserRole(res.data)
                    })
                }
            });
        },
        addUserRole(id) {

            let str = this.form.id != undefined ? '修改成功' : '新增成功'

            qmxSaveUserRole({ userId: id, roleIdList: this.form.roleIds, id: this.form.id })
                .then(res => {
                    console.log('角色新增成功', res)
                    this.msgSuccess(str)
                    this.open = false
                    this.$emit('backGetList')
                })
        },
        //获取所属机构ID
        getBelongCompanyId(orgId) {
            if (this.companyId == 1) {

                // console.log(this.deptOptions[0].treeVoList)

                return this.getID(this.deptOptions[0].treeVoList, orgId)

            }
            return this.companyId
        },
        getID(arr, orgId) {

            let bool = false

            for (let item of arr) {

                if (item.id == orgId) {
                    return item.id
                }
                if (item.treeVoList && item.treeVoList.length) {
                    bool = this.getID(item.treeVoList, orgId)
                }

                if (bool) {
                    return item.id
                }
            }

            return bool
        }
    }
};
</script>