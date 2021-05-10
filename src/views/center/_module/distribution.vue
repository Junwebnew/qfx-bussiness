<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal='false' append-to-body>
        <div class="pad0-20">
            <div>
                <el-form label-width="80px" @submit.native.prevent>
                    <el-form-item label="用户名称" prop="name" class="el-form-item-none">
                        <el-input v-model="queryParams.name" placeholder="请输入用户名称" clearable size="small" style="width: 70%" @keyup.enter.native="getList" />
                        <el-button class="ml20" size="mini" type="primary" @click="getList">搜 索</el-button>

                    </el-form-item>
                    <el-form-item label="已选用户" prop="name" class="el-form-item-none" v-if="isBatch">
                        <el-tag :key="tag.id" v-for="(tag,idx) in ids" closable :disable-transitions="false" @close="handleClose(tag,idx)" size='small' class="mr10">
                            {{tag.name}}
                        </el-tag>
                        <el-button type="success" size="mini" @click="handleDistributionIdx()" :disabled="!ids.length">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table v-loading="loading" ref='multipleTable' :data="userList" @selection-change="handleSelectionChange" @select='handleSelection' @select-all='handleSelectionAll'>
                <el-table-column type='selection' width="50" v-if="isBatch"></el-table-column>
                <el-table-column type="index" width="50" align="center" />
                <el-table-column label="用户名称" align="center" prop="name">
                    <template slot-scope="scope">
                        <span class="mr5">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" align="center" prop="organizationName" :show-overflow-tooltip="true" />
                <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="col" size="mini" type="text" @click="handleDistribution(scope.row)">{{showStr}}</el-button>
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
        showStr: {
            type: String,
            default: '分配'
        },
        //是否可以多选
        isBatch: {
            type: Boolean,
            default: false
        },

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
            //选中的id
            ids: []
        };
    },
    created() {


    },
    methods: {
        show(obj, tit) {
            //console.log(11,obj)
            this.reset()
            this.ids = []
            this.title = tit || '分配'

            this.open = true
            this.getList()
        },

        /** 查询用户列表 */
        getList() {
            this.loading = true;
            qmxUserList(this.queryParams).then(response => {
                this.userList = response.data.filter(i => i.id != this.userId);
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
        //多选的删除
        handleClose(row, idx) {
            this.$refs.multipleTable.toggleRowSelection(row, false)
            this.ids.splice(idx, 1)
        },
        /** 提交按钮 新增用户*/
        handleDistribution(row) {
            this.$emit('finish', row)
            this.open = false
        },
        //多选框单独点击
        handleSelection(selection, row) {

            // console.log('9999', selection)
            // console.log('66666', row)
            for (let i = 0; i < this.ids.length; i++) {
                if (row.id == this.ids[i].id) {
                    this.ids.splice(i, 1)
                    return
                }
            }

            this.ids.push(row)

        },
        //多选框全选与取消
        handleSelectionAll(selection) {

            if (selection.length > 0) {
                for (let item of selection) {
                    let bool = false
                    this.ids.map(idxItme => {
                        if (idxItme.id == item.id) {
                            bool = true
                        }
                    })
                    if (!bool) {
                        this.ids.push(item)
                    }
                }
            }
            else {
                for (let item of this.userList) {

                    for (let i = 0; i < this.ids.length; i++) {
                        if (item.id == this.ids[i].id) {
                            this.ids.splice(i, 1)

                        }
                    }
                }
            }

        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            // this.ids = selection.map(item => item.id)

            // this.ids.push(...selection)
            // for (let item of selection) {
            //     let bool = false
            //     this.ids.map(idxItme => {
            //         if (idxItme.id == item.id) {
            //             bool = true
            //         }
            //     })
            //     if (!bool) {
            //         this.ids.push(item)
            //     }
            // }
        },
        //批量操作
        handleDistributionIdx() {
            // let arr = this.$refs.multipleTable.selection
            this.$emit('finish', this.ids)
            this.open = false
        }
    }
};
</script>