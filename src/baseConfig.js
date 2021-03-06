
//后台请求地址
//  const publicUrl = 'http://gw.qmxip.com/'

var publicUrl = 'http://192.168.0.251:9007/'

publicUrl = 'http://192.168.0.13:9007/'

// publicUrl = 'http://39.99.128.104:9007/'

publicUrl = 'https://qufax.zaiqicloud.com:9007/'


//图片请求地址
const baseImgUrl = '//image.qmxip.com/'

//权明星网址
const qmxOnlineUrl = 'https://gw.qmxip.com/'



/*资源类型 1:近日申请,2:异议分析,3:商标续展,4:代理注销,5:商标变更,6:疑似驳回,7:企业白名单,8:送达公告,9:到期未续展,10:外部资源的导入*/

//各资源模块对应关系
const resourseConfig = [
    { id: "1344173032301821954", name: "近日申请", key: 'recent-apply' },
    { id: "1344241701388201986", name: "异议分析", key: 'objection-analysis' },
    { id: "1344173049066455042", name: "商标续展", key: 'renewal' },
    { id: "1344173216280772609", name: "代理注销", key: 'agency-cancel' },
    { id: "1344173201047060482", name: "商标变更", key: 'change' },
    { id: "1344241701266567170", name: "疑似驳回", key: 'reject' },
    { id: "1344241701547585538", name: "商标求购", key: 'resource-buy' },
    { id: "1344241701484670977", name: "企业白名单", key: 'white-list' },
    { id: "1344241701484670978", name: "送达公告", key: 'serving-notice' },
    { id: "1344241701547586666", name: "到期未续展", key: 'notContinues' },
    { id: "1344241701547586688", name: "外部资源导入", key: 'otherResourse"' }
]


export { publicUrl, baseImgUrl, qmxOnlineUrl, resourseConfig }
