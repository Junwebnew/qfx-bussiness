<template>
    <div class="app-container" id='con'>
        <div class="back-fff pad20 mb10" v-for="( value , key ,idx ) in dictObj" :key="idx">
            <el-row :gutter="10" class="section">
                <el-col>
                    <p class="tit">{{value[0].typeName}}</p>
                </el-col>
                <el-col :lg="value.length > 1 ? 12 :24 " :sm="24" :xs="24" v-for="item in value" :key="item.id">
                    <div class="item">
                        <div class="editBox">
                            <span class="mr10">{{item.name}} :</span>
                            <template v-if='item.isEdit'>
                                <el-input v-if="istext(item.typeId)" v-model="item.newValue" class="ipt" size="mini"></el-input>
                                <el-input-number v-else v-model="item.newValue" :min="1" :max="100000" size="mini" label="比例"></el-input-number>
                            </template>
                            <span v-else class="num">{{item.value}}</span>
                        </div>
                        <template v-if='item.isEdit'>
                            <el-button size="mini" type="text" @click="bandleCancel(item)">取消</el-button>
                            <el-button type="text" size="mini" @click="bandleSave(item)">保存</el-button>
                        </template>
                        <!-- type="primary" -->
                        <template v-else>
                            <el-button type="text" size="mini" @click="bandleEdit(item)">编辑</el-button>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>

import { getDictData, setDictData } from "@/api/system/dict/data";
import { deepClone } from '@/utils/index'

import { mapGetters } from 'vuex'
export default {
    name: "Dept",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //列表数据
            dictObj: {},
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin',
        ])
    },
    created() {
        this.getList();
    },
    methods: {

        getList() {

            const loading = this.loadingShow()

            getDictData().then(res => {
                this.dictObj = this.assType(res.data)
                loading.close()
            })

        },
        assType(arr) {
            let obj = {}
            arr.map(item => {
                if (obj[item.code]) {
                    obj[item.code].push(item)
                }
                else {
                    obj[item.code] = [item]
                }
            })
            return obj
        },
        loadingShow() {

            const loading = this.$loading({
                lock: true,
                target: "#con"
            });

            return loading
        },
        //文本框
        istext(typeId) {
            let textArr = ['8', '9', '10', '13']
            return textArr.includes(typeId)
        },
        //编辑
        bandleEdit(item) {
            this.$set(item, 'newValue', item.value)
            this.$set(item, 'isEdit', true)
        },
        //保存
        bandleSave(item) {

            const loading = this.loadingShow()

            setDictData({ id: item.id, value: item.newValue }).then(res => {
                this.msgSuccess("更新成功!");
                item.value = item.newValue
                this.$set(item, 'isEdit', false)

                this.$store.commit('SET_PRICE', [])

                loading.close()
            })
                .catch(res => {
                    console.log('失败', res)
                    loading.close()
                })
        },
        //取消
        bandleCancel(item) {
            this.$set(item, 'isEdit', false)
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/variables.scss";
.section {
    // padding-top: 20px;
    // margin-bottom: 20px;
    .tit {
        border-bottom: 1px solid #f0f0f0;
        color: #333;
        padding-bottom: 14px;
        font-size: 16px;
        line-height: 30px;
        height: 44px;
        margin-bottom: 10px;
    }
    .item {
        padding: 10px 0px 0 0;
        margin-bottom: 10px;
        .editBox {
            display: inline;
            // min-width: 280px;
            margin-right: 10px;
        }
        .num {
            color: $col;
            font-weight: bolder;
        }
        .ipt {
            width: 260px;
        }
    }
    .desc {
        color: rgba(0, 0, 0, 0.45);
        margin: 4px 0 10px;
    }
}
</style>