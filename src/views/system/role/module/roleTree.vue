<template>
    <el-drawer :title="title" :visible.sync="show" :direction="direction" :size='"400px"' style="overflow:auto" :append-to-body="true">
        <div class="draw_con">
            <div class="mb10">
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            </div>
            <div class="middle">
                <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menu" node-key="id" :check-strictly="menuCheckStrictly" :default-expand-all='showAll' empty-text="加载中，请稍后" :props="defaultProps">
                    <span class="custom-tree-node" slot-scope="{ node,data }">

                        <span class="f12"><i :class="data.isFunction == 1 ? 'f14 ' : 'f14 el-icon-menu'  "></i> {{node.label }}</span>

                        <!-- <span class="f12">{{data.isFunction == 1 ? '按钮_' : ''}} {{node.label }}</span> -->
                    </span>
                </el-tree>
            </div>
        </div>
        <div class="fix-foot text-right">
            <el-button @click="show = false">取 消</el-button>
            <el-button class="ml20" type="primary" @click="submitForm">保 存</el-button>
        </div>
    </el-drawer>
</template>
<script>

import { qmxRoleTree } from "@/api/system/menu";
import { qmxSaveRoleList } from "@/api/system/role";
export default {
    props: {

    },
    components: {

    },
    watch: {
    },
    data() {
        return {
            show: false,
            title: '',
            direction: 'rtl',
            menuOptions: [],
            menuExpand: false,
            menuNodeAll: false,
            menuCheckStrictly: false,
            showAll: true,
            selectArr: [],
            roleId: "",
            form: {},
            defaultProps: {
                children: "menuFunctionTreeVoList",
                label: "name"
            },
        };

    },
    methods: {
        showFunc(row) {

            this.title = row.name + ' 菜单权限'
            this.roleId = row.id
            this.menuCheckStrictly = true

            qmxRoleTree(row.id).then(res => {


                let newArr = []

                this.recurrenceSelect(res.data, newArr)

                this.menuOptions = res.data

                this.show = true

                this.$nextTick(() => {
                    this.$refs.menu.setCheckedKeys(newArr);

                    this.menuCheckStrictly = false
                })
            })
        },
        /** 查询菜单树结构 type:true 登录人的菜单树*/
        recurrenceSelect(arr, newArr) {

            arr.map(item => {
                if (item.hasRole === 1) {
                    newArr.push(item.id)
                }
                if (item.menuFunctionTreeVoList && item.menuFunctionTreeVoList.length > 0) {
                    this.recurrenceSelect(item.menuFunctionTreeVoList, newArr)
                }
            })
        },
        // 树权限（展开/折叠）
        handleCheckedTreeExpand(value, type) {
            if (type == 'menu') {
                let treeList = this.menuOptions;
                for (let i = 0; i < treeList.length; i++) {
                    this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
                }
            } else if (type == 'dept') {
                let treeList = this.deptOptions;
                for (let i = 0; i < treeList.length; i++) {
                    this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
                }
            }
        },
        // 树权限（全选/全不选）
        handleCheckedTreeNodeAll(value, type) {
            if (type == 'menu') {
                this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
            } else if (type == 'dept') {
                this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
            }
        },
        // 树权限（父子联动）
        handleCheckedTreeConnect(value, type) {
            if (type == 'menu') {
                this.menuCheckStrictly = value ? true : false;
            } else if (type == 'dept') {
                this.deptCheckStrictly = value ? true : false;
            }
        },
        submitForm() {
            let checkedKeys = this.getMenuAllCheckedKeys()

            qmxSaveRoleList({ functionIdList: checkedKeys, roleId: this.roleId }).then(res => {

                this.show = false
            })
        },
        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            let checkedKeys = this.$refs.menu.getCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);

            return checkedKeys;
        },
    },
    beforeDestroy() {

    }
}
</script>
<style lang="scss" scoped>
.draw_con {
    padding: 0 20px 80px;
    height: 100%;
}
.middle {
    height: calc(100vh - 144px);
    overflow: auto;
    border: 1px solid #e5e6e7;

    .tree-border {
        font-size: 12px;
        border: none;
    }
}

.fix-foot {
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    padding: 10px 20px 10px 0;
    text-align: center;
    background: #ffffff;
    z-index: 3;
    .btn {
        margin: 0 30px;
    }
}

::v-deep .el-drawer__header {
    margin-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    span {
        outline: none;
        font-size: 16px;
        font-weight: bolder;
        color: #333;
    }
}
</style>