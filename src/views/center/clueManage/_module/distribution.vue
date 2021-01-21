<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <div class="pad0-20">
            <div>
                <el-form label-width="80px" @submit.native.prevent>
                    <el-form-item label="用户名称" prop="name" class="el-form-item-none">
                        <el-input v-model="queryParams.name" placeholder="请输入用户名称" clearable size="small" style="width: 70%" @keyup.enter.native="getList" />

                        <el-button class="ml20" size="mini" type="primary" @click="getList">搜 索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table v-loading="loading" :data="userList">
                <el-table-column type="index" width="50" align="center" />
                <el-table-column label="用户名称" align="center" prop="name">
                    <template slot-scope="scope">
                        <span class="mr5">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" align="center" prop="organizationName" :show-overflow-tooltip="true" />
                <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="col" size="mini" type="text" @click="handleDistribution(scope.row)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" layout='total, prev, pager, next' />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { qmxUserList } from "@/api/system/user";
import { mapGetters } from 'vuex'

export default {
    props: {
        ids: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    data() {
        return {
            // 遮罩层
            loading: true,

            // 弹出层标题
            title: "分配",

            //数据列表
            userList: [],
            //总数
            total: 0,
            // 是否显示弹出层
            open: false,

            // 表单参数
            queryParams: {
                pageNum: 1,
                pageSize: 8,
                name: undefined,
                orgId: ''
            },
        };
    },
    created() {


    },
    methods: {
        show(obj, tit) {
            //console.log(11,obj)
            this.reset()

            this.title = tit || '分配'

            this.open = true
            this.getList()
        },

        /** 查询用户列表 */
        getList() {
            this.loading = true;
            qmxUserList(this.queryParams).then(response => {
                this.userList = response.data;
                this.total = response.total;
                this.loading = false;
            })

        },
        reset() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 8,
                name: undefined,
                orgId: this.organizationId
            }
        },
        /** 提交按钮 新增用户*/
        handleDistribution(row) {

            this.$emit('finish', row.id)
            this.open = false

        },
    }
};
</script>