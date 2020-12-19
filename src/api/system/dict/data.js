import request from '@/utils/request'

import $axios from '@/utils/http'

import Cookies from 'js-cookie'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}

//************************QMX************************ */

//获取数据字典
export function qmxListData(){

    return $axios.post('common/get/enums')
        .then( res =>{

            Cookies.set('dictData',res.data)
            return res.data
    })

}
//获取数据字典Key
export function qmxDataKey(key){

    return new Promise( (resolve) =>{

        let dataObj =  Cookies.get('dictData') 
        
        if(dataObj && dataObj != 'undefined'){

            if(key){
                resolve( dataObj[key] ) 
            }
            else{
                resolve( dataObj) 
            }
        }
        else{
            qmxListData().then(res =>{
                if(key){
                    resolve( res[key] ) 
                }
                else{
                    resolve( res) 
                }
            })
        }
    })
 
}