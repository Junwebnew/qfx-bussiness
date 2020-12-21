<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <!-- <el-form :model="queryParams" ref="queryForm" label-width="120px">
                <el-row :gutter="20">
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="菜单名称" prop="name" class="el-form-item-none">
                            <el-input v-model="queryParams.name" placeholder="请输入菜单名称" style="width: 100%" clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{'span':10,'offset':6}" :sm="12" :xs="24" align='right'>
                        <el-form-item>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row> -->
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
                <el-form-item label="菜单名称" prop="name" class="el-form-item-none">
                    <el-input v-model="queryParams.name" placeholder="请输入菜单名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
                        <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb20">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

                </el-col>
                <!-- <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            </el-row>

            <el-table v-loading="loading" :data="menuList" row-key="id" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="icon" label="图标" align="center" width="80px">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.iconClass">无</span>
                        <svg-icon v-else :icon-class="scope.row.iconClass" />
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="页面路径" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="viewName" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="sort" label="排序" width="50"></el-table-column>
                <el-table-column prop="isShow" label="显示" align="center" width="80px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isShow == 0 ? "否" : "是" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="缓存" align="center" width="80px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isSaveCache == 0 ? "否" : "是" }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
                <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['t-edit']">修改</el-button>
                        <el-button size="mini" type="text" @click="handleAdd(scope.row)" v-hasPermi="['t-add']">新增</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['t-del']">删除</el-button>
                        <el-button size="mini" type="text" @click="handleBtnBox(scope.row)" v-hasPermi="['t-btn']">按钮</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单">
                            <treeselect v-model="form.parentId" :options="menuListTree" :normalizer="normalizer" placeholder="选择上级菜单" noResultsText="暂无结果" :searchable="true" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="菜单图标">
                            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                                <IconSelect ref="iconSelect" @selected="selected" />
                                <el-input slot="reference" v-model="form.iconClass" placeholder="点击选择图标" readonly>
                                    <svg-icon v-if="form.iconClass" slot="prefix" :icon-class="form.iconClass" class="el-input__icon" style="height: 32px; width: 16px" />
                                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                                </el-input>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="sort">
                            <el-input-number v-model="form.sort" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路由名称" prop="memo">
                            <el-input v-model="form.memo" placeholder="请输入路由名称key" />
                        </el-form-item>
                    </el-col>

                    <!-- <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="路由地址" prop="url">
                            <el-input v-model="form.url" placeholder="请输入路由地址url" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="组件路径" prop="viewName">
                            <el-input v-model="form.viewName" placeholder="请输入组件路径code" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="左侧显示">
                            <el-radio-group v-model="form.isShow">
                                <el-radio :label="1">显示</el-radio>
                                <el-radio :label="0">不显示</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="是否缓存">
                            <el-radio-group v-model="form.isSaveCache">
                                <el-radio :label="1">缓存</el-radio>
                                <el-radio :label="0">不缓存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="btnBoxPar.tit" :visible.sync="btnBoxPar.show" :close-on-click-modal="false" width="600px" append-to-body>
            <el-row>
                <el-col>
                    <el-table :data="btnList" @row-dblclick="dbclick">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="functionKey" label="按钮code">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.isOK || scope.row.isAdd" v-model="scope.row.functionKey" style="width: 100%; hight: 100%"></el-input>
                                <span v-else>{{ scope.row.functionKey }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="functionName" label="按钮名称">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.isOK || scope.row.isAdd" v-model="scope.row.functionName" style="width: 100%; hight: 100%"></el-input>
                                <span v-else>{{ scope.row.functionName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.isAdd">
                                    <div v-show="!scope.row.isOK">
                                        <el-button size="mini" type="text" icon="el-icon-edit" @click="dbclick(scope.row)">修改</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleBtnDelete(scope.row)">删除</el-button>
                                    </div>
                                    <div v-show="scope.row.isOK">
                                        <el-button size="mini" type="text" icon="el-icon-check" @click="addBtnFunc(scope.row)">完成</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-close" @click="scope.row.isOK = false">取消</el-button>
                                    </div>
                                </div>
                                <el-button v-else size="mini" type="text" icon="el-icon-plus" @click="addBtnFunc(scope.row)">新增</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnBoxPar.show = false">完 成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listMenu,
    getMenu,
    delMenu,
    addMenu,
    updateMenu,
    qmxTree,
    qmxUpdateTree,
    qmxBtnList,
    qmxBtnUpdate,
    qmxBtnDel,
    qmxDelTree
} from "@/api/system/menu";
import { deepClone } from "@/utils/index";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
    name: "Menu",
    components: { Treeselect, IconSelect },
    computed: {
        menuListTree() {
            return [
                {
                    id: "0",
                    name: "权科技",
                    children: deepClone(this.menuList)
                }
            ];
        }
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 菜单表格树数据
            menuList: [],
            // 菜单树选项
            menuOptions: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 显示状态数据字典
            visibleOptions: [
                { dictLabel: 1, dictValue: "显示" },
                { dictLabel: 0, dictValue: "隐藏" }
            ],
            // 菜单状态数据字典
            statusOptions: [],
            // 查询参数
            queryParams: {
                name: undefined,
                visible: undefined,
                pageNum: 1,
                pageSize: 30
            },
            //按钮框
            btnBoxPar: {
                tit: "按钮列表",
                id: "",
                show: false
            },
            //按钮列表
            btnList: [{ functionKey: "", functionName: "", isAdd: true }],
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    { required: true, message: "菜单名称不能为空", trigger: "blur" }
                ],
                sort: [
                    { required: true, message: "菜单顺序不能为空", trigger: "blur" }
                ],
                memo: [
                    { required: true, message: "路由名称不能为空", trigger: "blur" }
                ],
                url: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
                viewName: [
                    { required: true, message: "组件地址不能为空", trigger: "blur" }
                ]
            }
        };
    },
    created() {
        this.getList();

        //    try{
        //        require( "@/views/error")
        //    }
        //    catch(msg){
        //        console.log(msg)
        //    }
    },
    methods: {
        // 选择图标
        selected(name) {
            this.form.iconClass = name;
        },
        /** 查询菜单列表 */
        getList() {
            this.loading = true;
            qmxTree(this.queryParams).then(res => {
                this.menuList = this.handleTree(res.data, "id");
                //   console.log(111,this.menuList)
                this.loading = false;
            });
        },
        /** 转换菜单数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            };
        },
        /** 查询菜单下拉树结构 */
        getTreeselect() {
            listMenu().then(response => {
                this.menuOptions = [];
                const menu = { id: 0, name: "主类目", children: [] };
                menu.children = this.handleTree(response.data, "id");
                this.menuOptions.push(menu);
            });
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
                parentId: "0",
                name: undefined,
                iconClass: undefined,
                sort: undefined,
                viewName: undefined,
                memo: undefined,
                isShow: 1,
                isSaveCache: 0
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            //this.getTreeselect();
            if (row != null && row.id) {
                this.form.parentId = row.id;
            }
            this.open = true;
            this.title = "添加菜单";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.form = deepClone(row);
            this.open = true;
            this.title = "修改菜单";
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // require("@/views/"+this.form.viewName)   //上线后加上，避免错误组件造成页面崩溃

                    let str = this.form.id != undefined ? "修改成功" : "新增成功";

                    qmxUpdateTree(this.form).then(response => {
                        this.msgSuccess(str);
                        this.open = false;
                        this.getList();
                    });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function () {
                    return qmxDelTree([row.id]);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
        //打开按钮的盒子
        handleBtnBox(row) {
            this.btnBoxPar = {
                tit: row.name + " 按钮列表",
                id: row.id
            };

            this.getBtnListFunc();
        },
        getBtnListFunc() {
            if (this.btnBoxPar.id) {
                qmxBtnList(this.btnBoxPar.id).then(res => {
                    this.assBtnList(res.data);

                    this.$set(this.btnBoxPar, "show", true);
                });
            } else {
                this.msgError("菜单ID不存在");
            }
        },
        assBtnList(arr) {
            let lastOne = [{ functionKey: "", functionName: "", isAdd: true }];

            this.btnList = arr.concat(lastOne);
        },
        handleAddBtn() {
            let btnList = this.btnList,
                len = btnList.length;

            if (
                len == 0 ||
                (btnList[len - 1].functionKey && btnList[len - 1].functionName)
            ) {
            }
        },
        dbclick(row, event, column) {
            this.$set(row, "isOK", !row.isOK);
        },
        addBtnFunc(row) {
            //console.log(111,row)

            if (!row.functionName || !row.functionKey) {

                this.msgError("请完善按钮信息");

                return;
            }

            row.menuId = this.btnBoxPar.id;
            let str = this.form.id != undefined ? "修改成功" : "新增成功";

            qmxBtnUpdate(row).then(res => {
                // this.msgSuccess(str);
                this.getBtnListFunc();
            });
        },
        handleBtnDelete(row) {
            this.$confirm(
                '是否确认删除名称为"' + row.functionName + '"的按钮?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function () {
                    return qmxBtnDel([row.id]);
                })
                .then(() => {
                    this.getBtnListFunc();
                    // this.msgSuccess("删除成功");
                });
        }
    }
};
</script>
