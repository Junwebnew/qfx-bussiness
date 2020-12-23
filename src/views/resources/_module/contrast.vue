<template>
    <el-dialog title="异议分析对比" :visible.sync="show" width='1000px'>
        <div style='max-height:550px;overflow:auto'>
            <table class="c-table">
                <thead>
                    <tr>
                        <td>名称</td>
                        <td width='280px'>初审公告</td>
                        <td width='280px'>相似相同</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class='n'>商标图样:</td>
                        <td>
                            <img :src="$getImg(tmJson1.graphicStyle,2) ||  ''" width="70px">
                            <el-button class="fr mr20" type="primary" plain size='mini' @click="ckeckNoticeImg">查看公告图</el-button>
                        </td>
                        <td><img :src="$getImg(tmJson2.graphicStyle,2) ||  ''" width="70px"></td>
                    </tr>
                    <tr>
                        <td class='n'>商标名:</td>
                        <td>
                            {{tmJson1.trademarkName || '--'}}
                        </td>
                        <td>
                            {{tmJson2.trademarkName || '--'}}
                        </td>
                    </tr>
                    <tr>
                        <td class='n'>申请/注册号:</td>
                        <td>{{tmJson1.trademarkNumber || '--'}}</td>
                        <td>{{tmJson2.trademarkNumber || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>商品服务项:</td>
                        <td>
                            <div v-html="tmJson1.goodsServices" class="f12 contr">
                            </div>
                        </td>
                        <td>
                            <div v-html="tmJson2.goodsServices" class="f12 contr">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class='n'>类似群:</td>
                        <td>
                            <div v-html="tmJson1.similarGroup" class="f12 contr">
                                {{tmJson1.goodsServices || '--'}}
                            </div>
                        </td>
                        <td>
                            <div v-html="tmJson2.similarGroup" class="f12 contr">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class='n'>申请日期:</td>
                        <td>{{tmJson1.trademarkApplicationDate || '--'}}</td>
                        <td>{{tmJson2.trademarkApplicationDate || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>初审日期:</td>
                        <td>{{tmJson1.registeredDate || '--'}}</td>
                        <td>{{tmJson2.registeredDate || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>公告期号:</td>
                        <td>{{tmJson1.preliminaryNoticeNum || '--'}}</td>
                        <td>{{tmJson2.preliminaryNoticeNum || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>注册日期:</td>
                        <td>{{tmJson1.registeredAnnNum || '--'}}</td>
                        <td>{{tmJson2.registeredAnnNum || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>申请人</td>
                        <td>{{tmJson1.applicationNameCn || '--'}}</td>
                        <td>{{tmJson2.applicationNameCn || '--'}}</td>
                    </tr>

                    <tr>
                        <td class='n'>申请人地址:</td>
                        <td>{{tmJson1.applicationDddrCn || '--'}}</td>
                        <td>{{tmJson2.applicationDddrCn || '--'}}</td>
                    </tr>
                    <tr>
                        <td class='n'>代理公司:</td>
                        <td>{{tmJson1.agency || '--'}}</td>
                        <td>{{tmJson2.agency || '--'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="show = false">确 定</el-button>
        </div>
        <el-dialog title="公告对比" :visible.sync="contrastNoticePicShow" fullscreen width='100%' append-to-body>
            <div class="maskPic" @click=" contrastNoticePicShow = false">
                <div>
                    <img :src="this.$getImg(tmJson1.noticeFile,1)" alt="">
                </div>
                <div>
                    <img :src="this.$getImg(tmJson2.noticeFile,1)" alt="">
                </div>
            </div>
        </el-dialog>
    </el-dialog>
</template>
<script>

import { getTmDetail, getTmNoticeDetail } from "@/api/resources";
import { Loading } from 'element-ui';

export default {
    data() {
        return {
            show: false,
            tmJson1: {},
            tmJson2: {},
            tele1: '--',
            tele2: '--',
            contrastNoticePicShow: false //展开对比的公告图样
        }
    },
    watch: {
        show(bool) {
            if (!bool) {
                this.tmJson1 = {}
                this.tmJson2 = {}
                this.tele1 = '--'
                this.tele2 = '--'
            }
        }
    },
    methods: {

        getDetail(id1, id2) {


            var loading = Loading.service()

            Promise.all([
                getTmDetail(id1),
                getTmDetail(id2),
            ])
                .then(res => {
                    let data1 = res[0].data,
                        data2 = res[1].data
                    // higthLight
                    if (data1.goodsServices && data2.goodsServices) {

                        this.show = true
                        this.contrastText(data1, data2, 'goodsServices')
                        this.contrastText(data1, data2, 'similarGroup')
                    }

                    this.tmJson1 = data1
                    this.tmJson2 = data2
                })
                .finally(() => {
                    loading.close()
                })
        },
        contrastText(obj1, obj2, key) {
            let arr1 = null, arr2 = null;
            if (key == 'goodsServices') {
                arr1 = obj1[key].split(/;,|,/),
                    arr2 = obj2[key].split(/;,|,/);
            }
            else if (key == 'similarGroup') {

                arr1 = obj1[key] ? obj1[key].replace(/\[|\]|\s/g, '').split(',') : []
                arr2 = obj2[key] ? obj2[key].replace(/\[|\]|\s/g, '').split(',') : []
            }
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i] && arr1[i] != 'undifined' && (arr1[i] == arr2[j])) {
                        arr1[i] = `<i class='higthLight'>${arr1[i]}</i> `
                        arr2[j] = `<i class='higthLight'>${arr2[j]}</i> `
                    }
                }
            }
            if (key == 'goodsServices') {

                obj1[key] = arr1.join('<br/>')
                obj2[key] = arr2.join('<br/>')
            }
            else if (key == 'similarGroup') {
                obj1[key] = arr1.join(',')
                obj2[key] = arr2.join(',')
            }
        },
        ckeckNoticeImg() {
            let id1 = this.tmJson1.id,
                id2 = this.tmJson2.id;

            var loading = Loading.service()
            Promise.all([
                getTmNoticeDetail(id1),
                getTmNoticeDetail(id2)
            ])
                .then(res => {
                    let picId1 = this.findNoticePic(res[0]),
                        picId2 = this.findNoticePic(res[1]);
                    if (picId1 || picId2) {
                        this.tmJson1.noticeFile = picId1
                        this.tmJson2.noticeFile = picId2

                        this.contrastNoticePicShow = true
                    }
                    else {
                        this.$message.error('未找到相关公告图');
                    }
                })
                .finally(() => {
                    loading.close()
                })
        },
        findNoticePic(obj) {
            try {
                for (let item of obj.data) {
                    if (item.noticeTypeCode == "TMZCSQ") {
                        return item.noticeFile
                    }
                }
            }
            catch (msg) {
                console.log('获取公共图片ID失败：' + msg)
                return false
            }
        }
    },
}
</script>
<style lang="scss" scoped>
@import url("../../../assets/styles/table.scss");

::v-deep .el-dialog__body {
    padding: 10px 20px;
}

.contr {
    padding: 0 4px;
    line-height: 18px;
}

.maskPic {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    > div {
        width: 50%;
        height: 100%;
        float: left;
        padding: 10px;
        text-align: center;

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>
