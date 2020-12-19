
import $axios from '@/utils/http'

//获取日志
export function qmxLogList(data) {
    return $axios.post('back/systemLog/page/list', data)
}
